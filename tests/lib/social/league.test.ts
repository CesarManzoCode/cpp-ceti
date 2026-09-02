import { describe, expect, it } from "vitest";

import {
  balancedDivisionSizes,
  divisionCountFor,
  promotionSlotsFor,
  resolveRolloverOutcome,
} from "@/lib/social/league";

describe("divisionCountFor / balancedDivisionSizes", () => {
  it.each([
    [2, 1, [2]],
    [7, 1, [7]],
    [19, 1, [19]],
    [21, 1, [21]],
    [40, 2, [20, 20]],
  ])("N=%i → %i división(es) balanceada(s)", (n, expectedCount, expectedSizes) => {
    const count = divisionCountFor(n);
    expect(count).toBe(expectedCount);
    const sizes = balancedDivisionSizes(n, count);
    expect(sizes).toEqual(expectedSizes);
    expect(sizes.reduce((a, b) => a + b, 0)).toBe(n);
  });

  it("el tamaño de las divisiones nunca difiere en más de 1", () => {
    for (const n of [1, 3, 13, 55, 101]) {
      const count = divisionCountFor(n);
      const sizes = balancedDivisionSizes(n, count);
      expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
      expect(sizes.reduce((a, b) => a + b, 0)).toBe(n);
    }
  });
});

describe("promotionSlotsFor", () => {
  it("N>=10 usa top5/bottom5", () => {
    expect(promotionSlotsFor(10)).toEqual({ promoteCount: 5, relegateCount: 5 });
    expect(promotionSlotsFor(25)).toEqual({ promoteCount: 5, relegateCount: 5 });
  });

  it("N<10 usa floor(N/2) sin solapamiento", () => {
    expect(promotionSlotsFor(9)).toEqual({ promoteCount: 4, relegateCount: 4 });
    expect(promotionSlotsFor(2)).toEqual({ promoteCount: 1, relegateCount: 1 });
    expect(promotionSlotsFor(1)).toEqual({ promoteCount: 0, relegateCount: 0 });

    for (const n of [1, 2, 3, 5, 7, 9]) {
      const { promoteCount, relegateCount } = promotionSlotsFor(n);
      expect(promoteCount + relegateCount).toBeLessThanOrEqual(n);
    }
  });
});

describe("resolveRolloverOutcome", () => {
  it("Diamond top queda held_at_ceiling en vez de promoted", () => {
    const r = resolveRolloverOutcome(1, 20, "diamond");
    expect(r).toEqual({ outcome: "held_at_ceiling", nextTier: "diamond" });
  });

  it("Bronze bottom queda held_at_floor en vez de relegated", () => {
    const r = resolveRolloverOutcome(20, 20, "bronze");
    expect(r).toEqual({ outcome: "held_at_floor", nextTier: "bronze" });
  });

  it("tiers intermedios promueven/degradan normalmente", () => {
    expect(resolveRolloverOutcome(1, 20, "gold")).toEqual({
      outcome: "promoted",
      nextTier: "platinum",
    });
    expect(resolveRolloverOutcome(20, 20, "gold")).toEqual({
      outcome: "relegated",
      nextTier: "silver",
    });
  });

  it("rangos intermedios se quedan (stayed)", () => {
    expect(resolveRolloverOutcome(10, 20, "silver")).toEqual({
      outcome: "stayed",
      nextTier: "silver",
    });
  });
});
