import type { Prisma, XpReason } from "@prisma/client";

/**
 * Descriptor de un otorgamiento de XP — exactamente un recurso por
 * `reason` (reflejado también como CHECK en Postgres, ver la migración
 * `social_system_phase1_6`).
 */
export type XpAwardDescriptor =
  | { reason: "lesson_completed"; dedupeKey: string; lessonId: string }
  | { reason: "lesson_exercise_first_pass"; dedupeKey: string; exerciseId: string }
  | { reason: "practice_first_pass"; dedupeKey: string; practiceExerciseId: string }
  | { reason: "legacy_balance"; dedupeKey: string };

/** Claves de dedupe estándar — un otorgamiento por recurso, para siempre. */
export const xpDedupeKey = {
  lesson: (lessonId: string) => `lesson:${lessonId}`,
  exercise: (exerciseId: string) => `exercise:${exerciseId}`,
  practice: (practiceExerciseId: string) => `practice:${practiceExerciseId}`,
  legacy: (cutoverKey: string) => `legacy:${cutoverKey}`,
};

/**
 * Inserta una fila en el ledger append-only `XpAward`, idempotente vía
 * `createMany({ skipDuplicates })` (UNIQUE (userId, dedupeKey) →
 * `INSERT ... ON CONFLICT DO NOTHING`, nunca aborta la transacción — ver
 * `@/lib/completions`).
 *
 * @returns `true` SOLO si esta llamada insertó la fila (primer otorgamiento
 * de este dedupeKey). El caller debe mover `UserStreak.totalXp` (y
 * cualquier otro contador derivado) ÚNICAMENTE cuando esto es `true`.
 */
export async function recordXpAward(
  tx: Prisma.TransactionClient,
  userId: string,
  amount: number,
  award: XpAwardDescriptor,
): Promise<boolean> {
  const inserted = await tx.xpAward.createMany({
    data: [
      {
        userId,
        amount,
        reason: award.reason as XpReason,
        dedupeKey: award.dedupeKey,
        lessonId: award.reason === "lesson_completed" ? award.lessonId : null,
        exerciseId: award.reason === "lesson_exercise_first_pass" ? award.exerciseId : null,
        practiceExerciseId:
          award.reason === "practice_first_pass" ? award.practiceExerciseId : null,
      },
    ],
    skipDuplicates: true,
  });
  return inserted.count === 1;
}
