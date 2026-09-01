import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

/**
 * Obtiene la sesión actual en Server Components / Server Actions / Route Handlers.
 * Cacheado por request para evitar múltiples llamadas a la DB.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Igual que `requireSession`, pero además EXIGE que el username ya esté
 * confirmado (`usernameSetupRequired === false`). Úsalo SÓLO en
 * funcionalidad social (amigos, discovery, liga, streaks, quests) — NUNCA
 * en cursos/lecciones/práctica, que siguen funcionando con un handle
 * provisional. En Server Components redirige a la pantalla de setup; en
 * Server Actions lanza (el cliente social nunca debería poder invocarlas
 * con un username sin confirmar, pero por si acaso).
 */
export async function requireConfirmedUsername() {
  const session = await requireSession();
  if (session.user.usernameSetupRequired) {
    redirect(`/app/confirmar-usuario?redirectTo=${encodeURIComponent("/app/amigos")}`);
  }
  return session;
}
