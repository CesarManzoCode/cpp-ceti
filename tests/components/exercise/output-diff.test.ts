import { describe, expect, it } from "vitest";

import {
  describeDiff,
  diffOutputs,
} from "@/components/exercise/output-diff";

describe("diffOutputs", () => {
  it("devuelve null cuando las salidas son equivalentes bajo normalización", () => {
    expect(diffOutputs("Hola\n", "Hola")).toBeNull();
    expect(diffOutputs("a\nb\n", "a  \r\nb")).toBeNull();
  });

  it("detecta una diferencia de mayúsculas (el caso del screenshot)", () => {
    const diff = diffOutputs(
      "Nombre: Aurora\nCarrera: Desarrollo de Software\nCETI Colomos\n",
      "Nombre: Aurora\nCarrera: Desarrollo de software\nCETI Colomos\n",
    );
    expect(diff).not.toBeNull();
    expect(diff!.line).toBe(2);
    expect(diff!.col).toBe("Carrera: Desarrollo de ".length + 1);
    expect(diff!.caseOnly).toBe(true);
    expect(describeDiff(diff!)).toContain("mayúsculas");
    expect(describeDiff(diff!)).toContain("«S»");
    expect(describeDiff(diff!)).toContain("«s»");
  });

  it("detecta una línea faltante", () => {
    const diff = diffOutputs("a\nb\nc", "a\nb");
    expect(diff!.line).toBe(3);
    expect(diff!.actualLine).toBeNull();
    expect(describeDiff(diff!)).toContain("falta la línea 3");
  });

  it("detecta una línea de más", () => {
    const diff = diffOutputs("a\nb", "a\nb\nc");
    expect(diff!.line).toBe(3);
    expect(diff!.expectedLine).toBeNull();
    expect(describeDiff(diff!)).toContain("línea de más");
  });

  it("detecta texto faltante al final de una línea", () => {
    const diff = diffOutputs("Total: 42 pesos", "Total: 42");
    expect(diff!.line).toBe(1);
    expect(diff!.col).toBe(10);
    expect(describeDiff(diff!)).toContain("te falta texto");
  });

  it("detecta texto sobrante al final de una línea", () => {
    const diff = diffOutputs("Total: 42", "Total: 42!!");
    expect(describeDiff(diff!)).toContain("te sobra texto");
  });

  it("nombra los espacios de forma legible", () => {
    const diff = diffOutputs("a b", "a  b");
    expect(diff!.line).toBe(1);
    expect(describeDiff(diff!)).toContain("un espacio");
  });
});
