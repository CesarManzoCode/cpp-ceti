import type { ProductSurface } from "@prisma/client";

import { LEGACY_CPP_COURSE_SLUG } from "@/lib/courses";
import type { db as prismaDb } from "@/lib/db";

export const FEEDBACK_MAX_LENGTH = 2_000;

export interface FeedbackContext {
  path: string | null;
  surface: ProductSurface | null;
  lessonId: string | null;
  practiceExerciseId: string | null;
}

/**
 * Normaliza una ruta de la app: sólo el pathname, sin query ni fragmento
 * (podrían llevar datos que no queremos guardar), y acotado en longitud.
 * Devuelve `null` si no parece una ruta interna.
 */
export function sanitizePath(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return null;
  const withoutHash = trimmed.split("#")[0];
  const pathname = withoutHash.split("?")[0];
  if (!/^\/[\w\-/.]*$/.test(pathname)) return null;
  return pathname.slice(0, 200);
}

/**
 * Deriva superficie y recurso a partir de la ruta.
 *
 * Rutas reconocidas (canónicas y legacy):
 *   · `/app/c/<curso>/u/<unidad>/<leccion>` → lección
 *   · `/app/c/<curso>/ejercicios/<slug>`    → ejercicio de práctica
 *   · `/app/u/<unidad>/<leccion>`           → lección del curso C++ legacy
 *   · `/app/ejercicios/<slug>`              → práctica del curso C++ legacy
 *   · cualquier otra de la app              → superficie `app`
 *
 * Los ids se resuelven contra la BD SIEMPRE dentro de un curso; nunca se
 * aceptan del cliente. Sin el curso, dos cursos con el mismo slug de unidad
 * o de ejercicio harían que el feedback se colgara del recurso equivocado.
 */
export async function resolveFeedbackContext(
  db: typeof prismaDb,
  rawPath: string | undefined | null,
): Promise<FeedbackContext> {
  const path = sanitizePath(rawPath);
  const empty: FeedbackContext = {
    path,
    surface: null,
    lessonId: null,
    practiceExerciseId: null,
  };
  if (!path) return empty;

  const segments = path.split("/").filter(Boolean);
  if (segments[0] !== "app") return empty;

  // Normaliza la ruta canónica con curso a (courseSlug, resto) y la legacy
  // al curso C++ estable.
  let courseSlug = LEGACY_CPP_COURSE_SLUG;
  let rest = segments.slice(1);
  if (segments[1] === "c" && segments.length >= 3) {
    courseSlug = segments[2];
    rest = segments.slice(3);
  }

  // .../u/<unitSlug>/<lessonSlug>
  if (rest[0] === "u" && rest.length >= 3) {
    const lesson = await db.lesson.findFirst({
      where: {
        slug: rest[2],
        unit: { slug: rest[1], course: { slug: courseSlug } },
      },
      select: { id: true },
    });
    return {
      path,
      surface: "lesson",
      lessonId: lesson?.id ?? null,
      practiceExerciseId: null,
    };
  }

  // .../ejercicios/<slug>
  if (rest[0] === "ejercicios" && rest.length >= 2) {
    const exercise = await db.practiceExercise.findFirst({
      where: { slug: rest[1], course: { slug: courseSlug } },
      select: { id: true },
    });
    return {
      path,
      surface: "practice",
      lessonId: null,
      practiceExerciseId: exercise?.id ?? null,
    };
  }

  return { ...empty, surface: "app" };
}
