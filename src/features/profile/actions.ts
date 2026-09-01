"use server";

import { headers } from "next/headers";
import { z } from "zod";

import {
  ActionError,
  isUniqueViolation,
  withActionErrorHandling,
} from "@/lib/action-error";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { parseOrThrow, usernameSchema } from "@/lib/validation";

const checkUsernameSchema = z.object({
  username: z.string().trim().min(1, "Escribe un nombre"),
});

/**
 * Verifica disponibilidad de un username. Público (pre-signup), no requiere
 * sesión. Devuelve también la razón cuando no está disponible para que el
 * cliente pueda mostrar mensaje contextual (formato vs. tomado vs. reservado).
 */
export const checkUsernameAvailability = withActionErrorHandling(
  "checkUsernameAvailability",
  async (input: { username: string }): Promise<
    | { available: true; normalized: string }
    | { available: false; reason: string }
  > => {
    const { username } = parseOrThrow(checkUsernameSchema, input);
    const normalized = username.trim().toLowerCase();

    const formatCheck = usernameSchema.safeParse(normalized);
    if (!formatCheck.success) {
      return {
        available: false,
        reason: formatCheck.error.issues[0]?.message ?? "Formato inválido",
      };
    }

    const taken = await db.user.findUnique({
      where: { username: formatCheck.data },
      select: { id: true },
    });
    if (taken) {
      return { available: false, reason: "Ya está en uso" };
    }

    return { available: true, normalized: formatCheck.data };
  },
);

const updateBioSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(160, "Máximo 160 caracteres")
    .nullable(),
});

/**
 * Actualiza la bio del usuario actual. Pasar `null` o cadena vacía la limpia.
 */
export const updateBio = withActionErrorHandling(
  "updateBio",
  async (input: { bio: string | null }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const { bio } = parseOrThrow(updateBioSchema, input);
    const value = bio && bio.length > 0 ? bio : null;

    await db.user.update({
      where: { id: session.user.id },
      data: { bio: value },
    });

    logger.info({ userId: session.user.id }, "bio updated");
    return { ok: true };
  },
);

const setUsernameSchema = z.object({
  username: usernameSchema,
});

/**
 * Set inicial del username cuando el usuario llegó sin uno (escenario futuro
 * de cambio post-signup). Hoy todos los usuarios reciben uno al crearse, así
 * que esta acción sirve principalmente como red para usuarios legacy o si
 * algún día permitimos cambiarlo.
 */
export const setUsername = withActionErrorHandling(
  "setUsername",
  async (input: { username: string }): Promise<{ ok: true; username: string }> => {
    const session = await requireSession();
    const { username } = parseOrThrow(setUsernameSchema, input);

    const taken = await db.user.findFirst({
      where: { username, NOT: { id: session.user.id } },
      select: { id: true },
    });
    if (taken) throw new ActionError("Ese nombre ya está en uso");

    await db.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    logger.info({ userId: session.user.id, username }, "username set");
    return { ok: true, username };
  },
);

const confirmOAuthUsernameSchema = z.object({ username: usernameSchema });

/**
 * Confirmación ONE-SHOT del username provisional que se generó al crear la
 * cuenta por OAuth. Sólo puede llamarse una vez: el UPDATE está
 * condicionado por `usernameSetupRequired: true`, así que una segunda
 * llamada (doble click, tab duplicada) no encuentra la fila y falla con un
 * mensaje claro en vez de silenciosamente re-escribir el handle.
 *
 * La carrera final por el handle la resuelve el UNIQUE de Postgres — el
 * pre-check de disponibilidad (`checkUsernameAvailability`) es sólo UX.
 */
export const confirmOAuthUsername = withActionErrorHandling(
  "confirmOAuthUsername",
  async (input: { username: string }): Promise<{ ok: true; username: string }> => {
    const session = await requireSession();
    const { username } = parseOrThrow(confirmOAuthUsernameSchema, input);

    let updated;
    try {
      updated = await db.user.updateMany({
        where: { id: session.user.id, usernameSetupRequired: true },
        data: { username, usernameSetupRequired: false },
      });
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ActionError("Ese nombre de usuario ya está en uso");
      }
      throw err;
    }

    if (updated.count === 0) {
      // O ya se confirmó antes (one-shot gastado), o la cuenta no requería
      // setup — cualquiera de los dos es "no hay nada que hacer aquí".
      throw new ActionError("Tu nombre de usuario ya fue confirmado");
    }

    // Sin esto, `cookieCache` (5 min) podría seguir sirviendo la sesión
    // vieja con `usernameSetupRequired: true` y el alumno vería el prompt
    // de setup aunque ya haya terminado. Un solo bypass puntual, NO se
    // desactiva el cache global (`auth.ts`).
    await auth.api.getSession({
      headers: await headers(),
      query: { disableCookieCache: true },
    });

    logger.info({ userId: session.user.id, username }, "oauth username confirmed");
    return { ok: true, username };
  },
);
