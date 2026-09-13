import { describe, expect, it } from "vitest";

import { allPracticeSets } from "../../prisma/content/exercises";
import { normalizeOutput } from "@/lib/executor/normalize";
import {
  buildSqlScriptWithPostCheck,
  splitAtPostCheckMarker,
} from "@/lib/executor/sql-postcheck";
import { DatabaseSync, runSqlScript } from "@/lib/executor/sql-node-runtime";

/**
 * El post-check SQL (unidades 07/12/13/17/20 de bases-de-datos) verifica el
 * estado REAL de la base después del código del alumno, en la misma
 * sesión/ejecución — no basta con que el stdout visible coincida. Estas
 * pruebas corren el MISMO mecanismo que produce en `WandboxExecutor` (y en
 * `scripts/verify-content.ts`), contra un `node:sqlite` real:
 *
 *  1. las soluciones DE REFERENCIA publicadas satisfacen su propio
 *     post-check (si no, el reto sería imposible incluso para quien lo
 *     resuelve bien);
 *  2. una solución que sólo IMPRIME el texto correcto sin crear el
 *     constructo real (tabla/UNIQUE/CHECK/FK/trigger/vista) reprueba.
 */

interface CaseWithPostCheck {
  exerciseSlug: string;
  description: string | undefined;
  stdin: string;
  solutionCode: string;
  postCheckSql: string;
  postCheckExpectedStdout: string;
}

function collectPostCheckCases(): CaseWithPostCheck[] {
  const out: CaseWithPostCheck[] = [];
  for (const set of allPracticeSets) {
    if (set.courseSlug !== "bases-de-datos") continue;
    for (const ex of set.exercises) {
      for (const tc of ex.testCases) {
        if (!tc.postCheckSql) continue;
        out.push({
          exerciseSlug: ex.slug,
          description: tc.description,
          stdin: tc.stdin ?? "",
          solutionCode: ex.solutionCode,
          postCheckSql: tc.postCheckSql,
          postCheckExpectedStdout: tc.postCheckExpectedStdout ?? "",
        });
      }
    }
  }
  return out;
}

function runWithPostCheck(
  fixture: string,
  code: string,
  postCheckSql: string,
): { student: string; postCheck: string } {
  const script = buildSqlScriptWithPostCheck(fixture, code, postCheckSql);
  const db = new DatabaseSync(":memory:");
  try {
    const raw = runSqlScript(db, script);
    return splitAtPostCheckMarker(raw);
  } finally {
    db.close();
  }
}

const cases = collectPostCheckCases();

describe("post-check SQL: la solución de referencia satisface su propio post-check", () => {
  it("hay casos con post-check declarados", () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  it.each(cases.map((c) => [`${c.exerciseSlug} [${c.description ?? "?"}]`, c] as const))(
    "%s",
    (_label, c) => {
      const { postCheck } = runWithPostCheck(c.stdin, c.solutionCode, c.postCheckSql);
      expect(normalizeOutput(postCheck)).toBe(normalizeOutput(c.postCheckExpectedStdout));
    },
  );
});

describe("post-check SQL: rechaza una solución que falsifica el stdout sin crear el constructo", () => {
  it("UNIQUE falso: imprimir '1' sin declarar UNIQUE reprueba el post-check", () => {
    const fake = `CREATE TABLE ticket(id INTEGER PRIMARY KEY, folio TEXT NOT NULL); SELECT 1;`;
    const postCheckSql = `SELECT COUNT(*) FROM pragma_index_list('ticket') WHERE "unique"=1;`;
    const { student, postCheck } = runWithPostCheck("", fake, postCheckSql);
    // El alumno sí logra imprimir "1" (lo que un chequeo sólo-stdout aceptaría)...
    expect(normalizeOutput(student)).toBe("1");
    // ...pero el post-check, que consulta el ESQUEMA real, ve que no hay
    // ningún índice UNIQUE: la tabla nunca declaró la restricción.
    expect(normalizeOutput(postCheck)).toBe("0");
  });

  it("CHECK falso: insertar y releer un valor válido no prueba que exista el CHECK", () => {
    const fake = `CREATE TABLE ticket(id INTEGER PRIMARY KEY, costo INTEGER NOT NULL); INSERT INTO ticket VALUES(1,10); SELECT costo FROM ticket;`;
    const postCheckSql = `SELECT CASE WHEN UPPER(sql) LIKE '%CHECK%' THEN 'HASCHECK' ELSE 'NOCHECK' END FROM sqlite_master WHERE type='table' AND name='ticket';`;
    const { student, postCheck } = runWithPostCheck("", fake, postCheckSql);
    expect(normalizeOutput(student)).toBe("10");
    expect(normalizeOutput(postCheck)).toBe("NOCHECK");
  });

  it("trigger falso: reproducir el efecto a mano sin CREATE TRIGGER reprueba", () => {
    const fixture = `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT);`;
    // Hace exactamente lo que el trigger habría hecho, sin declarar ninguno.
    const fake = `INSERT INTO ticket VALUES(5,'ABIERTO'); INSERT INTO auditoria VALUES(5,'INSERT'); SELECT ticket_id,accion FROM auditoria;`;
    const postCheckSql = `SELECT COUNT(*) FROM sqlite_master WHERE type='trigger' AND tbl_name='ticket';`;
    const { student, postCheck } = runWithPostCheck(fixture, fake, postCheckSql);
    expect(normalizeOutput(student)).toBe("5|INSERT");
    expect(normalizeOutput(postCheck)).toBe("0");
  });

  it("vista falsa: un JOIN plano reproduce el resultado sin CREATE VIEW", () => {
    const fixture = `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(1,'Ana'); INSERT INTO ticket VALUES(10,1,'ABIERTO',100);`;
    const fake = `SELECT ticket.id,cliente.nombre,ticket.estado FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id ORDER BY ticket.id;`;
    const postCheckSql = `SELECT COUNT(*) FROM sqlite_master WHERE type='view' AND name='ticket_cliente';`;
    const { student, postCheck } = runWithPostCheck(fixture, fake, postCheckSql);
    expect(normalizeOutput(student)).toBe("10|Ana|ABIERTO");
    expect(normalizeOutput(postCheck)).toBe("0");
  });
});
