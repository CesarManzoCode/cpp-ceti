import type { LanguageId } from "@/lib/code-languages";
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
  /**
   * La clase derivada no implementa un miembro abstracto heredado
   * (`CS0534`). Es la ÚNICA categoría nueva que trajo C#: en C++ no existe
   * un error equivalente — ahí el compilador se queja al instanciar el tipo
   * abstracto, que es otra cosa y ya cae en otra categoría.
   */
  "abstract_member_not_implemented",
  /** Compiló mal por algo que no clasificamos todavía. */
  "other_compile_error",
] as const;

export type CompileErrorCategory = (typeof COMPILE_ERROR_CATEGORIES)[number];

interface CategoryRule {
  category: CompileErrorCategory;
  pattern: RegExp;
}

/**
 * Reglas de GCC/Clang, en orden: la primera que casa gana. NO se tocan —
 * los reportes históricos dependen de que sigan clasificando igual.
 */
const CPP_RULES: CategoryRule[] = [
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
 * Reglas de C# (Mono `mcs`, y también Roslyn donde los códigos difieren).
 *
 * Se reutiliza la taxonomía histórica siempre que el error del alumno sea
 * el MISMO error: el objetivo es comparar fricción entre lenguajes, no
 * fragmentar la métrica en dos vocabularios paralelos. Sólo `CS0534` es
 * una categoría nueva, porque no tiene equivalente en C++.
 *
 * Los códigos se anclan a `error CSxxxx` para no clasificar por texto
 * traducible. Ojo con dos discrepancias verificadas contra `mcs` 6.x:
 *   · Mono reporta el punto y coma faltante como `CS1525` con "expecting
 *     `;'", no como el `CS1002` de Roslyn. Se aceptan los dos.
 *   · Mono usa `CS1729` para el constructor sin argumentos correspondientes,
 *     donde Roslyn usa `CS7036`. Ambos son "argumentos inválidos".
 */
const CSHARP_RULES: CategoryRule[] = [
  // CS1002 (Roslyn) y CS1525 "expecting ... ;" (Mono).
  {
    category: "missing_semicolon",
    pattern: /error CS1002\b|error CS1525:[^\n]*expecting[^\n]*[`'"];/i,
  },
  // Llaves/paréntesis sin cerrar; fin de archivo inesperado.
  {
    category: "unbalanced_delimiters",
    pattern:
      /error CS(1513|1514|1519|1026)\b|error CS1525:[^\n]*end-of-file/i,
  },
  // Argumentos que no encajan: sobrecarga inválida, faltantes, de más.
  // Va ANTES de type_mismatch para que `f("texto")` — que en Mono emite
  // CS1502 + CS1503 — quede en la misma categoría que en GCC.
  {
    category: "invalid_arguments",
    pattern: /error CS(1501|1502|1729|7036)\b/i,
  },
  // Un nombre que no resuelve. Cubre tanto la variable inexistente (CS0103)
  // como el tipo/namespace no encontrado (CS0246) — incluido el clásico
  // "olvidé `using System;`", que Mono reporta como CS0103. GCC agrupa
  // exactamente igual con "was not declared in this scope".
  {
    category: "undeclared_identifier",
    pattern: /error CS(0103|0246|1061|0117)\b/i,
  },
  // Conversión imposible / tipos incompatibles, incluido el argumento de
  // CS1503 cuando aparece solo.
  {
    category: "type_mismatch",
    pattern: /error CS(0029|0030|0266|1503|0019)\b/i,
  },
  // Miembro abstracto heredado sin implementar.
  {
    category: "abstract_member_not_implemented",
    pattern: /error CS0534\b/i,
  },
  // Sin `Main` utilizable: el equivalente exacto de "undefined reference to
  // `main`" en el enlazador de C++.
  {
    category: "linker_error",
    pattern: /error CS(5001|0017)\b/i,
  },
];

const RULES_BY_LANGUAGE: Record<LanguageId, CategoryRule[]> = {
  cpp: CPP_RULES,
  csharp: CSHARP_RULES,
};

/**
 * Clasifica la salida del compilador con las reglas del lenguaje indicado.
 *
 * El lenguaje NO se adivina del texto: lo trae el llamador, que lo derivó
 * del curso del recurso. Aplicar los regex de GCC a un mensaje de Mono
 * (o al revés) produciría categorías inventadas.
 *
 * `language` es opcional por compatibilidad con los llamadores históricos,
 * que sólo tenían C++.
 */
export function classifyCompileError(
  compilerOutput: string | null | undefined,
  language: LanguageId = "cpp",
): CompileErrorCategory | null {
  const text = (compilerOutput ?? "").trim();
  if (!text) return null;
  const rules = RULES_BY_LANGUAGE[language] ?? CPP_RULES;
  for (const rule of rules) {
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
export function runSignalFromResult(
  result: ExecutionResult,
  language: LanguageId = "cpp",
): RunSignal {
  const outcome = runOutcomeFromStatus(result.status);
  return {
    outcome,
    errorCategory:
      outcome === "compile_error"
        ? classifyCompileError(result.compileOutput || result.stderr, language)
        : null,
  };
}
