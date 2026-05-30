import { z } from "zod";

export const CODE_MAX_LENGTH = 50_000;
export const STDIN_MAX_LENGTH = 10_000;
export const BUG_REPORT_MAX_LENGTH = 2_000;

export const sourceCodeSchema = z
  .string({ message: "El código es obligatorio" })
  .trim()
  .min(1, "El código no puede estar vacío")
  .max(
    CODE_MAX_LENGTH,
    `El código excede ${CODE_MAX_LENGTH.toLocaleString("es-MX")} caracteres`,
  );

export const stdinSchema = z
  .string()
  .max(
    STDIN_MAX_LENGTH,
    `El stdin excede ${STDIN_MAX_LENGTH.toLocaleString("es-MX")} caracteres`,
  )
  .optional()
  .default("");

export const cuidSchema = z.string().min(1, "Identificador inválido");

export const codeSubmissionSchema = z.object({
  exerciseId: cuidSchema,
  sourceCode: sourceCodeSchema,
});

export type CodeSubmission = z.infer<typeof codeSubmissionSchema>;

export const stepCompletionSchema = z.object({
  stepId: cuidSchema,
});

export const runCodeSchema = z.object({
  sourceCode: sourceCodeSchema,
  stdin: stdinSchema,
});

export type RunCodeInput = z.infer<typeof runCodeSchema>;

/**
 * Parsea un input con Zod y traduce ZodError → Error plano con el primer
 * mensaje legible. Las Server Actions tiran `Error(...)` que el cliente
 * captura como `err.message`; mantener esa convención.
 */
export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const first = result.error.issues[0];
    throw new Error(first?.message ?? "Datos inválidos");
  }
  return result.data;
}

// =====================================================================
// USERNAME — handle público, inmutable, lowercase
// =====================================================================

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

/**
 * Handles bloqueados por colisión con rutas internas, marca o impersonación.
 * `lower-cased` para comparar contra el input ya normalizado.
 */
export const RESERVED_USERNAMES = new Set([
  "admin", "administrator", "root", "system", "support", "soporte", "ayuda",
  "moderador", "mod", "ceti", "cpp", "cpp_ceti", "cppceti", "anthropic",
  "claude", "openai", "vercel", "next", "nextjs", "supabase",
  "app", "api", "login", "logout", "registro", "register", "signup", "signin",
  "perfil", "profile", "amigos", "friends", "invitar", "invite",
  "ejercicios", "lecciones", "logros", "u", "settings", "config",
  "user", "users", "null", "undefined", "test", "anonymous", "anon",
]);

export const usernameSchema = z
  .string({ message: "Elige un nombre de usuario" })
  .trim()
  .min(USERNAME_MIN, `Mínimo ${USERNAME_MIN} caracteres`)
  .max(USERNAME_MAX, `Máximo ${USERNAME_MAX} caracteres`)
  .transform((s) => s.toLowerCase())
  .refine((s) => USERNAME_PATTERN.test(s), {
    message: "Solo letras, números y guion bajo",
  })
  .refine((s) => !RESERVED_USERNAMES.has(s), {
    message: "Ese nombre está reservado",
  });

/**
 * Genera un username candidato desde un seed (email local-part o nombre).
 * Limpia caracteres no permitidos, recorta a MAX y pad con sufijo del id
 * si quedó muy corto. NO garantiza unicidad — el caller debe resolverla.
 */
export function generateUsernameFromSeed(seed: string, idForPadding: string): string {
  const cleaned = seed
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, USERNAME_MAX);
  if (cleaned.length >= USERNAME_MIN) return cleaned;
  const padding = idForPadding.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, USERNAME_MIN);
  return (cleaned + padding).slice(0, USERNAME_MAX) || `u${padding}`;
}
