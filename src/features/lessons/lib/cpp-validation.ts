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
 * Canonicaliza un fragmento de C++ para compararlo tolerando whitespace:
 * fuera de literales (`"..."` y `'...'`) el espacio sólo importa cuando
 * separa dos tokens de palabra (`int x` ≠ `intx`); en cualquier otro caso
 * se elimina, de modo que `<<endl`, `<< endl` y `<<  endl` son equivalentes
 * — igual que para el compilador. Dentro de literales se conserva todo.
 */
export function canonicalizeCpp(src: string): string {
  const isWord = (c: string) => /[A-Za-z0-9_]/.test(c);
  let out = "";
  let quote: '"' | "'" | null = null;
  let pendingSpace = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      out += c;
      if (c === "\\" && i + 1 < src.length) {
        out += src[i + 1];
        i++;
      } else if (c === quote) {
        quote = null;
      }
      continue;
    }
    if (/\s/.test(c)) {
      pendingSpace = true;
      continue;
    }
    if (pendingSpace && out.length > 0 && isWord(out[out.length - 1]) && isWord(c)) {
      out += " ";
    }
    pendingSpace = false;
    out += c;
    if (c === '"' || c === "'") quote = c;
  }
  return out;
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
 * 3. Si no, se compara contra `answer` canonicalizando whitespace de C++
 *    (`<<endl` cuenta igual que `<< endl`).
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
    return canonicalizeCpp(trimmed) === canonicalizeCpp(blank.answer.trim());
  }
  return canonicalizeCpp(trimmed) === canonicalizeCpp(blank.answer.trim());
}
