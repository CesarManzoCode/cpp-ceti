import { cache } from "react";

import { db } from "@/lib/db";

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Stats agregados de XP y racha para el usuario actual.
 * Cacheado por request para que el layout, el topbar y la página
 * de inicio no dupliquen la consulta.
 */
export const getUserStats = cache(async (userId: string): Promise<UserStats> => {
  const streak = await db.userStreak.findUnique({ where: { userId } });
  return {
    totalXp: streak?.totalXp ?? 0,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
  };
});

/**
 * Suma XP al usuario y actualiza su racha diaria.
 * - Hoy ya activo → solo suma XP, racha intacta.
 * - Activo ayer → +1 a la racha.
 * - Más de 1 día sin actividad (o nunca) → reset a 1.
 *
 * Usado tanto al completar una lección como al aprobar un ejercicio de
 * práctica por primera vez. Reemplaza la duplicación que vivía en
 * lessons/actions y practice/actions.
 */
export async function awardXpAndUpdateStreak(
  userId: string,
  xpEarned: number,
): Promise<void> {
  const today = startOfDayUTC(new Date());
  const yesterday = startOfDayUTC(new Date(Date.now() - 86_400_000));

  const existing = await db.userStreak.findUnique({ where: { userId } });

  if (!existing) {
    await db.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        totalXp: xpEarned,
      },
    });
    return;
  }

  const lastActive = existing.lastActiveDate
    ? startOfDayUTC(existing.lastActiveDate)
    : null;

  let newStreak = existing.currentStreak;
  if (!lastActive) {
    newStreak = 1;
  } else if (lastActive.getTime() === today.getTime()) {
    // Ya activo hoy — racha intacta.
  } else if (lastActive.getTime() === yesterday.getTime()) {
    newStreak = existing.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  await db.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(existing.longestStreak, newStreak),
      lastActiveDate: today,
      totalXp: existing.totalXp + xpEarned,
    },
  });
}

/**
 * Suma XP sin tocar la racha. Usado para sumar XP por un sub-evento
 * (ej. aprobar un ejercicio dentro de una lección, donde la racha la
 * actualiza el evento mayor de completar la lección).
 */
export async function incrementUserXp(
  userId: string,
  xp: number,
): Promise<void> {
  await db.userStreak.upsert({
    where: { userId },
    update: { totalXp: { increment: xp } },
    create: {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalXp: xp,
    },
  });
}

function startOfDayUTC(d: Date): Date {
  const r = new Date(d);
  r.setUTCHours(0, 0, 0, 0);
  return r;
}
