import { Prisma, type ProductEventName, type ProductSurface } from "@prisma/client";

import type { db as prismaDb } from "@/lib/db";
import { logger } from "@/lib/logger";

type Db = typeof prismaDb;

export interface RecordEventInput {
  userId: string;
  name: ProductEventName;
  surface: ProductSurface;
  lessonId?: string | null;
  lessonStepId?: string | null;
  exerciseId?: string | null;
  practiceExerciseId?: string | null;
  studySessionId?: string | null;
  contentRevision?: string | null;
  /** Null = evento sin idempotencia (se permite repetir). */
  dedupeKey?: string | null;
  props?: Record<string, unknown>;
}

/**
 * Inserta un evento de producto. Append-only.
 *
 * Idempotencia: `createMany({ skipDuplicates })` → `INSERT ... ON CONFLICT
 * DO NOTHING` contra el UNIQUE (userId, dedupeKey). Un doble click, un
 * re-render de React o un reintento de red insertan UNA fila. Nunca lanza
 * P2002 (que además abortaría cualquier transacción que lo envuelva).
 *
 * @returns true si esta llamada insertó el evento (false = ya existía).
 */
export async function recordProductEvent(
  db: Db,
  input: RecordEventInput,
): Promise<boolean> {
  const inserted = await db.productEvent.createMany({
    data: [
      {
        userId: input.userId,
        name: input.name,
        surface: input.surface,
        lessonId: input.lessonId ?? null,
        lessonStepId: input.lessonStepId ?? null,
        exerciseId: input.exerciseId ?? null,
        practiceExerciseId: input.practiceExerciseId ?? null,
        studySessionId: input.studySessionId ?? null,
        contentRevision: input.contentRevision ?? null,
        dedupeKey: input.dedupeKey ?? null,
        props: (input.props ?? {}) as Prisma.InputJsonValue,
      },
    ],
    skipDuplicates: true,
  });
  return inserted.count === 1;
}

/**
 * Igual que `recordProductEvent`, pero la telemetría NUNCA rompe el producto:
 * si la escritura falla (FK, DB caída), se loguea y la vida sigue. Úsalo en
 * caminos donde el usuario está esperando algo más importante que el evento.
 */
export async function recordProductEventSafely(
  db: Db,
  input: RecordEventInput,
): Promise<boolean> {
  try {
    return await recordProductEvent(db, input);
  } catch (err) {
    logger.error(
      { err, event: input.name, userId: input.userId },
      "product event insert failed",
    );
    return false;
  }
}
