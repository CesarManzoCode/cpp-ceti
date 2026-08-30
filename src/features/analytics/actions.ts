"use server";

import { z } from "zod";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import {
  clientEventSchema,
  toEventRow,
  type ClientEvent,
} from "@/lib/analytics/events";
import { recordProductEvent } from "@/lib/analytics/record";
import {
  endStudySession,
  heartbeatStudySession,
  startStudySession,
} from "@/lib/analytics/study-session";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";
import { cuidSchema, parseOrThrow } from "@/lib/validation";

/**
 * Acciones de telemetría de producto.
 *
 * Principios que NO se negocian aquí:
 *   · el cliente jamás manda timestamps ni duraciones;
 *   · el servidor resuelve la revisión de contenido leyendo el recurso;
 *   · se valida que la sesión de estudio sea DEL USUARIO (nadie escribe
 *     eventos en la sesión de otro);
 *   · se valida que el paso pertenezca a la lección declarada;
 *   · un fallo de telemetría nunca rompe la experiencia del alumno.
 */

const startSchema = z.object({
  surface: z.enum(["lesson", "practice"]),
  resourceId: cuidSchema,
  /** Clave de idempotencia del montaje (uuid del cliente). */
  clientKey: z.string().trim().min(8).max(64),
});

/**
 * Abre la sesión de estudio de una lección o de un ejercicio de práctica.
 * Devuelve también la revisión de contenido vigente, para que los eventos
 * del cliente no tengan que adivinarla.
 */
export const openStudySession = withActionErrorHandling(
  "openStudySession",
  async (input: {
    surface: "lesson" | "practice";
    resourceId: string;
    clientKey: string;
  }): Promise<{ studySessionId: string }> => {
    const { surface, resourceId, clientKey } = parseOrThrow(startSchema, input);
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "telemetry");

    await assertResourceVisible(surface, resourceId);

    const opened = await startStudySession(db, {
      userId,
      surface,
      resourceId,
      clientKey,
    });

    return { studySessionId: opened.id };
  },
);

const sessionIdSchema = z.object({ studySessionId: cuidSchema });

const closeSessionSchema = z.object({
  studySessionId: cuidSchema,
  /**
   * ¿Hubo actividad real justo antes de cerrar? Misma condición que el
   * latido. Si falta, se asume que NO: preferimos medir de menos.
   */
  active: z.boolean().optional().default(false),
});

/** Latido: el alumno sigue ahí y estuvo activo. Ver `study-session.ts`. */
export const pingStudySession = withActionErrorHandling(
  "pingStudySession",
  async (input: { studySessionId: string }): Promise<{ alive: boolean }> => {
    const { studySessionId } = parseOrThrow(sessionIdSchema, input);
    const session = await requireSession();
    await enforceRateLimit(session.user.id, "telemetry");
    const alive = await heartbeatStudySession(
      db,
      session.user.id,
      studySessionId,
    );
    return { alive };
  },
);

/** Cierra la sesión. Idempotente. */
export const closeStudySession = withActionErrorHandling(
  "closeStudySession",
  async (input: {
    studySessionId: string;
    active?: boolean;
  }): Promise<{ closed: boolean }> => {
    const { studySessionId, active } = parseOrThrow(closeSessionSchema, input);
    const session = await requireSession();
    const closed = await endStudySession(
      db,
      session.user.id,
      studySessionId,
      active,
    );
    return { closed };
  },
);

/**
 * Registra un evento de producto emitido por el cliente.
 * Idempotente vía `dedupeKey` — re-renders, dobles clicks y reintentos
 * insertan una sola fila.
 */
export const trackEvent = withActionErrorHandling(
  "trackEvent",
  async (input: ClientEvent): Promise<{ recorded: boolean }> => {
    const event = parseOrThrow(clientEventSchema, input);
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "telemetry");

    const row = toEventRow(event);
    const context = await resolveEventContext(userId, row);
    if (!context.ok) {
      // Contexto inválido (sesión ajena, paso que no es de esa lección...).
      // No es un error del alumno: se descarta y se loguea.
      logger.warn(
        { userId, event: row.name, reason: context.reason },
        "product event discarded",
      );
      return { recorded: false };
    }

    const recorded = await recordProductEvent(db, {
      userId,
      name: row.name,
      surface: row.surface,
      lessonId: row.lessonId,
      lessonStepId: row.lessonStepId,
      practiceExerciseId: row.practiceExerciseId,
      studySessionId: row.studySessionId,
      contentRevision: context.contentRevision,
      dedupeKey: row.dedupeKey,
      props: row.props,
    });

    return { recorded };
  },
);

const hintSchema = z.object({
  target: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("exercise"), exerciseId: cuidSchema }),
    z.object({ kind: z.literal("practice"), practiceExerciseId: cuidSchema }),
  ]),
  hintIndex: z.number().int().min(0).max(50),
  studySessionId: cuidSchema.optional(),
});

