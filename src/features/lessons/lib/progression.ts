import type { Prisma } from "@prisma/client";

/**
 * Marca un paso como completado dentro de una transacción, decide si la
 * lección completa "transitó" en este request (transición atómica vía
 * `updateMany` con WHERE condicional, sólo un caller gana), y devuelve el
 * XP de lección a sumar.
 *
 * Asume que el caller ya validó acceso al paso (lección/unidad/curso
 * publicados) — no re-valida para no encarecer la tx.
 */
export async function markStepCompletedInTx(
  tx: Prisma.TransactionClient,
  userId: string,
  stepId: string,
  lessonId: string,
  lessonStepIds: readonly string[],
  lessonXpReward: number,
): Promise<{
  /** Todos los pasos de la lección están marcados como completados. */
  allStepsDone: boolean;
  /** Esta llamada fue la que transicionó la lección a "completed". */
  lessonJustCompleted: boolean;
  /** XP de lección a otorgar (sólo > 0 cuando lessonJustCompleted). */
  lessonXpEarned: number;
}> {
  await tx.userStepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    update: { attempts: { increment: 1 } },
    create: { userId, stepId },
  });

  const completedCount = await tx.userStepProgress.count({
    where: { userId, stepId: { in: [...lessonStepIds] } },
  });

  // Aún faltan pasos: asegurar in_progress (sin pisar si ya está completed).
  if (completedCount < lessonStepIds.length) {
    await tx.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {},
      create: { userId, lessonId, status: "in_progress" },
    });
    return {
      allStepsDone: false,
      lessonJustCompleted: false,
      lessonXpEarned: 0,
    };
  }

  // Todos los pasos están hechos. La transición atómica: sólo el primer
  // request en llegar consigue pasar de in_progress/not_started a completed.
  const transition = await tx.userLessonProgress.updateMany({
    where: {
      userId,
      lessonId,
      status: { in: ["in_progress", "not_started"] },
    },
    data: {
      status: "completed",
      completedAt: new Date(),
      xpEarned: lessonXpReward,
    },
  });

  if (transition.count === 1) {
    return {
      allStepsDone: true,
      lessonJustCompleted: true,
      lessonXpEarned: lessonXpReward,
    };
  }

  // `count === 0` significa una de dos: (a) no existe la fila todavía —caso
  // defensive: el usuario completó todos los pasos sin registro de progreso—,
  // o (b) ya estaba en `completed`. Distinguirlo con findUnique + create sería
  // un read-then-write con race (dos requests concurrentes leerían "no existe"
  // y el segundo `create` reventaría con P2002, abortando la transacción de
  // Postgres). `createMany({ skipDuplicates })` lo resuelve atómicamente:
  // inserta sólo si no había fila, y nunca lanza.
  const created = await tx.userLessonProgress.createMany({
    data: [
      {
        userId,
        lessonId,
        status: "completed",
        completedAt: new Date(),
        xpEarned: lessonXpReward,
      },
    ],
    skipDuplicates: true,
  });

  if (created.count === 1) {
    return {
      allStepsDone: true,
      lessonJustCompleted: true,
      lessonXpEarned: lessonXpReward,
    };
  }

  // Ya estaba completed — no se duplica XP.
  return {
    allStepsDone: true,
    lessonJustCompleted: false,
    lessonXpEarned: 0,
  };
}
