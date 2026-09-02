import { randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { env, googleAuthEnabled } from "@/env";
import { db } from "./db";
import { logger } from "./logger";
import { PRODUCT_NAME } from "@/lib/branding";
import { INVITE_COOKIE_NAME, consumeInviteCookieForNewUser } from "@/lib/social/invite-cookie";
import {
  RESERVED_USERNAMES,
  USERNAME_MAX,
  USERNAME_MIN,
  USERNAME_PATTERN,
} from "./validation";

export const auth = betterAuth({
  appName: PRODUCT_NAME,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders: googleAuthEnabled
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,

  user: {
    additionalFields: {
      // Handle público inmutable. El form de registro lo pide; el hook
      // `databaseHooks.user.create.before` lo normaliza y, para OAuth (que
      // no pasa por el form), lo auto-genera desde el email.
      username: {
        type: "string",
        required: true,
        input: true,
        returned: true,
      },
      // Bio opcional, no se pide en signup (se edita después en /app/perfil).
      bio: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      // true SOLO para cuentas OAuth nuevas con handle provisional. Bloquea
      // únicamente funcionalidad social (ver `usernameSetupRequired` en
      // schema.prisma); aprender sigue funcionando. Se apaga una sola vez
      // desde `confirmOAuthUsername` (src/features/academic/actions.ts).
      usernameSetupRequired: {
        type: "boolean",
        required: false,
        input: false,
        returned: true,
      },
    },
    // Habilita /delete-user. Borra el usuario y su data por cascade
    // (sesiones, progreso, intentos, etc. — definido en schema.prisma).
    deleteUser: {
      enabled: true,
    },
  },

  // Hooks de DB — la lógica autoritativa de normalización/generación de
  // username vive aquí para cubrir TODOS los flujos (email/password, OAuth,
  // admin-create futura). El form de registro hace validación cliente para UX,
  // pero el hook es la red de seguridad.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const provided = typeof user.username === "string"
            ? user.username.trim().toLowerCase()
            : undefined;

          if (provided && provided.length > 0) {
            // Path: email/password signup con username del form.
            if (
              provided.length < USERNAME_MIN ||
              provided.length > USERNAME_MAX ||
              !USERNAME_PATTERN.test(provided) ||
              RESERVED_USERNAMES.has(provided)
            ) {
              logger.warn({ provided }, "rejected username at signup hook");
              return false;
            }
            const taken = await db.user.findUnique({
              where: { username: provided },
              select: { id: true },
            });
            if (taken) {
              logger.warn({ provided }, "username collision at signup hook");
              return false;
            }
            return {
              data: { ...user, username: provided, usernameSetupRequired: false },
            };
          }

          // Path: OAuth signup — el form no participa, así que no hay
          // username que validar. El handle es PROVISIONAL: alta entropía,
          // nunca derivado del email (no revela el correo del alumno y no
          // colisiona con el username real que va a elegir). El alumno
          // confirma el definitivo en `confirmOAuthUsername`; hasta entonces
          // `usernameSetupRequired=true` lo excluye de todo lo social sin
          // tocar su acceso a cursos/lecciones/práctica.
          const username = await resolveAvailableProvisionalUsername();
          return {
            data: { ...user, username, usernameSetupRequired: true },
          };
        },
        after: async (user, context) => {
          // Consume la cookie de atribución de invitación — SÓLO corre en
          // alta nueva (nunca en login), así que "cuenta existente no
          // genera attribution" sale gratis de estar aquí y no en un flujo
          // que también dispare en signin.
          if (!context) return;
          const raw = context.getCookie(INVITE_COOKIE_NAME);
          // Se borra siempre, haya servido o no: es de un solo uso.
          context.setCookie(INVITE_COOKIE_NAME, "", { maxAge: 0, path: "/" });
          if (!raw) return;
          try {
            await consumeInviteCookieForNewUser(db, user.id, raw);
          } catch (err) {
            logger.error({ err, userId: user.id }, "invite cookie consumption failed");
          }
        },
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24, // refresca cada 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min
    },
  },

  advanced: {
    cookiePrefix: "cpp-ceti",
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

/** Prefijo del handle provisional — deja claro en logs/DB que es temporal. */
const PROVISIONAL_PREFIX = "alumno_";

/**
 * Genera un handle provisional de alta entropía (no derivado de ningún dato
 * del usuario) y resuelve la colisión, si la hay, con más entropía — nunca
 * con un sufijo predecible. El username real lo elige el alumno en
 * `confirmOAuthUsername`; a este no le importa ser "bonito".
 */
async function resolveAvailableProvisionalUsername(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const entropy = randomUUID().replace(/-/g, "").slice(0, 12);
    const candidate = `${PROVISIONAL_PREFIX}${entropy}`.slice(0, USERNAME_MAX);
    const taken = await db.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
  }
  // Presión patológica: 5 colisiones de 48 bits de entropía es
  // estadísticamente imposible a nuestra escala; si pasa, un id de sesión
  // adicional termina de romper el empate.
  return `${PROVISIONAL_PREFIX}${randomUUID().replace(/-/g, "").slice(0, 12)}`.slice(
    0,
    USERNAME_MAX,
  );
}
