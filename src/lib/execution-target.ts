import {
  assertLanguagePair,
  type ExecutionProfileId,
  type LanguageId,
} from "@/lib/code-languages";
import { db } from "@/lib/db";

// =====================================================================
// Resolución de recursos ejecutables — la frontera de confianza.
//
// El cliente nombra un RECURSO (un paso, un ejercicio, una práctica). El
// servidor navega recurso → unidad → curso y de ahí saca el perfil de
// ejecución. El cliente nunca nombra un lenguaje ni un compilador.
//
// Todo lo que no se pueda resolver con certeza falla cerrado:
//   · recurso inexistente
//   · recurso despublicado (o bajo una unidad/curso despublicado)
//   · ids anidados que no corresponden entre sí
//   · paso que no es ejecutable (ej. un snippet de Windows Forms)
//   · curso con lenguaje/perfil inválido
// En ninguno de esos casos se manda código a compilar.
// =====================================================================

/**
 * Superficie del evento `code_run`, con la MISMA semántica que antes de que
 * la plataforma fuera multilenguaje (ver `docs/product-analytics.md` §8):
 *
 *   · `lesson`     — ejecución sin calificar de un RETO de lección.
 *   · `practice`   — ejecución sin calificar de un ejercicio de práctica.
 *   · `playground` — ejecución libre dentro de un ejemplo de código. No
 *                    lleva `exerciseId`, para no contaminar el denominador
 *                    de "compilar → calificar" de los retos.
 *
 * Cambiar esta clasificación partiría en dos las series históricas.
 */
export type ExecutionSurface = "lesson" | "practice" | "playground";

export interface ResolvedExecutionTarget {
  profileId: ExecutionProfileId;
  language: LanguageId;
  courseId: string;
  courseSlug: string;
  /** Superficie derivada del recurso, no del cliente. */
  surface: ExecutionSurface;
  lessonId: string | null;
  stepId: string | null;
  exerciseId: string | null;
  practiceExerciseId: string | null;
  /** Revisión vigente del contenido que el alumno tiene enfrente. */
  contentRevision: string | null;
}

export interface ExecutionTargetInput {
  stepId?: string;
  exerciseId?: string;
  practiceExerciseId?: string;
  /** Verificación cruzada opcional: si viene, debe corresponder. */
  lessonId?: string;
}

/** Motivo por el que un recurso no puede ejecutarse. */
export type ExecutionTargetFailure =
  | "not_found"
  | "unavailable"
  | "mismatch"
  | "not_runnable"
  | "ambiguous"
  | "invalid_profile";

export class ExecutionTargetError extends Error {
  constructor(
    readonly reason: ExecutionTargetFailure,
    message: string,
  ) {
    super(message);
    this.name = "ExecutionTargetError";
  }
}

/**
 * Resuelve el recurso pedido y devuelve su perfil de ejecución.
 * Lanza `ExecutionTargetError` en cualquier caso dudoso.
 */
export async function resolveExecutionTarget(
  input: ExecutionTargetInput,
): Promise<ResolvedExecutionTarget> {
  const named = [
    input.stepId,
    input.exerciseId,
    input.practiceExerciseId,
  ].filter(Boolean);
  if (named.length !== 1) {
    throw new ExecutionTargetError(
      "ambiguous",
      "Una ejecución debe nombrar exactamente un recurso.",
    );
  }

  if (input.practiceExerciseId) {
    if (input.lessonId) {
      throw new ExecutionTargetError(
        "mismatch",
        "Un ejercicio de práctica no pertenece a una lección.",
      );
    }
    return resolvePractice(input.practiceExerciseId);
  }
  if (input.exerciseId) {
    return resolveLessonExercise(input.exerciseId, input.lessonId);
  }
  return resolveRunnableStep(input.stepId!, input.lessonId);
}

// ---------------------------------------------------------------------
// Práctica
// ---------------------------------------------------------------------
async function resolvePractice(
  practiceExerciseId: string,
): Promise<ResolvedExecutionTarget> {
  const exercise = await db.practiceExercise.findUnique({
    where: { id: practiceExerciseId },
    select: {
      id: true,
      published: true,
      contentRevision: true,
      // La unidad dueña se resuelve por (curso, slug de unidad). Una unidad
      // despublicada esconde sus prácticas en la UI; el servidor tiene que
      // rechazarlas igual, o una petición forjada las seguiría ejecutando.
      unit: { select: { published: true } },
      course: {
        select: {
          id: true,
          slug: true,
          published: true,
          language: true,
          executionProfile: true,
        },
      },
    },
  });
  if (!exercise) {
    throw new ExecutionTargetError("not_found", "Ejercicio no encontrado");
  }
  if (
    !exercise.published ||
    !exercise.unit.published ||
    !exercise.course.published
  ) {
    throw new ExecutionTargetError(
      "unavailable",
      "Este contenido no está disponible",
    );
  }

  const runtime = profileOf(exercise.course);
  return {
    ...runtime,
    courseId: exercise.course.id,
    courseSlug: exercise.course.slug,
    surface: "practice",
    lessonId: null,
    stepId: null,
    exerciseId: null,
    practiceExerciseId: exercise.id,
    contentRevision: exercise.contentRevision,
  };
}

