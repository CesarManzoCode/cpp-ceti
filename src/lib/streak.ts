import type { Prisma } from "@prisma/client";
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
 * Asegura que la racha esté actualizada para hoy y suma XP. Espera correr
 * dentro de una transacción que ya garantizó que este evento sucede UNA vez
 * (ej. tras `updateMany` que transitó la lección a completed con WHERE
 * condicional). Eso evita la race en la lectura de fechas: la transición
 * sólo ocurre una vez por evento, así que esta función se invoca una vez.
 *
 * El `totalXp` se incrementa atómicamente (no read-then-write) para evitar
 * lost updates si por alguna razón se invocan dos racha-updates en paralelo.
 */
export async function awardXpAndUpdateStreak(
  tx: Prisma.TransactionClient,
  userId: string,
  xpEarned: number,
): Promise<void> {
  const today = startOfDayUTC(new Date());
  const yesterday = startOfDayUTC(new Date(Date.now() - 86_400_000));

  const existing = await tx.userStreak.findUnique({ where: { userId } });

  if (!existing) {
    await tx.userStreak.create({
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

  await tx.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(existing.longestStreak, newStreak),
      lastActiveDate: today,
      totalXp: { increment: xpEarned },
    },
  });
}

/**
 * Suma XP sin tocar la racha. Atómico vía `increment`. Usado para XP de
 * sub-eventos (ej. aprobar un ejercicio dentro de una lección, donde la
 * racha la maneja la transición de la lección).
 */
export async function incrementUserXp(
  tx: Prisma.TransactionClient,
  userId: string,
  xp: number,
): Promise<void> {
  await tx.userStreak.upsert({
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
