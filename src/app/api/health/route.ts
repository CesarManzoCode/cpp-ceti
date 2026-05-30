import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

// Healthcheck público para monitoreo (Vercel, UptimeRobot, Better Stack).
// No requiere sesión ni rate-limit: el objetivo es que un check externo
// pueda saber si la app + DB están responsivas.
//
// Devuelve 200 con detalle si todo OK, 503 si la DB no responde.
export const runtime = "nodejs";
// Nunca cachear esta ruta — el estado debe ser en vivo.
export const dynamic = "force-dynamic";

interface HealthOk {
  ok: true;
  db: "up";
  time: string;
}
interface HealthDown {
  ok: false;
  db: "down";
  time: string;
}

export async function GET(): Promise<NextResponse<HealthOk | HealthDown>> {
  const time = new Date().toISOString();
  try {
    // Query trivial — exige roundtrip pero no toca ninguna tabla.
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up", time }, { status: 200 });
  } catch (err) {
    logger.error({ err, route: "/api/health" }, "health check failed");
    return NextResponse.json(
      { ok: false, db: "down", time },
      { status: 503 },
    );
  }
}
