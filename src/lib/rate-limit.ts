import { db } from "@/lib/db";

/**
 * Rate-limit persistente — usa la tabla `rate_limit` para que funcione
 * en serverless multi-instancia (Vercel) y sobreviva redeploys.
 *
 * Estrategia: ventana fija de 60s, una fila por (userId, endpoint, minuto).
 * Las filas viejas son baratas (índice por `windowStart`); un job de
 * limpieza puede purgar lo de hace >24h sin afectar al rate limiter.
 */

const LIMITS = {
  /** Ejecuciones "Probar" desde el editor (sin grading). */
  run: { limit: 30, windowSec: 60 },
  /** Envíos calificados de un ejercicio dentro de una lección. */
  "submit-lesson-exercise": { limit: 20, windowSec: 60 },
  /** Envíos calificados de un ejercicio de práctica. */
  "submit-practice": { limit: 20, windowSec: 60 },
} satisfies Record<string, { limit: number; windowSec: number }>;

export type RateLimitEndpoint = keyof typeof LIMITS;

export class RateLimitError extends Error {
  readonly retryAfterSec: number;
  constructor(message: string, retryAfterSec: number) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSec = retryAfterSec;
  }
}

/**
 * Incrementa el contador de la ventana actual. Si excede el límite,
 * lanza `RateLimitError`. Idempotente entre instancias gracias al
 * UNIQUE (userId, endpoint, windowStart) en la tabla.
 */
export async function enforceRateLimit(
  userId: string,
  endpoint: RateLimitEndpoint,
): Promise<void> {
  const config = LIMITS[endpoint];
  const windowStart = startOfWindow(new Date(), config.windowSec);

  const row = await db.rateLimit.upsert({
    where: {
      userId_endpoint_windowStart: { userId, endpoint, windowStart },
    },
    create: { userId, endpoint, windowStart, count: 1 },
    update: { count: { increment: 1 } },
  });

  if (row.count > config.limit) {
    // Aproximación: cuánto falta para que se cierre la ventana actual.
    const elapsedSec = Math.floor((Date.now() - windowStart.getTime()) / 1000);
    const retryAfter = Math.max(1, config.windowSec - elapsedSec);
    throw new RateLimitError(
      `Demasiadas solicitudes. Vuelve a intentar en ${retryAfter}s.`,
      retryAfter,
    );
  }
}

function startOfWindow(d: Date, windowSec: number): Date {
  const ms = windowSec * 1000;
  return new Date(Math.floor(d.getTime() / ms) * ms);
}
