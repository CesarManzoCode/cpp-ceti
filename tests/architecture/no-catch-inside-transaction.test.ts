import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guardia estático contra el bug de la transacción abortada.
 *
 * Atrapar un error de Postgres (típicamente P2002 por UNIQUE) DENTRO de un
 * `db.$transaction()` y seguir usando esa misma transacción produce
 * `25P02 — current transaction is aborted`. El patrón correcto es
 * `createMany({ data: [...], skipDuplicates: true })` (ver `@/lib/completions`).
 *
 * Este test recorre el árbol de `src/` y falla si vuelve a aparecer un
 * `try/catch` dentro del callback de una transacción.
 */

const SRC = fileURLToPath(new URL("../../src", import.meta.url));

/** Todos los .ts/.tsx bajo `src/`, en rutas relativas a `src/`. */
function sourceFiles(dir: string, prefix = ""): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      found.push(...sourceFiles(join(dir, entry.name), rel));
    } else if (/\.tsx?$/.test(entry.name)) {
      found.push(rel);
    }
  }
  return found;
}

/** Quita comentarios y literales de string para no dar falsos positivos. */
function stripNoise(code: string): string {
  let out = "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i]!;
    const next = code[i + 1];
    if (ch === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === "\\") i++;
        i++;
      }
      i++;
      out += '""';
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/** Cuerpo (con llaves balanceadas) de cada `$transaction(...)` del archivo. */
function transactionBodies(code: string): string[] {
  const bodies: string[] = [];
  const marker = "$transaction(";
  let from = 0;
  for (;;) {
    const at = code.indexOf(marker, from);
    if (at < 0) break;
    const open = code.indexOf("{", at);
    if (open < 0) break;
    let depth = 0;
    let end = open;
    for (; end < code.length; end++) {
      if (code[end] === "{") depth++;
      else if (code[end] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    bodies.push(code.slice(open, end + 1));
    from = end + 1;
  }
  return bodies;
}

describe("ningún try/catch dentro de db.$transaction()", () => {
  it("no reaparece el antipatrón que dejaba la transacción abortada (25P02)", () => {
    const offenders: string[] = [];

    for (const file of sourceFiles(SRC)) {
      const code = stripNoise(readFileSync(join(SRC, file), "utf8"));
      for (const body of transactionBodies(code)) {
        if (/\bcatch\s*[({]/.test(body)) {
          offenders.push(`src/${file}`);
          break;
        }
      }
    }

    expect(
      offenders,
      "Atrapar un error de Postgres dentro de una transacción la deja abortada " +
        "(25P02). Usa createMany({ skipDuplicates: true }) — ver src/lib/completions.ts.",
    ).toEqual([]);
  });
});
