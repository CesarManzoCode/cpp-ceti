import { cache } from "react";

import { db } from "@/lib/db";

/**
 * Better Auth guarda cada método de inicio de sesión como un `Account`
 * propio. El de email+password usa este `providerId` y trae el hash en
 * `password`; los de OAuth (`google`, …) no tienen `password`.
 */
const CREDENTIAL_PROVIDER_ID = "credential";

export interface AccountCapabilities {
  /**
   * Autoritativo: ¿existe un `Account` de credenciales con contraseña?
   * Una cuenta puede tener ESTE en true Y proveedores OAuth vinculados al
   * mismo tiempo — no son mutuamente excluyentes, así que nunca se infiere
   * de "tiene Google" sino de esto directamente.
   */
  hasPassword: boolean;
  /** Proveedores OAuth vinculados, para mostrarlos si hace falta. */
  oauthProviders: string[];
}

/**
 * Capacidades reales de la cuenta, leídas de `Account` (nunca de heurísticas
 * de UI). Alimenta qué acciones de "Cuenta" tienen sentido mostrar: cambiar
 * contraseña y "elimina con tu contraseña" sólo aplican si `hasPassword`.
 */
export const getAccountCapabilities = cache(
  async (userId: string): Promise<AccountCapabilities> => {
    const accounts = await db.account.findMany({
      where: { userId },
      select: { providerId: true, password: true },
    });

    return {
      hasPassword: accounts.some(
        (a) => a.providerId === CREDENTIAL_PROVIDER_ID && Boolean(a.password),
      ),
      oauthProviders: accounts
        .filter((a) => a.providerId !== CREDENTIAL_PROVIDER_ID)
        .map((a) => a.providerId),
    };
  },
);
