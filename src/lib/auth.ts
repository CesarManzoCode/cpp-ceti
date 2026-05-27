import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { db } from "./db";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleEnabled = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
  appName: "C++ CETI",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders: googleEnabled
    ? {
        google: {
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        },
      }
    : undefined,

  user: {
    additionalFields: {
      // los campos extra que necesitemos pueden añadirse aquí
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
