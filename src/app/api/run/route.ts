import { NextResponse } from "next/server";

import { runSignalFromResult } from "@/lib/analytics/error-category";
import { recordProductEventSafely } from "@/lib/analytics/record";
import { db } from "@/lib/db";
import { ExecutorConfigError, getCodeExecutor } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { RateLimitError, enforceRateLimit } from "@/lib/rate-limit";
import {
  parseOrThrow,
  runCodeSchema,
  type RunContextInput,
} from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  let input;
  try {
    input = parseOrThrow(runCodeSchema, rawBody);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Datos inválidos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await enforceRateLimit(session.user.id, "run");
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: err.message },
        { status: 429, headers: { "Retry-After": String(err.retryAfterSec) } },
      );
    }
    throw err;
  }

  try {
    const executor = getCodeExecutor();
    const result = await executor.execute({
      sourceCode: input.sourceCode,
      stdin: input.stdin,
      cpuTimeLimit: 5,
    });

    // Señal de producto: "compiló sin calificar". La emite el SERVIDOR
    // porque es el único que sabe el resultado real y la hora real.
    // Guardamos la categoría del error, NUNCA el código ni el mensaje crudo
    // del compilador (que puede contener fragmentos del programa).
    await recordRun(session.user.id, input.context, result);

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ExecutorConfigError) {
      // Log con el detalle real, devolver mensaje genérico. La config del
      // proveedor no debe filtrarse al cliente.
      logger.error(
        { err, userId: session.user.id, route: "/api/run" },
        "executor not configured",
      );
      return NextResponse.json(
        {
          error: "El ejecutor de código no está disponible en este momento.",
        },
        { status: 503 },
      );
    }
    logger.error(
      { err, userId: session.user.id, route: "/api/run" },
      "code execution failed",
    );
    return NextResponse.json(
      { error: "No se pudo ejecutar el código. Intenta de nuevo." },
      { status: 500 },
    );
  }
}

/**
 * Registra el evento `code_run`. Nunca lanza: una falla de telemetría no
 * puede tumbar una ejecución que el alumno ya pagó (5–30 s de compilación).
 */
async function recordRun(
  userId: string,
  context: RunContextInput | undefined,
  result: Awaited<ReturnType<ReturnType<typeof getCodeExecutor>["execute"]>>,
): Promise<void> {
  if (!context) return;

  // La sesión de estudio debe ser del usuario; si no, se atribuye sin ella.
  let studySessionId: string | null = null;
  if (context.studySessionId) {
    try {
      const owned = await db.studySession.findFirst({
        where: { id: context.studySessionId, userId },
        select: { id: true },
      });
      studySessionId = owned?.id ?? null;
    } catch {
      studySessionId = null;
    }
  }

  const signal = runSignalFromResult(result);
  const contentRevision = await resolveRunRevision(context);

  await recordProductEventSafely(db, {
    userId,
    name: "code_run",
    surface: context.surface,
    lessonId: context.lessonId ?? null,
    exerciseId: context.exerciseId ?? null,
    practiceExerciseId: context.practiceExerciseId ?? null,
    studySessionId,
    contentRevision,
    props: {
      outcome: signal.outcome,
      ...(signal.errorCategory ? { errorCategory: signal.errorCategory } : {}),
    },
  });
}

/** Revisión del contenido que el alumno tenía enfrente al compilar. */
async function resolveRunRevision(
  context: RunContextInput,
): Promise<string | null> {
  try {
    if (context.exerciseId) {
      const ex = await db.exercise.findUnique({
        where: { id: context.exerciseId },
        select: { contentRevision: true },
      });
      return ex?.contentRevision ?? null;
    }
    if (context.practiceExerciseId) {
      const ex = await db.practiceExercise.findUnique({
        where: { id: context.practiceExerciseId },
        select: { contentRevision: true },
      });
      return ex?.contentRevision ?? null;
    }
    if (context.lessonId) {
      const lesson = await db.lesson.findUnique({
        where: { id: context.lessonId },
        select: { contentRevision: true },
      });
      return lesson?.contentRevision ?? null;
    }
  } catch {
    /* sin revisión: el evento sigue siendo válido */
  }
  return null;
}
