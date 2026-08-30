import type { ProductSurface } from "@prisma/client";

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
 * Rutas reconocidas:
 *   · `/app/u/<unidad>/<leccion>`  → lección
 *   · `/app/ejercicios/<slug>`     → ejercicio de práctica
 *   · cualquier otra de la app     → superficie `app`
 *
 * Los ids se resuelven contra la BD; nunca se aceptan del cliente.
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

  // /app/u/<unitSlug>/<lessonSlug>
  if (segments[0] === "app" && segments[1] === "u" && segments.length >= 4) {
    const lesson = await db.lesson.findFirst({
      where: { slug: segments[3], unit: { slug: segments[2] } },
      select: { id: true },
    });
    return {
      path,
      surface: "lesson",
      lessonId: lesson?.id ?? null,
      practiceExerciseId: null,
    };
  }

  // /app/ejercicios/<slug>
  if (
    segments[0] === "app" &&
    segments[1] === "ejercicios" &&
    segments.length >= 3
  ) {
    const exercise = await db.practiceExercise.findUnique({
      where: { slug: segments[2] },
      select: { id: true },
    });
    return {
      path,
      surface: "practice",
      lessonId: null,
      practiceExerciseId: exercise?.id ?? null,
    };
  }

  if (segments[0] === "app") {
    return { ...empty, surface: "app" };
  }

  return empty;
}
