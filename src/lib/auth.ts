import { randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { env, googleAuthEnabled } from "@/env";
import { db } from "./db";
import { logger } from "./logger";
import {
  generateUsernameFromSeed,
  RESERVED_USERNAMES,
  USERNAME_MAX,
  USERNAME_MIN,
  USERNAME_PATTERN,
} from "./validation";

export const auth = betterAuth({
  appName: "C++ CETI",
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
            return { data: { ...user, username: provided } };
          }

          // Path: OAuth signup — auto-genera y resuelve colisión.
          const seed = typeof user.email === "string"
            ? user.email.split("@")[0]
            : "";
          const base = generateUsernameFromSeed(
            seed,
            typeof user.id === "string" ? user.id : randomUUID(),
          );
          const username = await resolveAvailableUsername(base);
          return { data: { ...user, username } };
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

/**
 * Intenta el candidato base; si está tomado, prueba sufijos numéricos cortos
 * (deterministas para que el handle siga siendo bonito) y, como último recurso,
 * cuelga un sufijo aleatorio. La probabilidad de colisión en 5+ rondas es
 * despreciable para nuestra escala.
 */
async function resolveAvailableUsername(base: string): Promise<string> {
  const truncated = base.slice(0, USERNAME_MAX);
  const free = await db.user.findUnique({
    where: { username: truncated },
    select: { id: true },
  });
  if (!free) return truncated;

  for (let suffix = 2; suffix <= 99; suffix++) {
    const candidate = `${truncated.slice(0, USERNAME_MAX - String(suffix).length)}${suffix}`;
    const taken = await db.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
  }

  // Fallback con entropía — sólo bajo presión patológica.
  const rand = randomUUID().replace(/-/g, "").slice(0, 6);
  return `${truncated.slice(0, USERNAME_MAX - rand.length)}${rand}`;
}
