import { NextResponse } from "next/server";

import { endStudySession } from "@/lib/analytics/study-session";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * Cierre de sesión de estudio por `sendBeacon` / `fetch(keepalive)`.
 *
 * Existe como route handler (y no sólo como Server Action) porque al cerrar
 * la pestaña el navegador sólo garantiza entrega por estas dos vías. Aun así
 * NO dependemos de que llegue: si no llega, el barrido de huérfanas cierra la
 * sesión en `lastPingAt`.
 */
export async function POST(request: Request) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const studySessionId =
    body && typeof body === "object" && "studySessionId" in body
      ? (body as { studySessionId?: unknown }).studySessionId
      : undefined;

  if (typeof studySessionId !== "string" || studySessionId.length === 0) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 400 });
  }

  try {
    await endStudySession(db, session.user.id, studySessionId);
  } catch (err) {
    logger.error(
      { err, userId: session.user.id },
      "failed to close study session",
    );
    // La telemetría nunca es un error para el cliente: el barrido lo arregla.
  }

  return new NextResponse(null, { status: 204 });
}
