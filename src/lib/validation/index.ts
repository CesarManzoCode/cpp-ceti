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
