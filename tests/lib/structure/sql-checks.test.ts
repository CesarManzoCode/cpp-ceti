import { describe, expect, it } from "vitest";

import { checkStructure } from "@/lib/structure";

const check = (contract: unknown, sql: string) => checkStructure(contract, sql, "sql");

/**
 * Cierra el hueco que ningún post-check contra el estado final de la base
 * puede cerrar: un `ROLLBACK` real y un cambio que nunca se intentó
 * terminan en el MISMO estado final — la única evidencia posible está en
 * el texto que el alumno envió, no en el resultado.
 */
describe("contrato estructural de SQL (requiresKeywords)", () => {
  it("sin contrato, nada cambia", () => {
    expect(checkStructure(null, "SELECT 1;", "sql").satisfied).toBe(true);
  });

  it("un contrato de C# (classes) no afecta un curso SQL", () => {
    const contract = { classes: [{ name: "Foo" }] };
    expect(check(contract, "SELECT 1;").satisfied).toBe(true);
  });

  it("exige BEGIN + ROLLBACK: falta ROLLBACK reprueba", () => {
    const contract = { sql: { requiresKeywords: ["BEGIN", "ROLLBACK"] } };
    const sinRollback = "BEGIN; UPDATE cuenta SET saldo=saldo-25 WHERE id=1; SELECT saldo FROM cuenta WHERE id=1;";
    const result = check(contract, sinRollback);
    expect(result.satisfied).toBe(false);
    expect(result.failures[0]).toContain("ROLLBACK");
  });

  it("saltarse la transacción por completo (el atajo real) también reprueba", () => {
    // Mismo resultado final que "actualizar y luego revertir": el atajo
    // que el post-check NUNCA podría detectar por sí solo.
    const contract = { sql: { requiresKeywords: ["BEGIN", "ROLLBACK"] } };
    const atajo = "SELECT saldo FROM cuenta WHERE id=1;";
    expect(check(contract, atajo).satisfied).toBe(false);
  });

  it("BEGIN + ROLLBACK real satisface el contrato", () => {
    const contract = { sql: { requiresKeywords: ["BEGIN", "ROLLBACK"] } };
    const real = "BEGIN; UPDATE cuenta SET saldo=saldo-25 WHERE id=1; ROLLBACK; SELECT saldo FROM cuenta WHERE id=1;";
    expect(check(contract, real).satisfied).toBe(true);
  });

  it("BEGIN + COMMIT real satisface un contrato de compromiso", () => {
    const contract = { sql: { requiresKeywords: ["BEGIN", "COMMIT"] } };
    const real =
      "BEGIN; UPDATE cuenta SET saldo=saldo-40 WHERE id=1; UPDATE cuenta SET saldo=saldo+40 WHERE id=2; COMMIT; SELECT id,saldo FROM cuenta ORDER BY id;";
    expect(check(contract, real).satisfied).toBe(true);
  });

  it("no aprueba por la palabra dentro de un comentario o un string", () => {
    const contract = { sql: { requiresKeywords: ["ROLLBACK"] } };
    const falso = `-- ROLLBACK
      SELECT 'ROLLBACK';`;
    expect(check(contract, falso).satisfied).toBe(false);
  });

  it("es insensible a mayúsculas/minúsculas, como SQLite", () => {
    const contract = { sql: { requiresKeywords: ["BEGIN", "ROLLBACK"] } };
    const minusculas = "begin; update cuenta set saldo=saldo-25 where id=1; rollback; select saldo from cuenta where id=1;";
    expect(check(contract, minusculas).satisfied).toBe(true);
  });

  it("un contrato sin classes ni sql se trata como ausente (no revienta el envío)", () => {
    expect(check({}, "SELECT 1;").satisfied).toBe(true);
  });
});
