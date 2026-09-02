import type { LeagueTier } from "@prisma/client";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { runLeagueRolloverIfDue } from "@/lib/social/league-rollover";
import { db } from "@/lib/db";

import { createTestLesson, createTestUser, resetSocialTables } from "./helpers";

/** Crea una season YA VENCIDA con una sola división de `tier` y N miembros con XP dado. */
async function seedDueSeason(tier: LeagueTier, xpByIndex: number[]) {
  const lesson = await createTestLesson();
  const now = new Date();
  const startsAt = new Date(now.getTime() - 8 * 86_400_000);
  const endsAt = new Date(now.getTime() - 60_000); // ya venció

  const season = await db.leagueSeason.create({
    data: { key: `season-test-${Date.now()}`, startsAt, endsAt, status: "open" },
  });
  const division = await db.leagueDivision.create({
    data: { seasonId: season.id, tier, number: 1 },
  });

  const users = await Promise.all(xpByIndex.map((_, i) => createTestUser(`m${i}`)));
  await db.leagueMembership.createMany({
    data: users.map((u) => ({ seasonId: season.id, divisionId: division.id, userId: u.id })),
  });

  // XpAward DENTRO de la ventana de la season que cierra.
  const mid = new Date(startsAt.getTime() + 1000);
  for (let i = 0; i < users.length; i++) {
    if (xpByIndex[i]! > 0) {
      await db.xpAward.create({
        data: {
          userId: users[i]!.id,
          amount: xpByIndex[i]!,
          reason: "lesson_completed",
          dedupeKey: `lesson:seed-${i}`,
          lessonId: lesson.id,
          earnedAt: mid,
        },
      });
    }
  }
  return { season, users };
}