/**
 * Registra que el alumno reveló una pista.
 *
 * Una fila por (usuario, ejercicio, pista) — el UNIQUE + `skipDuplicates`
 * hacen que re-abrir el panel, refrescar o reintentar NO inflen el conteo.
 * `recorded: false` significa "ya estaba registrada", no un error.
 */
export const recordHintViewed = withActionErrorHandling(
  "recordHintViewed",
  async (input: {
    target:
      | { kind: "exercise"; exerciseId: string }
      | { kind: "practice"; practiceExerciseId: string };
    hintIndex: number;
    studySessionId?: string;
  }): Promise<{ recorded: boolean }> => {
    const { target, hintIndex, studySessionId } = parseOrThrow(
      hintSchema,
      input,
    );
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "telemetry");

    const exercise =
      target.kind === "exercise"
        ? await db.exercise.findUnique({
            where: { id: target.exerciseId },
            select: { id: true, hints: true, contentRevision: true },
          })
        : await db.practiceExercise.findUnique({
            where: { id: target.practiceExerciseId },
            select: { id: true, hints: true, contentRevision: true },
          });

    if (!exercise) throw new ActionError("Ejercicio no encontrado");
    if (hintIndex >= exercise.hints.length) {
      throw new ActionError("Esa pista no existe");
    }

    const ownedSessionId = await resolveOwnedSessionId(userId, studySessionId);

    const inserted = await db.userHintViewed.createMany({
      data: [
        {
          userId,
          hintIndex,
          exerciseId: target.kind === "exercise" ? exercise.id : null,
          practiceExerciseId:
            target.kind === "practice" ? exercise.id : null,
          studySessionId: ownedSessionId,
          contentRevision: exercise.contentRevision,
        },
      ],
      skipDuplicates: true,
    });

    return { recorded: inserted.count === 1 };
  },
);

// =====================================================================
//  Helpers internos
// =====================================================================

async function assertResourceVisible(
  surface: "lesson" | "practice",
  resourceId: string,
): Promise<void> {
  if (surface === "lesson") {
    const lesson = await db.lesson.findUnique({
      where: { id: resourceId },
      select: {
        published: true,
        unit: {
          select: { published: true, course: { select: { published: true } } },
        },
      },
    });
    if (
      !lesson ||
      !lesson.published ||
      !lesson.unit.published ||
      !lesson.unit.course.published
    ) {
      throw new ActionError("Este contenido no está disponible");
    }
    return;
  }

  const exercise = await db.practiceExercise.findUnique({
    where: { id: resourceId },
    select: { published: true },
  });
  if (!exercise || !exercise.published) {
    throw new ActionError("Este contenido no está disponible");
  }
}

/** Devuelve el id sólo si la sesión existe y es del usuario. */
async function resolveOwnedSessionId(
  userId: string,
  studySessionId: string | undefined,
): Promise<string | null> {
  if (!studySessionId) return null;
  const owned = await db.studySession.findFirst({
    where: { id: studySessionId, userId },
    select: { id: true },
  });
  return owned?.id ?? null;
}

type EventContext =
  | { ok: true; contentRevision: string | null }
  | { ok: false; reason: string };

/**
 * Valida la integridad del evento y resuelve la revisión de contenido:
 *   · la sesión de estudio debe ser del usuario;
 *   · el paso debe pertenecer a la lección declarada;
 *   · la revisión sale de la BD, nunca del cliente.
 */
async function resolveEventContext(
  userId: string,
  row: ReturnType<typeof toEventRow>,
): Promise<EventContext> {
  const ownedSession = await resolveOwnedSessionId(userId, row.studySessionId);
  if (!ownedSession) return { ok: false, reason: "study_session_not_owned" };

  if (row.lessonStepId) {
    const step = await db.lessonStep.findUnique({
      where: { id: row.lessonStepId },
      select: { lessonId: true, contentRevision: true },
    });
    if (!step) return { ok: false, reason: "step_not_found" };
    if (step.lessonId !== row.lessonId) {
      return { ok: false, reason: "step_lesson_mismatch" };
    }
    return { ok: true, contentRevision: step.contentRevision };
  }

  if (row.lessonId) {
    const lesson = await db.lesson.findUnique({
      where: { id: row.lessonId },
      select: { contentRevision: true },
    });
    if (!lesson) return { ok: false, reason: "lesson_not_found" };
    return { ok: true, contentRevision: lesson.contentRevision };
  }

  if (row.practiceExerciseId) {
    const exercise = await db.practiceExercise.findUnique({
      where: { id: row.practiceExerciseId },
      select: { contentRevision: true },
    });
    if (!exercise) return { ok: false, reason: "practice_not_found" };
    return { ok: true, contentRevision: exercise.contentRevision };
  }

  return { ok: true, contentRevision: null };
}
