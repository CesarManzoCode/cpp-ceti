import { DatabaseSync } from "node:sqlite";

// =====================================================================
// Runtime SQL local para verificación (dev/tests), vía `node:sqlite`
// (DatabaseSync) — NO es el runtime de producción (eso es Wandbox, ver
// `wandbox.ts`). Existe para que `scripts/verify-content.ts` y las
// pruebas de contenido en `tests/` corran el MISMO contenido publicado
// contra un motor real, sin depender de que `sqlite3` esté instalado en
// el entorno de CI.
//
// Los tipos de `node:sqlite` viven en `scripts/node-sqlite.d.ts` — ver
// ese archivo para el porqué (incompatibilidad de versión de
// `@types/node`, no de runtime).
// =====================================================================

/**
 * Corre un script con múltiples sentencias contra una DB abierta y devuelve
 * su salida en el formato "list mode" del CLI de SQLite (el que asumen los
 * `expectedStdout`/`postCheckExpectedStdout` del paquete): sin encabezados,
 * columnas separadas por `|`, NULL como cadena vacía, una fila por línea.
 * Sólo las sentencias `SELECT` producen salida — el resto (DDL/DML/PRAGMA
 * de configuración) se ejecuta por su efecto.
 */
export function runSqlScript(db: DatabaseSync, script: string): string {
  const lines: string[] = [];
  for (const statement of splitSqlStatements(script)) {
    if (/^select\b/i.test(statement)) {
      const stmt = db.prepare(statement);
      stmt.setReturnArrays(true);
      for (const row of stmt.all()) {
        lines.push(row.map(formatSqlValue).join("|"));
      }
    } else {
      db.exec(statement);
    }
  }
  return lines.join("\n");
}

/** `NULL` imprime como cadena vacía en list mode; todo lo demás, su texto. */
export function formatSqlValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

/**
 * Separa un script en sentencias individuales por `;`. Naïve a propósito
 * (sin parser SQL): el contenido del curso no usa `;` dentro de literales
 * ni comentarios con `;`, así que partir por el delimitador es suficiente y
 * exactamente lo que hace `sqlite3 < script.sql` — con UNA excepción:
 * `CREATE TRIGGER ... BEGIN ... END` (DB2, unidad triggers/integrador) SÍ
 * contiene `;` internos entre `BEGIN` y `END`. El `sqlite3` CLI real
 * reconoce ese bloque como una sola sentencia; este splitter naïve debe
 * hacer lo mismo o corta el CREATE TRIGGER a la mitad ("incomplete
 * input"). No es una re-implementación de un parser SQL: sólo sigue
 * acumulando fragmentos mientras el trozo actual empieza con `CREATE
 * TRIGGER` y todavía no termina en `END`.
 */
export function splitSqlStatements(script: string): string[] {
  const statements: string[] = [];
  let buffer: string | null = null;

  for (const rawPart of script.split(";")) {
    buffer = buffer === null ? rawPart : `${buffer};${rawPart}`;
    const trimmed = buffer.trim();
    if (trimmed.length === 0) {
      buffer = null;
      continue;
    }

    const opensTriggerBody = /^create\s+trigger\b/i.test(trimmed);
    const closesTriggerBody = /\bend\s*$/i.test(trimmed);
    if (opensTriggerBody && !closesTriggerBody) continue;

    statements.push(trimmed);
    buffer = null;
  }

  return statements;
}

export { DatabaseSync };
