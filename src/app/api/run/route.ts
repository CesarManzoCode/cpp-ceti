import { NextResponse } from "next/server";

import { ExecutorConfigError, getCodeExecutor } from "@/lib/executor";
import { getSession } from "@/lib/get-session";

export const runtime = "nodejs";

// Rate limit muy simple en memoria — basta para MVP. En producción mover a Redis.
const recentRequests = new Map<string, number[]>();
const RATE_LIMIT = 30; // 30 ejecuciones
const RATE_WINDOW_MS = 60_000; // por minuto

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const history = recentRequests.get(userId) ?? [];
  const recent = history.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    return true;
  }
  recent.push(now);
  recentRequests.set(userId, recent);
  return false;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (isRateLimited(session.user.id)) {
    return NextResponse.json(
      { error: "Demasiadas ejecuciones. Espera un minuto." },
      { status: 429 },
    );
  }

  let body: { sourceCode?: string; stdin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const sourceCode = body.sourceCode;
  if (typeof sourceCode !== "string" || sourceCode.trim().length === 0) {
    return NextResponse.json(
      { error: "sourceCode es obligatorio" },
      { status: 400 },
    );
  }
  if (sourceCode.length > 50_000) {
    return NextResponse.json(
      { error: "El código excede 50,000 caracteres" },
      { status: 400 },
    );
  }

  try {
    const executor = getCodeExecutor();
    const result = await executor.execute({
      sourceCode,
      stdin: typeof body.stdin === "string" ? body.stdin : "",
      cpuTimeLimit: 5,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ExecutorConfigError) {
      return NextResponse.json(
        {
          error:
            "El ejecutor de código no está configurado. Revisa las variables JUDGE0_*.",
          detail: err.message,
        },
        { status: 503 },
      );
    }
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json(
      { error: "Fallo al ejecutar el código", detail: message },
      { status: 500 },
    );
  }
}
