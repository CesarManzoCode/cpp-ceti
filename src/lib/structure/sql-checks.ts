import type { SqlContractRequirement, StructureCheck } from "./contract";

// =====================================================================
// Verificación estructural ligera de SQL.
//
// No es un parser SQL: sólo neutraliza comentarios y literales de cadena
// (para que escribir "ROLLBACK" dentro de un string o un comentario no
// apruebe nada) y confirma que ciertas palabras clave aparecen de verdad
// en el envío del alumno.
//
// Existe específicamente para transacciones: un `COMMIT`/`ROLLBACK` real
// y un cambio que nunca se intentó pueden terminar en el MISMO estado
// final de la base — no hay post-check contra el resultado que distinga
// "lo revirtió" de "nunca lo intentó". Ver `contract.ts#sqlContractSchema`.
// =====================================================================

/**
 * Sustituye comentarios (`-- ...`, `/* ... *\/`) y literales de cadena
 * (`'...'`, con `''` como escape) por espacios del mismo largo. Conserva
 * las posiciones para que los índices sigan siendo válidos si algún día
 * se necesitan.
 */
export function stripSqlCommentsAndLiterals(source: string): string {
  const out = source.split("");
  const blank = (from: number, to: number) => {
    for (let k = from; k < to && k < out.length; k++) {
      if (out[k] !== "\n") out[k] = " ";
    }
  };

  let i = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];

    if (c === "-" && next === "-") {
      let j = i + 2;
      while (j < source.length && source[j] !== "\n") j++;
      blank(i, j);
      i = j;
      continue;
    }
    if (c === "/" && next === "*") {
      let j = i + 2;
      while (j < source.length && !(source[j] === "*" && source[j + 1] === "/")) {
        j++;
      }
      j = Math.min(source.length, j + 2);
      blank(i, j);
      i = j;
      continue;
    }
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < source.length) {
        if (source[j] === c && source[j + 1] === c) {
          j += 2;
          continue;
        }
        if (source[j] === c) {
          j++;
          break;
        }
        j++;
      }
      blank(i, j);
      i = j;
      continue;
    }
    i++;
  }

  return out.join("");
}

/** Verifica que el SQL enviado use de verdad las palabras clave exigidas. */
export function checkSqlConstructs(
  sql: SqlContractRequirement,
  sourceCode: string,
): StructureCheck {
  const stripped = stripSqlCommentsAndLiterals(sourceCode);
  const failures: string[] = [];

  for (const keyword of sql.requiresKeywords) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\b${escaped}\\b`, "i").test(stripped)) {
      failures.push(
        `Tu SQL debe usar \`${keyword}\` de verdad: el resultado final no basta para demostrarlo, el reto pide ese constructo.`,
      );
    }
  }

  return { satisfied: failures.length === 0, failures };
}
