import type { FillBlankStepContent } from "@/features/lessons/types";

const CPP_IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * Crea un regex anclado a partir de una fuente. Devuelve `null` si la
 * fuente es inválida — los blanks fallback comparan exacto en ese caso.
 */
function safeRegex(source: string): RegExp | null {
  try {
    return new RegExp(source);
  } catch {
    return null;
  }
}

/**
 * Valida si la respuesta de un blank es correcta dado el resto de respuestas.
 *
 * Reglas:
 * 1. Si tiene `matchBlank`, el valor debe ser un identificador C++ válido
 *    (o cumplir el `pattern` si está definido) Y coincidir con el valor del
 *    blank referenciado. Permite "cualquier nombre, pero el mismo en
 *    ambos lugares".
 * 2. Si tiene `pattern` (sin `matchBlank`), se valida contra ese regex anclado.
 * 3. Si no, se compara exacto contra `answer`.
 */
export function isBlankCorrect(
  blank: FillBlankStepContent["blanks"][number],
  value: string,
  allValues: string[],
): boolean {
  const trimmed = value.trim();
  if (blank.matchBlank !== undefined) {
    const formatRe = blank.pattern
      ? safeRegex(`^(?:${blank.pattern})$`)
      : CPP_IDENTIFIER_RE;
    if (formatRe && !formatRe.test(trimmed)) return false;
    const other = (allValues[blank.matchBlank] ?? "").trim();
    if (!other) return false;
    return trimmed === other;
  }
  if (blank.pattern) {
    const re = safeRegex(`^(?:${blank.pattern})$`);
    if (re) return re.test(trimmed);
    return trimmed === blank.answer.trim();
  }
  return trimmed === blank.answer.trim();
}