describe("League rollover — Postgres real", () => {
  beforeEach(async () => {
    await resetSocialTables();
    await db.leagueMembership.deleteMany({});
    await db.leagueDivision.deleteMany({});
    await db.leagueSeason.deleteMany({});
  });
  afterAll(async () => {
    await resetSocialTables();
    await db.leagueMembership.deleteMany({});
    await db.leagueDivision.deleteMany({});
    await db.leagueSeason.deleteMany({});
    await db.$disconnect();
  });

  it("N=20 en gold: top5 promueven a platinum, bottom5 bajan a silver, resto se queda", async () => {
    const xp = Array.from({ length: 20 }, (_, i) => (20 - i) * 10); // 200..10, ranks 1..20
    const { season, users } = await seedDueSeason("gold", xp);

    const result = await runLeagueRolloverIfDue(new Date());
    expect(result.rolled).toBe(true);

    const memberships = await db.leagueMembership.findMany({
      where: { seasonId: season.id },
      orderBy: { finalRank: "asc" },
    });
    expect(memberships).toHaveLength(20);
    expect(memberships[0]?.outcome).toBe("promoted");
    expect(memberships[0]?.nextTier).toBe("platinum");
    expect(memberships[4]?.outcome).toBe("promoted");
    expect(memberships[5]?.outcome).toBe("stayed");
    expect(memberships[14]?.outcome).toBe("stayed");
    expect(memberships[15]?.outcome).toBe("relegated");
    expect(memberships[15]?.nextTier).toBe("silver");
    expect(memberships[19]?.outcome).toBe("relegated");

    // La season vieja quedó cerrada; existe una nueva abierta.
    const closed = await db.leagueSeason.findUnique({ where: { id: season.id } });
    expect(closed?.status).toBe("closed");
    const openSeason = await db.leagueSeason.findFirst({ where: { status: "open" } });
    expect(openSeason).not.toBeNull();

    // El promovido #1 tiene membership nueva en platinum; el relegado #20 en silver.
    const top = memberships[0]!;
    const bottom = memberships[19]!;
    const newTop = await db.leagueMembership.findFirst({
      where: { seasonId: openSeason!.id, userId: top.userId },
      include: { division: true },
    });
    const newBottom = await db.leagueMembership.findFirst({
      where: { seasonId: openSeason!.id, userId: bottom.userId },
      include: { division: true },
    });
    expect(newTop?.division.tier).toBe("platinum");
    expect(newBottom?.division.tier).toBe("silver");
    void users;
  });

  it("Diamond top queda held_at_ceiling (no hay tier arriba)", async () => {
    const xp = Array.from({ length: 20 }, (_, i) => (20 - i) * 10);
    const { season } = await seedDueSeason("diamond", xp);
    await runLeagueRolloverIfDue(new Date());

    const top = await db.leagueMembership.findFirst({
      where: { seasonId: season.id },
      orderBy: { finalRank: "asc" },
    });
    expect(top?.outcome).toBe("held_at_ceiling");
    expect(top?.nextTier).toBe("diamond");
  });

  it("Bronze bottom queda held_at_floor (no hay tier abajo)", async () => {
    const xp = Array.from({ length: 20 }, (_, i) => (20 - i) * 10);
    const { season } = await seedDueSeason("bronze", xp);
    await runLeagueRolloverIfDue(new Date());

    const bottom = await db.leagueMembership.findFirst({
      where: { seasonId: season.id },
      orderBy: { finalRank: "desc" },
    });
    expect(bottom?.outcome).toBe("held_at_floor");
    expect(bottom?.nextTier).toBe("bronze");
  });

  it("miembro con finalXp=0 NO se pre-asigna a la nueva season", async () => {
    const xp = [50, 0];
    const { season, users } = await seedDueSeason("silver", xp);
    await runLeagueRolloverIfDue(new Date());

    const openSeason = await db.leagueSeason.findFirst({ where: { status: "open" } });
    const inactiveMembership = await db.leagueMembership.findFirst({
      where: { seasonId: openSeason!.id, userId: users[1]!.id },
    });
    expect(inactiveMembership).toBeNull();

    const oldRow = await db.leagueMembership.findFirst({
      where: { seasonId: season.id, userId: users[1]!.id },
    });
    expect(oldRow?.finalXp).toBe(0);
    expect(oldRow?.outcome).not.toBeNull(); // sí recibe outcome/tier histórico
  });

  it("dos workers concurrentes: sólo uno rueda la season", async () => {
    const xp = [100, 50];
    await seedDueSeason("silver", xp);
    const now = new Date();

    const [a, b] = await Promise.all([
      runLeagueRolloverIfDue(now),
      runLeagueRolloverIfDue(now),
    ]);
    const rolledCount = [a.rolled, b.rolled].filter(Boolean).length;
    expect(rolledCount).toBe(1);

    // Sólo una season cerrada, una abierta.
    const closedCount = await db.leagueSeason.count({ where: { status: "closed" } });
    const openCount = await db.leagueSeason.count({ where: { status: "open" } });
    expect(closedCount).toBe(1);
    expect(openCount).toBe(1);
  });

  it("award exactamente en la frontera: earnedAt < end cuenta, earnedAt >= end NO", async () => {
    const { season, users } = await seedDueSeason("silver", [0, 0]);
    // Un award justo ANTES de endsAt (cuenta) y uno justo EN/DESPUÉS (no cuenta).
    await db.xpAward.create({
      data: {
        userId: users[0]!.id,
        amount: 30,
        reason: "lesson_completed",
        dedupeKey: "lesson:boundary-in",
        lessonId: (await createTestLesson()).id,
        earnedAt: new Date(season.endsAt.getTime() - 1),
      },
    });
    await db.xpAward.create({
      data: {
        userId: users[1]!.id,
        amount: 999,
        reason: "lesson_completed",
        dedupeKey: "lesson:boundary-out",
        lessonId: (await createTestLesson()).id,
        earnedAt: season.endsAt,
      },
    });

    await runLeagueRolloverIfDue(new Date());

    const m0 = await db.leagueMembership.findFirst({ where: { seasonId: season.id, userId: users[0]!.id } });
    const m1 = await db.leagueMembership.findFirst({ where: { seasonId: season.id, userId: users[1]!.id } });
    expect(m0?.finalXp).toBe(30);
    expect(m1?.finalXp).toBe(0);
  });
});
