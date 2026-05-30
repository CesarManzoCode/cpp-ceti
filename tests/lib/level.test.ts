import { describe, expect, it } from "vitest";

import { XP_PER_LEVEL, levelFromXp } from "@/lib/level";

describe("levelFromXp", () => {
  it("empieza en nivel 1 con 0 XP", () => {
    const lvl = levelFromXp(0);
    expect(lvl.level).toBe(1);
    expect(lvl.xpInCurrentLevel).toBe(0);
    expect(lvl.xpForNextLevel).toBe(XP_PER_LEVEL);
    expect(lvl.progress).toBe(0);
  });

  it("se mantiene en nivel 1 hasta justo antes del corte", () => {
    const lvl = levelFromXp(XP_PER_LEVEL - 1);
    expect(lvl.level).toBe(1);
    expect(lvl.xpInCurrentLevel).toBe(XP_PER_LEVEL - 1);
    expect(lvl.progress).toBeCloseTo((XP_PER_LEVEL - 1) / XP_PER_LEVEL);
  });

  it("transiciona a nivel 2 exactamente en XP_PER_LEVEL", () => {
    const lvl = levelFromXp(XP_PER_LEVEL);
    expect(lvl.level).toBe(2);
    expect(lvl.xpInCurrentLevel).toBe(0);
    expect(lvl.progress).toBe(0);
  });

  it("calcula nivel 3 con remanente correcto", () => {
    const lvl = levelFromXp(XP_PER_LEVEL * 2 + 50);
    expect(lvl.level).toBe(3);
    expect(lvl.xpInCurrentLevel).toBe(50);
    expect(lvl.progress).toBeCloseTo(0.5);
  });

  it("trata XP negativo como 0 (defensivo)", () => {
    const lvl = levelFromXp(-500);
    expect(lvl.level).toBe(1);
    expect(lvl.xpInCurrentLevel).toBe(0);
    expect(lvl.progress).toBe(0);
  });
});
