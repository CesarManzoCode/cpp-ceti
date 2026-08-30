import { describe, expect, it } from "vitest";

import { canonicalize, contentRevision } from "@/lib/content-revision";

describe("content revision", () => {
  it("es estable para el mismo contenido", () => {
    const value = { prompt: "Imprime hola", hints: ["usa cout"] };
    expect(contentRevision(value)).toBe(contentRevision({ ...value }));
  });

  it("no depende del orden de las claves", () => {
    expect(contentRevision({ a: 1, b: 2 })).toBe(
      contentRevision({ b: 2, a: 1 }),
    );
  });

  it("sí depende del orden de los arreglos (las pistas son secuencia)", () => {
    expect(contentRevision({ hints: ["a", "b"] })).not.toBe(
      contentRevision({ hints: ["b", "a"] }),
    );
  });

  it("cambia cuando cambia el contenido", () => {
    const before = contentRevision({ prompt: "Imprime hola" });
    const after = contentRevision({ prompt: "Imprime HOLA" });
    expect(before).not.toBe(after);
  });

  it("ignora claves undefined (equivalen a ausentes)", () => {
    expect(canonicalize({ a: 1, b: undefined })).toBe(canonicalize({ a: 1 }));
  });

  it("produce un hash corto y hexadecimal", () => {
    expect(contentRevision({ x: 1 })).toMatch(/^[0-9a-f]{12}$/);
  });
});
