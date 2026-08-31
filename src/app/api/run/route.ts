import { NextResponse } from "next/server";

import { runSignalFromResult } from "@/lib/analytics/error-category";
import { recordProductEventSafely } from "@/lib/analytics/record";
import { db } from "@/lib/db";
import {
  ExecutionTargetError,
  resolveExecutionTarget,
  type ResolvedExecutionTarget,
} from "@/lib/execution-target";
import {
  ExecutorConfigError,
  ExecutorProfileUnavailableError,
  getExecutorForProfile,
  type ExecutionResult,
} from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { RateLimitError, enforceRateLimit } from "@/lib/rate-limit";
import {
  parseOrThrow,
  rejectCompilerFields,
  runCodeSchema,
} from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Ejecución SIN calificar ("Compilar y ejecutar").
 *
 * El cuerpo nombra un recurso y el código; nada más. El servidor resuelve
 * recurso → curso → perfil de ejecución. Un `language` o `profileId` en el
 * cuerpo es un 400, no un dato que se ignora en silencio.
 */
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
    rejectCompilerFields(rawBody);
    input = parseOrThrow(runCodeSchema, rawBody);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Datos inválidos";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Resolver ANTES del rate limit: una petición sin recurso válido no debe
  // consumir la cuota de nadie, y tampoco debe llegar al compilador.
  let target: ResolvedExecutionTarget;
  try {
    target = await resolveExecutionTarget(input.target);
  } catch (err) {
    if (err instanceof ExecutionTargetError) {
      const status = err.reason === "invalid_profile" ? 503 : 400;
      if (err.reason === "invalid_profile") {
        logger.error(
          { err, userId: session.user.id, route: "/api/run" },
          "course execution profile is not resolvable",
        );
        return NextResponse.json(
          { error: "Entorno de ejecución no disponible." },
          { status },
        );
      }
      return NextResponse.json({ error: err.message }, { status });
    }
    throw err;
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
    const executor = getExecutorForProfile(target.profileId);
    const result = await executor.execute({
      profileId: target.profileId,
      sourceCode: input.sourceCode,
      stdin: input.stdin,
      cpuTimeLimit: 5,
    });

    // Señal de producto: "compiló sin calificar". La emite el SERVIDOR
    // porque es el único que sabe el resultado real y la hora real.
    // Guardamos la categoría del error, NUNCA el código ni el mensaje crudo
    // del compilador (que puede contener fragmentos del programa).
    await recordRun(session.user.id, target, input.studySessionId, result);

    return NextResponse.json(result);
  } catch (err) {
    if (
      err instanceof ExecutorConfigError ||
      err instanceof ExecutorProfileUnavailableError
    ) {
      // Log con el detalle real, devolver mensaje genérico. La config del
      // proveedor no debe filtrarse al cliente.
      logger.error(
        {
          err,
          userId: session.user.id,
          route: "/api/run",
          profileId: target.profileId,
        },
        "executor not configured for profile",
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
 *
 * Todos los ids salen del recurso YA RESUELTO, no del cuerpo de la
 * petición: así el curso (y con él el lenguaje) siempre se puede derivar
 * por join, sin guardar una etiqueta que el cliente haya elegido.
 */
async function recordRun(
  userId: string,
  target: ResolvedExecutionTarget,
  rawStudySessionId: string | null | undefined,
  result: ExecutionResult,
): Promise<void> {
  // La sesión de estudio debe ser del usuario; si no, se atribuye sin ella.
  let studySessionId: string | null = null;
  if (rawStudySessionId) {
    try {
      const owned = await db.studySession.findFirst({
        where: { id: rawStudySessionId, userId },
        select: { id: true },
      });
      studySessionId = owned?.id ?? null;
    } catch {
      studySessionId = null;
    }
  }

  const signal = runSignalFromResult(result, target.language);

  await recordProductEventSafely(db, {
    userId,
    name: "code_run",
    surface: target.surface,
    lessonId: target.lessonId,
    lessonStepId: target.stepId,
    exerciseId: target.exerciseId,
    practiceExerciseId: target.practiceExerciseId,
    studySessionId,
    contentRevision: target.contentRevision,
    props: {
      outcome: signal.outcome,
      ...(signal.errorCategory ? { errorCategory: signal.errorCategory } : {}),
    },
  });
}
