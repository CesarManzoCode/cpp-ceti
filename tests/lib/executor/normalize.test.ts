import { describe, expect, it } from "vitest";

import { normalizeOutput } from "@/lib/executor/normalize";

describe("normalizeOutput", () => {
  it("iguala endl vs \\n (salto final opcional)", () => {
    expect(normalizeOutput("Hola\n")).toBe(normalizeOutput("Hola"));
  });

  it("convierte CRLF a LF", () => {
    expect(normalizeOutput("a\r\nb")).toBe("a\nb");
  });

  it("recorta espacios al final de cada línea, no los internos", () => {
    expect(normalizeOutput("a  \nb\t")).toBe("a\nb");
    expect(normalizeOutput("a  b")).toBe("a  b");
  });

  it("NO iguala diferencias de mayúsculas", () => {
    expect(normalizeOutput("Software")).not.toBe(normalizeOutput("software"));
  });
});
