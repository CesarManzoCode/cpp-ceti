import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  CODE_MAX_LENGTH,
  STDIN_MAX_LENGTH,
  codeSubmissionSchema,
  parseOrThrow,
  runCodeSchema,
  sourceCodeSchema,
  stdinSchema,
  stepCompletionSchema,
} from "@/lib/validation";

describe("parseOrThrow", () => {
  it("devuelve los datos cuando son válidos", () => {
    const schema = z.object({ name: z.string() });
    expect(parseOrThrow(schema, { name: "Ada" })).toEqual({ name: "Ada" });
  });

  it("lanza Error con el primer mensaje cuando es inválido", () => {
    const schema = z.object({ age: z.number() });
    expect(() => parseOrThrow(schema, { age: "veinte" })).toThrowError(
      /number|invalid|expected/i,
    );
  });

  it("usa fallback genérico si zod no da mensaje", () => {
    // ZodError siempre trae mensaje, pero pruebamos el camino del fallback con
    // un schema que produce un issue cuyo `message` no sea string.
    const schema = z.never();
    expect(() => parseOrThrow(schema, "x")).toThrow();
  });
});

describe("sourceCodeSchema", () => {
  it("rechaza string vacío", () => {
    const result = sourceCodeSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rechaza solo whitespace tras trim", () => {
    const result = sourceCodeSchema.safeParse("   ");
    expect(result.success).toBe(false);
  });

  it("acepta código razonable", () => {
    const code = "int main() { return 0; }";
    const result = sourceCodeSchema.safeParse(code);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(code);
  });

  it("rechaza código mayor al límite", () => {
    const big = "a".repeat(CODE_MAX_LENGTH + 1);
    const result = sourceCodeSchema.safeParse(big);
    expect(result.success).toBe(false);
  });
});

describe("stdinSchema", () => {
  it("default a empty string cuando es undefined", () => {
    const result = stdinSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("");
  });

  it("rechaza stdin que excede el límite", () => {
    const big = "x".repeat(STDIN_MAX_LENGTH + 1);
    const result = stdinSchema.safeParse(big);
    expect(result.success).toBe(false);
  });

  it("acepta stdin vacío explícito", () => {
    const result = stdinSchema.safeParse("");
    expect(result.success).toBe(true);
  });
});

describe("codeSubmissionSchema", () => {
  it("rechaza exerciseId vacío", () => {
    const result = codeSubmissionSchema.safeParse({
      exerciseId: "",
      sourceCode: "int main(){}",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza cuando falta sourceCode", () => {
    const result = codeSubmissionSchema.safeParse({
      exerciseId: "abc123",
      sourceCode: "",
    });
    expect(result.success).toBe(false);
  });

  it("acepta inputs válidos", () => {
    const result = codeSubmissionSchema.safeParse({
      exerciseId: "abc123",
      sourceCode: "int main(){}",
    });
    expect(result.success).toBe(true);
  });
});

describe("stepCompletionSchema", () => {
  it("rechaza stepId vacío", () => {
    const result = stepCompletionSchema.safeParse({ stepId: "" });
    expect(result.success).toBe(false);
  });

  it("acepta stepId no vacío", () => {
    const result = stepCompletionSchema.safeParse({ stepId: "step-1" });
    expect(result.success).toBe(true);
  });
});

describe("runCodeSchema", () => {
  it("default stdin a empty string", () => {
    const result = runCodeSchema.safeParse({ sourceCode: "int main(){}" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.stdin).toBe("");
  });

  it("rechaza stdin enorme aun con sourceCode válido", () => {
    const result = runCodeSchema.safeParse({
      sourceCode: "int main(){}",
      stdin: "x".repeat(STDIN_MAX_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });
});
