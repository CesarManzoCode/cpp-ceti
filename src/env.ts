import { z } from "zod";

const nonEmpty = z.string().trim().min(1);
const optionalNonEmpty = z
  .string()
  .trim()
  .min(1)
  .optional()
  .or(z.literal("").transform(() => undefined));
const urlOrEmpty = z
  .string()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: nonEmpty,
  DIRECT_URL: optionalNonEmpty,

  BETTER_AUTH_SECRET: nonEmpty,
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),

  GOOGLE_CLIENT_ID: optionalNonEmpty,
  GOOGLE_CLIENT_SECRET: optionalNonEmpty,

  CODE_EXECUTOR_PROVIDER: z
    .enum([
      "wandbox",
      "piston",
      "piston-selfhosted",
      "judge0-rapidapi",
      "judge0-selfhosted",
    ])
    .default("wandbox"),

  WANDBOX_URL: urlOrEmpty,
  WANDBOX_COMPILER: optionalNonEmpty,
  WANDBOX_COMPILER_OPTIONS: optionalNonEmpty,

  PISTON_URL: urlOrEmpty,
  PISTON_CPP_VERSION: optionalNonEmpty,

  JUDGE0_RAPIDAPI_KEY: optionalNonEmpty,
  JUDGE0_RAPIDAPI_HOST: optionalNonEmpty,
  JUDGE0_SELFHOSTED_URL: urlOrEmpty,
  JUDGE0_AUTH_TOKEN: optionalNonEmpty,
  JUDGE0_CPP_LANGUAGE_ID: z
    .string()
    .regex(/^\d+$/, "JUDGE0_CPP_LANGUAGE_ID debe ser numérico")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

// Reglas cruzadas: el provider seleccionado necesita su configuración.
const schema = baseSchema.superRefine((env, ctx) => {
  if (env.CODE_EXECUTOR_PROVIDER === "judge0-rapidapi" && !env.JUDGE0_RAPIDAPI_KEY) {
    ctx.addIssue({
      code: "custom",
      path: ["JUDGE0_RAPIDAPI_KEY"],
      message: "JUDGE0_RAPIDAPI_KEY es obligatorio con provider 'judge0-rapidapi'",
    });
  }
  if (env.CODE_EXECUTOR_PROVIDER === "judge0-selfhosted" && !env.JUDGE0_SELFHOSTED_URL) {
    ctx.addIssue({
      code: "custom",
      path: ["JUDGE0_SELFHOSTED_URL"],
      message: "JUDGE0_SELFHOSTED_URL es obligatorio con provider 'judge0-selfhosted'",
    });
  }
  if (env.CODE_EXECUTOR_PROVIDER === "piston-selfhosted" && !env.PISTON_URL) {
    ctx.addIssue({
      code: "custom",
      path: ["PISTON_URL"],
      message: "PISTON_URL es obligatorio con provider 'piston-selfhosted'",
    });
  }
  if (
    (env.GOOGLE_CLIENT_ID && !env.GOOGLE_CLIENT_SECRET) ||
    (env.GOOGLE_CLIENT_SECRET && !env.GOOGLE_CLIENT_ID)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["GOOGLE_CLIENT_ID"],
      message:
        "Si configuras Google OAuth, GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET deben venir ambos",
    });
  }
});

function parseEnv() {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  · ${i.path.join(".") || "<root>"}: ${i.message}`)
      .join("\n");
    // Pintamos algo legible y matamos el proceso. No exponemos los valores.
    console.error(
      `\n❌ Variables de entorno inválidas:\n${issues}\n\nRevisa .env.local contra .env.example.\n`,
    );
    throw new Error("Invalid environment variables");
  }
  return result.data;
}

export const env = parseEnv();
export type Env = z.infer<typeof schema>;

/** True solo si OAuth de Google quedó completo. */
export const googleAuthEnabled = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
);
