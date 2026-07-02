import { normalizeOutput } from "@/lib/executor/normalize";

/**
 * Localización de la PRIMERA diferencia entre la salida esperada y la del
 * alumno, calculada con la MISMA normalización que usa el servidor para
 * calificar. Sirve para que el panel de resultados señale exactamente
 * dónde está el problema (una «S» mayúscula, un espacio, una línea que
 * falta) en vez de mostrar dos bloques que "se ven iguales".
 */
export interface OutputDiff {
  /** Línea (1-based) de la primera diferencia, sobre el output normalizado. */
  line: number;
  /** Columna (1-based) del primer caracter distinto dentro de esa línea. */
  col: number;
  /** Línea esperada completa; `null` si al alumno le sobran líneas. */
  expectedLine: string | null;
  /** Línea del alumno completa; `null` si le falta esta línea. */
  actualLine: string | null;
  /** `true` si TODO el output coincide salvo mayúsculas/minúsculas. */
  caseOnly: boolean;
}

export function diffOutputs(
  expected: string,
  actual: string,
): OutputDiff | null {
  const exp = normalizeOutput(expected);
  const act = normalizeOutput(actual);
  if (exp === act) return null;

  const expLines = exp.split("\n");
  const actLines = act.split("\n");
  const caseOnly = exp.toLowerCase() === act.toLowerCase();
  const lineCount = Math.max(expLines.length, actLines.length);

  for (let i = 0; i < lineCount; i++) {
    const expectedLine = i < expLines.length ? expLines[i] : null;
    const actualLine = i < actLines.length ? actLines[i] : null;
    if (expectedLine === actualLine) continue;

    let col = 1;
    if (expectedLine !== null && actualLine !== null) {
      const maxLen = Math.max(expectedLine.length, actualLine.length);
      for (let j = 0; j < maxLen; j++) {
        if (expectedLine[j] !== actualLine[j]) {
          col = j + 1;
          break;
        }
      }
    }
    return { line: i + 1, col, expectedLine, actualLine, caseOnly };
  }

  return null;
}

function charLabel(c: string | undefined): string {
  if (c === undefined) return "nada";
  if (c === " ") return "un espacio";
  if (c === "\t") return "un tab";
  return `«${c}»`;
}

/** Explicación en es-MX de la primera diferencia, lista para mostrar al alumno. */
export function describeDiff(diff: OutputDiff): string {
  const { line, col, expectedLine, actualLine } = diff;

  if (actualLine === null) {
    return `A tu salida le falta la línea ${line}: «${expectedLine}».`;
  }
  if (expectedLine === null) {
    return `Tu salida tiene una línea de más (línea ${line}): «${actualLine}».`;
  }

  const expectedChar = expectedLine[col - 1];
  const actualChar = actualLine[col - 1];

  if (expectedChar === undefined) {
    return `En la línea ${line} te sobra texto a partir de la columna ${col}: «${actualLine.slice(col - 1)}».`;
  }
  if (actualChar === undefined) {
    return `En la línea ${line} te falta texto a partir de la columna ${col}: esperábamos «${expectedLine.slice(col - 1)}».`;
  }

  const caseHint =
    expectedChar.toLowerCase() === actualChar.toLowerCase()
      ? " Ojo con mayúsculas y minúsculas."
      : "";
  return `La diferencia está en la línea ${line}, columna ${col}: esperábamos ${charLabel(expectedChar)} y tu salida tiene ${charLabel(actualChar)}.${caseHint}`;
}
