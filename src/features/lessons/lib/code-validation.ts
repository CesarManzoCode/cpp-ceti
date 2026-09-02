import type { LanguageId } from "@/lib/code-languages";
import type { FillBlankStepContent } from "@/features/lessons/types";

/**
 * Validación de los pasos "llena el espacio".
 *
 * Las reglas de whitespace e identificadores son COMPARTIDAS: C++ y C#
 * escriben identificadores igual y el espacio entre tokens no significa
 * nada en ninguno de los dos. Lo que sí es por lenguaje es cualquier regla
 * léxica (comentarios, literales), y va en `LANGUAGE_LEXER`.
 *
 * Cuidado con lo que NO se debe hacer aquí: bajar a minúsculas, quitar
 * puntos, o "arreglar" la respuesta. En C# `Nombre` y `nombre` son cosas
 * distintas (propiedad vs. campo) y una comparación laxa aprobaría un
 * error conceptual.
 */

/**
 * Identificador válido. C++ y C# comparten la regla básica; C# además
 * admite el prefijo `@` para escapar palabras reservadas. Se define por
 * lenguaje para que aceptar algo en uno no lo acepte en el otro por
 * accidente.
 */
const IDENTIFIER_RULES: Record<LanguageId, RegExp> = {
  cpp: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
  csharp: /^@?[a-zA-Z_][a-zA-Z0-9_]*$/,
  sql: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
};

function identifierRuleFor(language: LanguageId): RegExp {
  return IDENTIFIER_RULES[language] ?? IDENTIFIER_RULES.cpp;
}

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
 * Canonicaliza un fragmento de código para compararlo tolerando whitespace:
 * fuera de literales (`"..."` y `'...'`) el espacio sólo importa cuando
 * separa dos tokens de palabra (`int x` ≠ `intx`); en cualquier otro caso
 * se elimina, de modo que `<<endl`, `<< endl` y `<<  endl` son equivalentes
 * — igual que para el compilador. Dentro de literales se conserva todo.
 *
 * Vale igual para C# (`get{return nombre;}` ≡ `get { return nombre; }`) y
 * respeta mayúsculas: `Nombre` no es `nombre`.
 */
export function canonicalizeCode(src: string): string {
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
 * 1. Si tiene `matchBlank`, el valor debe ser un identificador válido
 *    (o cumplir el `pattern` si está definido) Y coincidir con el valor del
 *    blank referenciado. Permite "cualquier nombre, pero el mismo en
 *    ambos lugares".
 * 2. Si tiene `pattern` (sin `matchBlank`), se valida contra ese regex anclado.
 * 3. Si no, se compara contra `answer` canonicalizando whitespace
 *    (`<<endl` cuenta igual que `<< endl`). Las mayúsculas SÍ importan.
 */
export function isBlankCorrect(
  blank: FillBlankStepContent["blanks"][number],
  value: string,
  allValues: string[],
  language: LanguageId = "cpp",
): boolean {
  const trimmed = value.trim();
  if (blank.matchBlank !== undefined) {
    const formatRe = blank.pattern
      ? safeRegex(`^(?:${blank.pattern})$`)
      : identifierRuleFor(language);
    if (formatRe && !formatRe.test(trimmed)) return false;
    const other = (allValues[blank.matchBlank] ?? "").trim();
    if (!other) return false;
    return trimmed === other;
  }
  if (blank.pattern) {
    const re = safeRegex(`^(?:${blank.pattern})$`);
    if (re) return re.test(trimmed);
    return canonicalizeCode(trimmed) === canonicalizeCode(blank.answer.trim());
  }
  return canonicalizeCode(trimmed) === canonicalizeCode(blank.answer.trim());
}

/** Alias histórico del canonicalizador. */
export const canonicalizeCpp = canonicalizeCode;
