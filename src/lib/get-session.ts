import { headers } from "next/headers";
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
