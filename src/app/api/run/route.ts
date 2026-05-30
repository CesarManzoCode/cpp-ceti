import { NextResponse } from "next/server";

import { ExecutorConfigError, getCodeExecutor } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { RateLimitError, enforceRateLimit } from "@/lib/rate-limit";
import { parseOrThrow, runCodeSchema } from "@/lib/validation";

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
