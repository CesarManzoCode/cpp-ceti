import { Prisma, type LeagueTier } from "@prisma/client";

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { mxWeekKey, mxWeekRange } from "@/lib/social/time";

/** Clave global fija del advisory lock del rollover — un solo rollover a la vez, cluster-wide. */
const ROLLOVER_ADVISORY_LOCK_KEY = 872364501;

/** Divisiones nuevas apuntan a <25 miembros antes de abrir otra (Fase 4 §5). */
const MIDWEEK_DIVISION_SOFT_CAP = 25;

export function seasonKeyFor(date: Date): string {
  return `season-${mxWeekKey(date)}`;
}

/**
 * Devuelve la season `open` vigente, creando la PRIMERA si nunca hubo
 * ninguna. El bootstrap arranca en el PRÓXIMO lunes — nunca a mitad de
 * semana — para que "desde el primer lunes completo después del cutover"
 * sea literal: ninguna season cubre una semana parcial.
 */
export async function ensureCurrentSeason(now: Date = new Date()): Promise<{
  id: string;
  key: string;
  startsAt: Date;
  endsAt: Date;
}> {
  const openSeason = await db.leagueSeason.findFirst({
    where: { status: "open" },
    orderBy: { startsAt: "desc" },
  });
  if (openSeason) return openSeason;

  const anySeason = await db.leagueSeason.findFirst({ orderBy: { startsAt: "desc" } });
  if (anySeason) {
    // No debería pasar en operación normal (siempre hay un open salvo
    // durante el rollover, que lo reabre) — pero si pasa, no inventamos:
    // lo reporta el caller.
    throw new Error("No hay season abierta y ya existe historial — revisa el rollover manualmente");
  }

  const { end: nextMonday } = mxWeekRange(now);
  const startsAt = nextMonday;
  const endsAt = mxWeekRange(new Date(nextMonday.getTime() + 24 * 60 * 60 * 1000)).end;

  const created = await db.leagueSeason.create({
    data: { key: seasonKeyFor(startsAt), startsAt, endsAt, status: "open" },
  });
  logger.info({ seasonId: created.id, startsAt, endsAt }, "bootstrap: primera league season creada");
  return created;
}

/**
 * Asigna una división a un usuario dentro de un tier de la season dada:
 * la división más pequeña con <25 miembros, o una nueva si todas ya
 * llegaron al tope. Usado tanto en la formación inicial del rollover como
 * para entrantes midweek.
 */
export async function assignToSmallestDivision(
  tx: Prisma.TransactionClient,
  seasonId: string,
  tier: LeagueTier,
): Promise<string> {
  const divisions = await tx.leagueDivision.findMany({
    where: { seasonId, tier },
    select: { id: true, number: true, _count: { select: { memberships: true } } },
    orderBy: { number: "asc" },
  });

  const withSpace = divisions
    .filter((d) => d._count.memberships < MIDWEEK_DIVISION_SOFT_CAP)
    .sort((a, b) => a._count.memberships - b._count.memberships)[0];
  if (withSpace) return withSpace.id;

  const nextNumber = (divisions.at(-1)?.number ?? 0) + 1;
  const created = await tx.leagueDivision.create({
    data: { seasonId, tier, number: nextNumber },
    select: { id: true },
  });
  return created.id;
}

export { ROLLOVER_ADVISORY_LOCK_KEY };
