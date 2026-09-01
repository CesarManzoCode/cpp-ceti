import type { FriendStreakEndReason, Prisma } from "@prisma/client";

import { ActionError } from "@/lib/action-error";
import { db } from "@/lib/db";
import { canonicalPair } from "@/lib/social/pair";
import { isNextDateOnly, mxDayRangeForDateOnly } from "@/lib/social/time";

export const MAX_ACTIVE_FRIEND_STREAKS = 3;
export const MAX_PENDING_OUTGOING_FRIEND_STREAKS = 3;
export const PENDING_EXPIRES_DAYS = 7;

type Db = Prisma.TransactionClient | typeof db;

/**
 * Actividad SIGNIFICATIVA server-authoritative para calificar un día de
 * Friend Streak: lección completada, intento calificado de reto de
 * lección, o intento calificado de práctica. Pasar o no el intento NO
 * importa — sólo que haya pasado por el ejecutor real. Login, vistas,
 * social, kudos o un `code_run` libre del playground NUNCA cuentan.
 */
export async function hadSignificantActivity(
  tx: Db,
  userId: string,
  start: Date,
  end: Date,
): Promise<boolean> {
  const [lesson, exercise, practice] = await Promise.all([
    tx.userLessonProgress.findFirst({
      where: { userId, status: "completed", completedAt: { gte: start, lt: end } },
      select: { id: true },
    }),
    tx.userExerciseAttempt.findFirst({
      where: { userId, createdAt: { gte: start, lt: end } },
      select: { id: true },
    }),
    tx.userPracticeAttempt.findFirst({
      where: { userId, createdAt: { gte: start, lt: end } },
      select: { id: true },
    }),
  ]);
  return Boolean(lesson || exercise || practice);
}

