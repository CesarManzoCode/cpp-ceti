import type { ExecutionResult, ExecutionStatus } from "@/lib/executor";

import type { RunOutcome } from "./events";

/**
 * Categorías de error de compilación. Guardamos la CATEGORÍA, nunca el
 * código fuente ni el mensaje crudo del compilador (que puede contener
 * fragmentos del programa del alumno). Con esto se puede responder "¿qué
 * error de compilación domina en la unidad de arreglos?" sin acumular
 * código en la capa de analytics.
 */
export const COMPILE_ERROR_CATEGORIES = [
  /** Falta `;` (el clásico). */
  "missing_semicolon",
  /** `'cout' was not declared in this scope` → falta include/using/typo. */
  "undeclared_identifier",
  /** Falta `#include <...>`. */
  "missing_include",
  /** Tipos incompatibles en asignación/operación. */
  "type_mismatch",
  /** Llaves/paréntesis sin cerrar, `expected '}'`. */
  "unbalanced_delimiters",
  /** `main` ausente o firma inválida; errores del enlazador. */
  "linker_error",
  /** Llamada a función con argumentos que no encajan. */
  "invalid_arguments",
  /** Compiló mal por algo que no clasificamos todavía. */
  "other_compile_error",
] as const;

export type CompileErrorCategory = (typeof COMPILE_ERROR_CATEGORIES)[number];

/** Reglas en orden: la primera que casa gana. */
const RULES: { category: CompileErrorCategory; pattern: RegExp }[] = [
  { category: "missing_semicolon", pattern: /expected\s+['‘"]?;/i },
  {
    category: "unbalanced_delimiters",
    pattern: /expected\s+['‘"]?[}\)\]]|unterminated|expected declaration/i,
  },
  {
    category: "missing_include",
    pattern: /no such file or directory|file not found|fatal error:\s*<[^>]+>/i,
  },
  {
    category: "undeclared_identifier",
    pattern:
      /was not declared in this scope|undeclared identifier|has not been declared|use of undeclared/i,
  },
  {
    category: "invalid_arguments",
    pattern:
      /too few arguments|too many arguments|no matching function for call|candidate expects/i,
  },
  {
    category: "type_mismatch",
    pattern:
      /cannot convert|incompatible types|invalid conversion|no viable conversion|invalid operands/i,
  },
  {
    category: "linker_error",
    pattern:
      /undefined reference|ld returned|collect2:|multiple definition|undefined symbol/i,
  },
];

/**
 * Clasifica la salida del compilador. Devuelve `null` si no hay salida que
 * clasificar (p.ej. el programa compiló bien).
 */
export function classifyCompileError(
  compilerOutput: string | null | undefined,
): CompileErrorCategory | null {
  const text = (compilerOutput ?? "").trim();
  if (!text) return null;
  for (const rule of RULES) {
    if (rule.pattern.test(text)) return rule.category;
  }
  return "other_compile_error";
}

/** Traduce el estado del ejecutor al outcome del evento `code_run`. */
export function runOutcomeFromStatus(status: ExecutionStatus): RunOutcome {
  switch (status) {
    case "accepted":
    case "wrong_answer":
      // Un run del playground no se califica: si corrió, corrió.
      return "success";
    case "compile_error":
      return "compile_error";
    case "runtime_error":
    case "memory_limit":
      return "runtime_error";
    case "time_limit":
      return "time_limit";
    case "internal_error":
      return "internal_error";
    default:
      // Un estado nuevo del ejecutor no debe romper la telemetría.
      return "internal_error";
  }
}

export interface RunSignal {
  outcome: RunOutcome;
  errorCategory: CompileErrorCategory | null;
}

/** Señal de producto derivada de una ejecución del playground. */
export function runSignalFromResult(result: ExecutionResult): RunSignal {
  const outcome = runOutcomeFromStatus(result.status);
  return {
    outcome,
    errorCategory:
      outcome === "compile_error"
        ? classifyCompileError(result.compileOutput || result.stderr)
        : null,
  };
}
