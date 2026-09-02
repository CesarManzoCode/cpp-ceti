import { describe, expect, it } from "vitest";

import { formatSemester, formatSemesterSummary } from "@/lib/curriculum";

describe("formatSemester", () => {
  it("1 → 1.er semestre", () => {
    expect(formatSemester(1)).toBe("1.er semestre");
  });

  it("2 → 2.º semestre", () => {
    expect(formatSemester(2)).toBe("2.º semestre");
  });

  it("3 → 3.er semestre", () => {
    expect(formatSemester(3)).toBe("3.er semestre");
  });

  it("4 → 4.º semestre", () => {
    expect(formatSemester(4)).toBe("4.º semestre");
  });

  it("cualquier otro entero positivo usa el ordinal genérico", () => {
    expect(formatSemester(5)).toBe("5.º semestre");
    expect(formatSemester(8)).toBe("8.º semestre");
    expect(formatSemester(12)).toBe("12.º semestre");
  });
});

describe("formatSemesterSummary", () => {
  it("[] → null", () => {
    expect(formatSemesterSummary([])).toBeNull();
  });

  it("[3] → 3.er semestre", () => {
    expect(formatSemesterSummary([3])).toBe("3.er semestre");
  });

  it("[1, 2] → Semestres 1 y 2", () => {
    expect(formatSemesterSummary([1, 2])).toBe("Semestres 1 y 2");
  });

  it("3+ semestres usan la unión española natural", () => {
    expect(formatSemesterSummary([1, 2, 3])).toBe("Semestres 1, 2 y 3");
    expect(formatSemesterSummary([1, 2, 3, 4])).toBe("Semestres 1, 2, 3 y 4");
  });

  it("deduplica preservando la PRIMERA aparición", () => {
    expect(formatSemesterSummary([2, 1, 2])).toBe("Semestres 2 y 1");
    expect(formatSemesterSummary([1, 1, 1])).toBe("1.er semestre");
  });

  it("no ordena: preserva el orden curricular declarado tal cual llega", () => {
    expect(formatSemesterSummary([3, 1])).toBe("Semestres 3 y 1");
  });
});