/** Advisory lock transaccional por usuario — serializa capacidad entre requests concurrentes. */
async function lockUserForStreakCapacity(tx: Prisma.TransactionClient, userId: string): Promise<void> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId})::bigint)`;
}

async function countActiveStreaks(tx: Db, userId: string): Promise<number> {
  return tx.friendStreak.count({
    where: { status: "active", OR: [{ userLowId: userId }, { userHighId: userId }] },
  });
}

async function countPendingOutgoingStreaks(tx: Db, userId: string): Promise<number> {
  return tx.friendStreak.count({ where: { status: "pending", createdById: userId } });
}

/**
 * Crea (o reutiliza el par canónico ya `ended`, conservando `longestStreak`)
 * una solicitud pendiente de Friend Streak. Exige amistad accepted vigente,
 * capacidad del creador (≤3 activas, ≤3 pendientes salientes).
 */
export async function createFriendStreakRequest(
  creatorId: string,
  friendUserId: string,
): Promise<{ id: string }> {
  if (creatorId === friendUserId) throw new ActionError("No puedes iniciar una racha contigo mismo");

  return db.$transaction(async (tx) => {
    const { lowId, highId } = canonicalPair(creatorId, friendUserId);
    await lockUserForStreakCapacity(tx, lowId);
    await lockUserForStreakCapacity(tx, highId);

    const friendship = await tx.friendship.findFirst({
      where: {
        status: "accepted",
        OR: [
          { requesterId: creatorId, addresseeId: friendUserId },
          { requesterId: friendUserId, addresseeId: creatorId },
        ],
      },
      select: { id: true },
    });
    if (!friendship) throw new ActionError("Sólo puedes iniciar una racha con un amigo");

    const [activeCount, pendingCount] = await Promise.all([
      countActiveStreaks(tx, creatorId),
      countPendingOutgoingStreaks(tx, creatorId),
    ]);
    if (activeCount >= MAX_ACTIVE_FRIEND_STREAKS) {
      throw new ActionError(`Ya tienes ${MAX_ACTIVE_FRIEND_STREAKS} rachas activas`);
    }
    if (pendingCount >= MAX_PENDING_OUTGOING_FRIEND_STREAKS) {
      throw new ActionError("Ya tienes demasiadas solicitudes de racha pendientes");
    }

    const existing = await tx.friendStreak.findUnique({
      where: { userLowId_userHighId: { userLowId: lowId, userHighId: highId } },
    });
    const pendingExpiresAt = new Date(Date.now() + PENDING_EXPIRES_DAYS * 86_400_000);

    if (!existing) {
      return tx.friendStreak.create({
        data: { userLowId: lowId, userHighId: highId, createdById: creatorId, status: "pending", pendingExpiresAt },
        select: { id: true },
      });
    }
    if (existing.status === "ended") {
      // Reamistad: reutiliza el par canónico, conserva longestStreak.
      return tx.friendStreak.update({
        where: { id: existing.id },
        data: {
          status: "pending",
          createdById: creatorId,
          pendingExpiresAt,
          acceptedAt: null,
          endedAt: null,
          endReason: null,
          currentStreak: 0,
          lastQualifiedDay: null,
          lastEvaluatedDay: null,
        },
        select: { id: true },
      });
    }
    if (existing.status === "pending") {
      throw new ActionError("Ya hay una solicitud de racha pendiente con esa persona");
    }
    throw new ActionError("Ya tienen una racha activa");
  });
}

/** Acepta una solicitud pendiente. Revalida capacidad de AMBOS bajo lock. */
export async function acceptFriendStreakRequest(accepterId: string, streakId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const streak = await tx.friendStreak.findUnique({ where: { id: streakId } });
    if (!streak || streak.status !== "pending") throw new ActionError("Esa solicitud ya no existe");
    if (streak.createdById === accepterId) throw new ActionError("No puedes aceptar tu propia solicitud");
    if (accepterId !== streak.userLowId && accepterId !== streak.userHighId) {
      throw new ActionError("No autorizado");
    }
    if (streak.pendingExpiresAt && streak.pendingExpiresAt.getTime() < Date.now()) {
      throw new ActionError("Esa solicitud expiró");
    }

    await lockUserForStreakCapacity(tx, streak.userLowId);
    await lockUserForStreakCapacity(tx, streak.userHighId);

    const [lowActive, highActive] = await Promise.all([
      countActiveStreaks(tx, streak.userLowId),
      countActiveStreaks(tx, streak.userHighId),
    ]);
    if (lowActive >= MAX_ACTIVE_FRIEND_STREAKS || highActive >= MAX_ACTIVE_FRIEND_STREAKS) {
      throw new ActionError("Uno de los dos ya llegó al máximo de rachas activas");
    }

    await tx.friendStreak.update({
      where: { id: streakId },
      data: { status: "active", acceptedAt: new Date(), pendingExpiresAt: null },
    });
  });
}

/** Cancela (creador) o rechaza (receptor) una solicitud pendiente. */
export async function cancelOrDeclineFriendStreakRequest(
  userId: string,
  streakId: string,
): Promise<void> {
  await db.$transaction(async (tx) => {
    const streak = await tx.friendStreak.findUnique({ where: { id: streakId } });
    if (!streak || streak.status !== "pending") throw new ActionError("Esa solicitud ya no existe");
    if (streak.createdById !== userId && streak.userLowId !== userId && streak.userHighId !== userId) {
      throw new ActionError("No autorizado");
    }
    await tx.friendStreak.update({
      where: { id: streakId },
      data: { status: "ended", endedAt: new Date(), endReason: "expired" },
    });
  });
}

/** Expira solicitudes pendientes vencidas — llamado desde el job de mantenimiento. */
export async function expirePendingFriendStreaks(): Promise<number> {
  const res = await db.friendStreak.updateMany({
    where: { status: "pending", pendingExpiresAt: { lt: new Date() } },
    data: { status: "ended", endedAt: new Date(), endReason: "expired" },
  });
  return res.count;
}

/**
 * Cierra cualquier Friend Streak (pending o active) del par tras
 * unfriend/block, EN LA MISMA operación social (se pasa la `tx` del
 * caller). `currentStreak` se pone a 0; `longestStreak` NUNCA se toca —
 * es historia. Los `FriendStreakDay` tampoco se borran.
 */
export async function endFriendStreakForPair(
  tx: Prisma.TransactionClient,
  userA: string,
  userB: string,
  reason: Extract<FriendStreakEndReason, "unfriended" | "blocked">,
): Promise<void> {
  const { lowId, highId } = canonicalPair(userA, userB);
  await tx.friendStreak.updateMany({
    where: { userLowId: lowId, userHighId: highId, status: { in: ["pending", "active"] } },
    data: { status: "ended", endedAt: new Date(), endReason: reason, currentStreak: 0 },
  });
}

/**
 * Evalúa un día calendario (DATE-only, ver `mxDateOnly`) para un streak
 * activo. Idempotente vía el guard `lastEvaluatedDay` (una `updateMany`
 * condicionada, no read-then-write) + el UNIQUE de `FriendStreakDay` — un
 * reintento o un doble refresh NUNCA suma dos veces.
 *
 * `breakOnMiss`:
 *   - `false` (refresh en vivo de HOY): si no calificó, no pasa nada — el
 *     día no ha terminado, puede calificar más tarde.
 *   - `true` (job diario evaluando AYER): si no calificó, rompe la racha
 *     (`currentStreak = 0`) — el día ya cerró.
 */
export async function refreshFriendStreakDay(
  streakId: string,
  dayOnly: Date,
  opts: { breakOnMiss: boolean },
): Promise<void> {
  await db.$transaction(async (tx) => {
    const streak = await tx.friendStreak.findUnique({ where: { id: streakId } });
    if (!streak || streak.status !== "active") return;
    if (streak.lastEvaluatedDay && streak.lastEvaluatedDay.getTime() >= dayOnly.getTime()) return;

    const { start, end } = mxDayRangeForDateOnly(dayOnly);
    const [lowOk, highOk] = await Promise.all([
      hadSignificantActivity(tx, streak.userLowId, start, end),
      hadSignificantActivity(tx, streak.userHighId, start, end),
    ]);

    const guard = {
      id: streakId,
      OR: [{ lastEvaluatedDay: null }, { lastEvaluatedDay: { lt: dayOnly } }],
    };

    if (lowOk && highOk) {
      const inserted = await tx.friendStreakDay.createMany({
        data: [{ streakId, day: dayOnly }],
        skipDuplicates: true,
      });
      if (inserted.count !== 1) return; // ya se había registrado este día — no duplicar.

      const newCurrent =
        streak.lastQualifiedDay && isNextDateOnly(streak.lastQualifiedDay, dayOnly)
          ? streak.currentStreak + 1
          : 1;
      await tx.friendStreak.updateMany({
        where: guard,
        data: {
          currentStreak: newCurrent,
          longestStreak: Math.max(streak.longestStreak, newCurrent),
          lastQualifiedDay: dayOnly,
          lastEvaluatedDay: dayOnly,
        },
      });
      return;
    }

    if (opts.breakOnMiss) {
      await tx.friendStreak.updateMany({
        where: guard,
        data: { currentStreak: 0, lastEvaluatedDay: dayOnly },
      });
    }
  });
}
