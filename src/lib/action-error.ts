import { Prisma } from "@prisma/client";

import { logger } from "@/lib/logger";
import { RateLimitError } from "@/lib/rate-limit";

/**
 * Error intencional dirigido al usuario. Su `message` es seguro de mostrar
 * en UI y NO se sanitiza. Cualquier otro `throw` dentro de una action
 * envuelta con `withActionErrorHandling` se loguea y se reemplaza por un
 * mensaje genérico para no filtrar internals al cliente.
 */
export class ActionError extends Error {
  readonly code: string;
  constructor(message: string, code = "ACTION_ERROR") {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

const GENERIC_MESSAGE = "Algo salió mal. Vuelve a intentar en unos segundos.";

/**
 * Envuelve una Server Action. Si el callback lanza:
 *   - ActionError → se re-lanza tal cual (mensaje seguro para el usuario).
 *   - RateLimitError → se reenvía como ActionError (mensaje en es-MX listo).
 *   - "UNAUTHORIZED" de requireSession → se relanza (lo manejan layouts).
 *   - Cualquier otro → se loguea con contexto y se reemplaza por un
 *     mensaje genérico para no exponer stack traces ni mensajes internos.
 */
export function withActionErrorHandling<TArgs extends unknown[], TResult>(
  name: string,
  fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof ActionError) throw err;
      if (err instanceof RateLimitError) {
        throw new ActionError(err.message, "RATE_LIMITED");
      }
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        throw err;
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error(
          { err, action: name, code: err.code, meta: err.meta },
          "Prisma error in server action",
        );
        throw new ActionError(GENERIC_MESSAGE);
      }
      logger.error({ err, action: name }, "Server action failed");
      throw new ActionError(GENERIC_MESSAGE);
    }
  };
}

/** Helper para detectar violación de UNIQUE constraint (P2002). */
export function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}
