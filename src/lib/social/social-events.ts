import type { Prisma, SocialEventKind } from "@prisma/client";

/** Streak milestones — conjunto pequeño y explícito, no se inventan más. */
export const STREAK_MILESTONE_DAYS = [3, 7, 14, 30, 60, 100] as const;

/**
 * Inserta un hito en el feed social. Idempotente vía UNIQUE
 * (actorId, dedupeKey) — `createMany({ skipDuplicates })`, nunca aborta la
 * transacción que lo envuelve.
 *
 * @returns `true` sólo si esta llamada insertó el hito (primera vez).
 */
export async function emitSocialEvent(
  tx: Prisma.TransactionClient,
  input: {
    actorId: string;
    kind: SocialEventKind;
    dedupeKey: string;
    unitId?: string | null;
    courseId?: string | null;
    value?: number | null;
  },
): Promise<boolean> {
  const inserted = await tx.socialEvent.createMany({
    data: [
      {
        actorId: input.actorId,
        kind: input.kind,
        dedupeKey: input.dedupeKey,
        unitId: input.unitId ?? null,
        courseId: input.courseId ?? null,
        value: input.value ?? null,
      },
    ],
    skipDuplicates: true,
  });
  return inserted.count === 1;
}

/**
 * Tras completar una lección, revisa si la UNIDAD y/o el CURSO quedaron
 * completos por primera vez y emite los hitos correspondientes. Una sola
 * lectura de todas las lecciones publicadas del curso (acotado — decenas,
 * no miles) evita N+1 por unidad.
 */
export async function checkUnitAndCourseCompletion(
  tx: Prisma.TransactionClient,
  userId: string,
  unitId: string,
  courseId: string,
): Promise<void> {
  const lessonRows = await tx.lesson.findMany({
    where: { unit: { courseId }, published: true },
    select: { id: true, unitId: true },
  });
  if (lessonRows.length === 0) return;

  const completedRows = await tx.userLessonProgress.findMany({
    where: { userId, status: "completed", lessonId: { in: lessonRows.map((l) => l.id) } },
    select: { lessonId: true },
  });
  const completedIds = new Set(completedRows.map((r) => r.lessonId));

  const unitLessons = lessonRows.filter((l) => l.unitId === unitId);
  if (unitLessons.length > 0 && unitLessons.every((l) => completedIds.has(l.id))) {
    await emitSocialEvent(tx, {
      actorId: userId,
      kind: "unit_completed",
      dedupeKey: `unit_completed:${unitId}`,
      unitId,
      courseId,
    });
  }

  if (lessonRows.every((l) => completedIds.has(l.id))) {
    await emitSocialEvent(tx, {
      actorId: userId,
      kind: "course_completed",
      dedupeKey: `course_completed:${courseId}`,
      courseId,
    });
  }
}

/**
 * Emite `streak_milestone` si `newStreak` cae en el conjunto fijo. La
 * dedupeKey es sólo el número de días: es un logro "primera vez en la
 * vida", igual que los badges de `/app/logros` — no un evento por CADA
 * ciclo en que la racha vuelve a pasar por ese umbral.
 */
export async function maybeEmitStreakMilestone(
  tx: Prisma.TransactionClient,
  userId: string,
  newStreak: number,
): Promise<void> {
  if (!(STREAK_MILESTONE_DAYS as readonly number[]).includes(newStreak)) return;
  await emitSocialEvent(tx, {
    actorId: userId,
    kind: "streak_milestone",
    dedupeKey: `streak_milestone:${newStreak}`,
    value: newStreak,
  });
}
