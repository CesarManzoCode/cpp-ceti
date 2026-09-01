import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/env";

/**
 * Token firmado genérico (HMAC-SHA256 con `BETTER_AUTH_SECRET` — no hace
 * falta un secreto nuevo, ya es server-only). Usado donde el servidor
 * necesita mandar un dato de vuelta al cliente y luego confiar en que NO
 * fue alterado: el context token de discovery (Fase 2 §6), la cookie de
 * atribución de invitación (Fase 2 §4) y el cursor de discovery (keyset).
 *
 * No es JWT: es deliberadamente chico y sin librería extra.
 */

function sign(payload: string): string {
  return createHmac("sha256", env.BETTER_AUTH_SECRET).update(payload).digest("base64url");
}

export function encodeSignedToken(data: Record<string, unknown>, ttlMs?: number): string {
  const payload = JSON.stringify({
    ...data,
    iat: Date.now(),
    ...(ttlMs ? { exp: Date.now() + ttlMs } : {}),
  });
  const encoded = Buffer.from(payload, "utf-8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

/** `null` si la firma no cuadra, el JSON es inválido, o el token expiró. */
export function decodeSignedToken<T>(
  token: string | null | undefined,
): (T & { iat: number; exp?: number }) | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!encoded || !sig) return null;

  const expected = sign(encoded);
  const a = Buffer.from(sig, "base64url");
  const b = Buffer.from(expected, "base64url");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as T & {
      iat: number;
      exp?: number;
    };
    if (typeof payload.exp === "number" && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
