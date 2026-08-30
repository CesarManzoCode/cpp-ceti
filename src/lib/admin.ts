import { notFound } from "next/navigation";

import { ActionError } from "@/lib/action-error";
import { db } from "@/lib/db";
import { env } from "@/env";
import { getSession } from "@/lib/get-session";

/**
 * AUTORIZACIÓN DEL PANEL INTERNO
 * ==============================
 * Server-side y punto. Una ruta "difícil de adivinar" o un `if` en React no
 * son autorización: cualquiera puede pedir el HTML o invocar la Server
 * Action directamente.
 *
 * Dos vías, ambas verificadas contra la BD/entorno en cada request:
 *   1. `user.role = 'admin'` — la vía durable.
 *   2. `ADMIN_EMAILS` — arranque en frío (el primer admin, sin tocar SQL).
 *
 * Cada página y cada acción del panel llama `requireAdmin()` por su cuenta:
 * un layout que autoriza NO protege a las Server Actions que viven adentro.
 */

/** ¿Este correo está en la lista de arranque? Comparación normalizada. */
export function isBootstrapAdmin(
  email: string,
  adminEmails: string | undefined,
): boolean {
  if (!adminEmails) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return adminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}

export interface AdminContext {
  userId: string;
  email: string;
}

/** Contexto de admin, o `null` si el usuario actual no lo es. */
export async function getAdminContext(): Promise<AdminContext | null> {
  const session = await getSession();
  if (!session?.user) return null;

  // Leemos el rol de la BD, no del payload de la sesión: la sesión puede
  // venir de una cookie cacheada y el rol puede haberse revocado.
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true },
  });
  if (!user) return null;

  const allowed =
    user.role === "admin" || isBootstrapAdmin(user.email, env.ADMIN_EMAILS);
  if (!allowed) return null;

  return { userId: user.id, email: user.email };
}

/** Para Server Actions del panel. Lanza si el usuario no es admin. */
export async function requireAdmin(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) {
    throw new ActionError("No tienes acceso a esta sección", "FORBIDDEN");
  }
  return context;
}

/**
 * Para páginas del panel. Devuelve 404 en vez de 403: no confirmamos la
 * existencia del panel a quien no debería verlo.
 */
export async function requireAdminPage(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) notFound();
  return context;
}
