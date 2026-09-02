import type { LeagueOutcome, LeagueTier } from "@prisma/client";

/** Orden de tiers, de más bajo a más alto. */
export const LEAGUE_TIERS: LeagueTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];

export function tierAbove(tier: LeagueTier): LeagueTier | null {
  const i = LEAGUE_TIERS.indexOf(tier);
  return i >= 0 && i < LEAGUE_TIERS.length - 1 ? LEAGUE_TIERS[i + 1]! : null;
}

export function tierBelow(tier: LeagueTier): LeagueTier | null {
  const i = LEAGUE_TIERS.indexOf(tier);
  return i > 0 ? LEAGUE_TIERS[i - 1]! : null;
}

/** Objetivo ~20 miembros/división: divisionCount = max(1, round(N/20)). */
export function divisionCountFor(memberCount: number): number {
  if (memberCount <= 0) return 0;
  return Math.max(1, Math.round(memberCount / 20));
}

/** Tamaños balanceados (diferencia máxima 1) que suman exactamente `n`. */
export function balancedDivisionSizes(n: number, divisions: number): number[] {
  if (divisions <= 0 || n < 0) return [];
  const base = Math.floor(n / divisions);
  const remainder = n % divisions;
  return Array.from({ length: divisions }, (_, i) => base + (i < remainder ? 1 : 0));
}

export interface PromotionSlots {
  promoteCount: number;
  relegateCount: number;
}

/** N>=10 → top5/bottom5. N<10 → floor(N/2) arriba y abajo. Nunca se solapan. */
export function promotionSlotsFor(memberCount: number): PromotionSlots {
  if (memberCount >= 10) return { promoteCount: 5, relegateCount: 5 };
  const slots = Math.floor(memberCount / 2);
  return { promoteCount: slots, relegateCount: slots };
}

export interface RolloverOutcome {
  outcome: LeagueOutcome;
  nextTier: LeagueTier;
}

/**
 * Resultado de rollover para un miembro dado su `rank` (1-based) dentro de
 * una división de `memberCount` miembros y su `tier` actual.
 */
export function resolveRolloverOutcome(
  rank: number,
  memberCount: number,
  tier: LeagueTier,
): RolloverOutcome {
  const { promoteCount, relegateCount } = promotionSlotsFor(memberCount);

  if (promoteCount > 0 && rank <= promoteCount) {
    const above = tierAbove(tier);
    return above ? { outcome: "promoted", nextTier: above } : { outcome: "held_at_ceiling", nextTier: tier };
  }
  if (relegateCount > 0 && rank > memberCount - relegateCount) {
    const below = tierBelow(tier);
    return below ? { outcome: "relegated", nextTier: below } : { outcome: "held_at_floor", nextTier: tier };
  }
  return { outcome: "stayed", nextTier: tier };
}
