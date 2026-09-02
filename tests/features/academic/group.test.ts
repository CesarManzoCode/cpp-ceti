import { describe, expect, it } from "vitest";

import { normalizeAcademicGroup } from "@/features/academic/lib/group";

describe("normalizeAcademicGroup", () => {
  it("trim + colapsa espacios + uppercase", () => {
    expect(normalizeAcademicGroup("  3a   matutino  ")).toBe("3A MATUTINO");
  });

  it("recorta a 20 caracteres", () => {
    const long = "a".repeat(40);
    expect(normalizeAcademicGroup(long)).toHaveLength(20);
  });

  it("cadena vacía o sólo espacios se limpia a null", () => {
    expect(normalizeAcademicGroup("")).toBeNull();
    expect(normalizeAcademicGroup("   ")).toBeNull();
    expect(normalizeAcademicGroup(null)).toBeNull();
    expect(normalizeAcademicGroup(undefined)).toBeNull();
  });
});
