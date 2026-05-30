import { ActionError } from "@/lib/action-error";
import { db } from "@/lib/db";

/**
 * Guarda que valida que un (curso, unidad, lección) esté publicado. Se aplica
 * a TODO acceso a contenido de lecciones: `completeStep`, `submitExercise` y
 * cualquier query del lado del cliente que pase por estos helpers.
 *
 * `submitPracticeExercise` no usa esto: validar `practiceExercise.published`
 * directamente alcanza (la práctica es standalone).
 */
export async function requireAccessibleExercise(exerciseId: string) {
  const exercise = await db.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      testCases: { orderBy: { order: "asc" } },
      step: {
        include: {
          lesson: {
            include: {
              steps: { select: { id: true } },
              unit: {
                include: {
                  course: { select: { id: true, published: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!exercise) {
    throw new ActionError("Ejercicio no encontrado");
  }
  ensureLessonAccessible(exercise.step.lesson);
  return exercise;
}

export async function requireAccessibleStep(stepId: string) {
  const step = await db.lessonStep.findUnique({
    where: { id: stepId },
    include: {
      lesson: {
        include: {
          steps: { select: { id: true } },
          unit: {
            include: {
              course: { select: { id: true, published: true } },
            },
          },
        },
      },
    },
  });
  if (!step) {
    throw new ActionError("Paso no encontrado");
  }
  ensureLessonAccessible(step.lesson);
  return step;
}

function ensureLessonAccessible(lesson: {
  published: boolean;
  unit: { published: boolean; course: { published: boolean } };
}) {
  if (
    !lesson.published ||
    !lesson.unit.published ||
    !lesson.unit.course.published
  ) {
    throw new ActionError("Este contenido no está disponible");
  }
}
