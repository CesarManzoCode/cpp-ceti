// Helper de fetch con reintentos y backoff exponencial para los executors.
// Solo reintenta en errores transitorios (5xx, abort/red). 4xx no se reintenta
// porque casi siempre indica payload inválido o auth roto.

import { logger } from "@/lib/logger";

interface RetryOptions {
  /** Etiqueta para los logs (provider name). */
  label: string;
  /** Intentos totales, incluyendo el primero. Default 3. */
  attempts?: number;
  /** Backoff base en ms. Defaults a 200; el segundo intento espera 200, el tercero 400. */
  baseDelayMs?: number;
}

const TRANSIENT_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  options: RetryOptions,
): Promise<Response> {
  const total = options.attempts ?? 3;
  const baseDelay = options.baseDelayMs ?? 200;

  let lastError: unknown;
  for (let attempt = 1; attempt <= total; attempt++) {
    try {
      const response = await fetch(url, init);
      if (response.ok) return response;
      if (!TRANSIENT_STATUS.has(response.status) || attempt === total) {
        return response;
      }
      // Drenar body antes de reintentar para no leakear conexiones.
      await response.text().catch(() => "");
      logger.warn(
        { label: options.label, status: response.status, attempt, total },
        "executor transient error — retrying",
      );
    } catch (err) {
      lastError = err;
      if (attempt === total) break;
      logger.warn(
        { label: options.label, err, attempt, total },
        "executor network error — retrying",
      );
    }
    await sleep(baseDelay * 2 ** (attempt - 1));
  }
  // Si llegamos aquí, todos los intentos lanzaron (no devolvieron Response).
  throw lastError instanceof Error
    ? lastError
    : new Error(`${options.label} no respondió tras ${total} intentos`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
