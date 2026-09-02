import { Prisma, type LeagueTier } from "@prisma/client";

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  assignToSmallestDivision,
  ensureCurrentSeason,
  ROLLOVER_ADVISORY_LOCK_KEY,
  seasonKeyFor,
} from "@/lib/social/league-season";
import { balancedDivisionSizes, divisionCountFor, resolveRolloverOutcome } from "@/lib/social/league";
import { rankMembers } from "@/lib/social/ranking";
import { emitSocialEvent } from "@/lib/social/social-events";
import { mxWeekRange } from "@/lib/social/time";

/**
 * Corre el rollover si la season abierta vigente ya venció. Idempotente
 * ante dos workers: el "claim" (`open` → `closing`, `updateMany`
 * condicionado) hace que sólo uno proceda; el otro ve `count === 0` y
 * regresa sin hacer nada. Si el claimant falla a mitad de camino, revierte
 * el claim para que un siguiente intento lo retome — nunca deja la season
 * atascada en `closing`.
 */
export async function runLeagueRolloverIfDue(now: Date = new Date()): Promise<{ rolled: boolean }> {
  const season = await ensureCurrentSeason(now);
  if (now < season.endsAt) return { rolled: false };

  const claimed = await db.leagueSeason.updateMany({
    where: { id: season.id, status: "open" },
    data: { status: "closing" },
  });
  if (claimed.count === 0) return { rolled: false };

  try {
    await db.$transaction(
      async (tx) => {
        // Lock global del rollover — cluster-wide, cae automáticamente al
        // terminar la transacción (éxito o rollback).
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${ROLLOVER_ADVISORY_LOCK_KEY})`;

        const memberships = await tx.leagueMembership.findMany({
          where: { seasonId: season.id },
          select: { id: true, userId: true, divisionId: true, division: { select: { tier: true } } },
        });

        const newSeasonStart = season.endsAt;
        const newSeasonEnd = mxWeekRange(new Date(newSeasonStart.getTime() + 86_400_000)).end;
        const newSeason = await tx.leagueSeason.create({
          data: {
            key: seasonKeyFor(newSeasonStart),
            startsAt: newSeasonStart,
            endsAt: newSeasonEnd,
            status: "open",
          },
        });

        if (memberships.length > 0) {
          const sums = await tx.xpAward.groupBy({
            by: ["userId"],
            where: {
              userId: { in: memberships.map((m) => m.userId) },
              earnedAt: { gte: season.startsAt, lt: season.endsAt },
              reason: { not: "legacy_balance" },
            },
            _sum: { amount: true },
            _max: { earnedAt: true },
          });
          const xpByUser = new Map(
            sums.map((s) => [s.userId, { xp: s._sum.amount ?? 0, lastAwardAt: s._max.earnedAt }]),
          );

          const byDivision = new Map<string, typeof memberships>();
          for (const m of memberships) {
            const list = byDivision.get(m.divisionId) ?? [];
            list.push(m);
            byDivision.set(m.divisionId, list);
          }

          // PASE 1 — cierra cada división vieja: rank, finalXp/finalRank,
          // outcome/nextTier, evento de promoción. Junta a los que quedan
          // con finalXp>0 para la formación de la nueva season (PASE 2).
          const carryForward: { userId: string; nextTier: LeagueTier; finalXp: number }[] = [];

          for (const [, members] of byDivision) {
            const tier = members[0]!.division.tier;
            const ranked = rankMembers(
              members.map((m) => ({
                userId: m.userId,
                xp: xpByUser.get(m.userId)?.xp ?? 0,
                lastAwardAt: xpByUser.get(m.userId)?.lastAwardAt ?? null,
              })),
            );

            for (const { member, rank } of ranked) {
              const { outcome, nextTier } = resolveRolloverOutcome(rank, ranked.length, tier);
              const row = members.find((m) => m.userId === member.userId)!;

              await tx.leagueMembership.update({
                where: { id: row.id },
                data: { finalXp: member.xp, finalRank: rank, outcome, nextTier },
              });

              if (outcome === "promoted") {
                await emitSocialEvent(tx, {
                  actorId: member.userId,
                  kind: "league_promoted",
                  dedupeKey: `league_promoted:${season.id}`,
                  value: null,
                });
              }

              // finalXp=0 → historia queda, pero NO se pre-asigna: entra
              // como midweek entrant si vuelve y gana XP (Fase 4 §8).
              if (member.xp > 0) {
                carryForward.push({ userId: member.userId, nextTier, finalXp: member.xp });
              }
            }
          }

          // PASE 2 — forma las divisiones de la NUEVA season, un tier a la
          // vez: divisionCount = max(1, round(N/20)), tamaños balanceados,
          // orden XP desc → userId asc (secundario razonable y estable sin
          // reintroducir curso/actividad reciente, que ya decidió el orden
          // de empate arriba).
          const byTier = new Map<LeagueTier, typeof carryForward>();
          for (const c of carryForward) {
            const list = byTier.get(c.nextTier) ?? [];
            list.push(c);
            byTier.set(c.nextTier, list);
          }

          for (const [tier, entrants] of byTier) {
            const sorted = [...entrants].sort((a, b) => {
              if (b.finalXp !== a.finalXp) return b.finalXp - a.finalXp;
              return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0;
            });
            const divisionCount = divisionCountFor(sorted.length);
            const sizes = balancedDivisionSizes(sorted.length, divisionCount);

            let cursor = 0;
            for (let i = 0; i < divisionCount; i++) {
              const division = await tx.leagueDivision.create({
                data: { seasonId: newSeason.id, tier, number: i + 1 },
                select: { id: true },
              });
              const chunk = sorted.slice(cursor, cursor + sizes[i]!);
              cursor += sizes[i]!;
              if (chunk.length > 0) {
                await tx.leagueMembership.createMany({
                  data: chunk.map((c) => ({
                    seasonId: newSeason.id,
                    divisionId: division.id,
                    userId: c.userId,
                  })),
                });
              }
            }
          }
        }

        await tx.leagueSeason.update({
          where: { id: season.id },
          data: { status: "closed", closedAt: now },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 15_000, timeout: 60_000 },
    );

    logger.info({ seasonId: season.id }, "league rollover completado");
    return { rolled: true };
  } catch (err) {
    // Revierte el claim para que un siguiente intento del job lo retome —
    // nunca deja la season atascada en `closing`.
    await db.leagueSeason.updateMany({
      where: { id: season.id, status: "closing" },
      data: { status: "open" },
    });
    logger.error({ err, seasonId: season.id }, "league rollover falló — claim revertido");
    throw err;
  }
}

async function lastKnownTier(userId: string): Promise<LeagueTier> {
  const lastClosed = await db.leagueMembership.findFirst({
    where: { userId, season: { status: "closed" } },
    orderBy: { season: { endsAt: "desc" } },
    select: { nextTier: true },
  });
  return lastClosed?.nextTier ?? "bronze";
}

/**
 * Entrantes midweek: usuarios con XP competitivo en la season abierta que
 * todavía no tienen membership ahí (nunca tuvieron una, o volvieron tras
 * inactividad). Tier según su última membership CERRADA; sin historia,
 * bronze. Va a la división más pequeña del tier con <25 miembros.
 */
export async function assignMidweekEntrants(now: Date = new Date()): Promise<number> {
  const season = await ensureCurrentSeason(now);

  const earners = await db.xpAward.findMany({
    where: {
      earnedAt: { gte: season.startsAt, lt: season.endsAt },
      reason: { not: "legacy_balance" },
    },
    distinct: ["userId"],
    select: { userId: true },
  });
  if (earners.length === 0) return 0;

  const existing = await db.leagueMembership.findMany({
    where: { seasonId: season.id, userId: { in: earners.map((e) => e.userId) } },
    select: { userId: true },
  });
  const existingIds = new Set(existing.map((m) => m.userId));
  const newcomers = earners.filter((e) => !existingIds.has(e.userId));
  if (newcomers.length === 0) return 0;

  let assigned = 0;
  for (const entrant of newcomers) {
    const tier = await lastKnownTier(entrant.userId);
    await db.$transaction(async (tx) => {
      const already = await tx.leagueMembership.findUnique({
        where: { seasonId_userId: { seasonId: season.id, userId: entrant.userId } },
      });
      if (already) return;
      const divisionId = await assignToSmallestDivision(tx, season.id, tier);
      await tx.leagueMembership.create({
        data: { seasonId: season.id, divisionId, userId: entrant.userId },
      });
    });
    assigned++;
  }
  return assigned;
}