// ---------------------------------------------------------------------
// Ejercicio dentro de una lección
// ---------------------------------------------------------------------
async function resolveLessonExercise(
  exerciseId: string,
  expectedLessonId?: string,
): Promise<ResolvedExecutionTarget> {
  const exercise = await db.exercise.findUnique({
    where: { id: exerciseId },
    select: {
      id: true,
      contentRevision: true,
      step: {
        select: {
          id: true,
          lesson: {
            select: {
              id: true,
              published: true,
              unit: {
                select: {
                  published: true,
                  course: {
                    select: {
                      id: true,
                      slug: true,
                      published: true,
                      language: true,
                      executionProfile: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!exercise) {
    throw new ExecutionTargetError("not_found", "Ejercicio no encontrado");
  }

  const { lesson } = exercise.step;
  ensureLessonAvailable(lesson);
  if (expectedLessonId && expectedLessonId !== lesson.id) {
    throw new ExecutionTargetError(
      "mismatch",
      "El ejercicio no pertenece a la lección indicada",
    );
  }

  const runtime = profileOf(lesson.unit.course);
  return {
    ...runtime,
    courseId: lesson.unit.course.id,
    courseSlug: lesson.unit.course.slug,
    surface: "lesson",
    lessonId: lesson.id,
    stepId: exercise.step.id,
    exerciseId: exercise.id,
    practiceExerciseId: null,
    contentRevision: exercise.contentRevision,
  };
}

// ---------------------------------------------------------------------
// Paso ejecutable (ejemplo de código con `runnable: true`)
// ---------------------------------------------------------------------
async function resolveRunnableStep(
  stepId: string,
  expectedLessonId?: string,
): Promise<ResolvedExecutionTarget> {
  const step = await db.lessonStep.findUnique({
    where: { id: stepId },
    select: {
      id: true,
      type: true,
      content: true,
      contentRevision: true,
      lesson: {
        select: {
          id: true,
          published: true,
          unit: {
            select: {
              published: true,
              course: {
                select: {
                  id: true,
                  slug: true,
                  published: true,
                  language: true,
                  executionProfile: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!step) {
    throw new ExecutionTargetError("not_found", "Paso no encontrado");
  }
  ensureLessonAvailable(step.lesson);
  if (expectedLessonId && expectedLessonId !== step.lesson.id) {
    throw new ExecutionTargetError(
      "mismatch",
      "El paso no pertenece a la lección indicada",
    );
  }

  // Sólo los ejemplos marcados como ejecutables se ejecutan. Un snippet de
  // Windows Forms no tiene botón de correr en la UI; el servidor además lo
  // rechaza, para que una petición forjada tampoco lo compile.
  if (step.type !== "code_example" || !isRunnableContent(step.content)) {
    throw new ExecutionTargetError(
      "not_runnable",
      "Este paso no se ejecuta en el navegador",
    );
  }

  const runtime = profileOf(step.lesson.unit.course);
  return {
    ...runtime,
    courseId: step.lesson.unit.course.id,
    courseSlug: step.lesson.unit.course.slug,
    // Playground, no "lesson": es una corrida libre del ejemplo, no un
    // intento de un reto. La diferencia sostiene el embudo de los retos.
    surface: "playground",
    lessonId: step.lesson.id,
    stepId: step.id,
    exerciseId: null,
    practiceExerciseId: null,
    contentRevision: step.contentRevision,
  };
}

function isRunnableContent(content: unknown): boolean {
  return (
    typeof content === "object" &&
    content !== null &&
    (content as { runnable?: unknown }).runnable === true
  );
}

function ensureLessonAvailable(lesson: {
  published: boolean;
  unit: { published: boolean; course: { published: boolean } };
}): void {
  if (
    !lesson.published ||
    !lesson.unit.published ||
    !lesson.unit.course.published
  ) {
    throw new ExecutionTargetError(
      "unavailable",
      "Este contenido no está disponible",
    );
  }
}

/**
 * Perfil del curso, validado contra el registro. Un valor desconocido en la
 * base es un error de configuración, no una invitación a usar C++.
 */
function profileOf(course: {
  slug: string;
  language: string;
  executionProfile: string;
}): { profileId: ExecutionProfileId; language: LanguageId } {
  try {
    const pair = assertLanguagePair(
      course.language,
      course.executionProfile,
      `curso "${course.slug}"`,
    );
    return { profileId: pair.executionProfile, language: pair.language };
  } catch (err) {
    throw new ExecutionTargetError(
      "invalid_profile",
      err instanceof Error ? err.message : "Perfil de ejecución inválido",
    );
  }
}
