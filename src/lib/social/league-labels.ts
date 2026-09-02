import type { LeagueTier } from "@prisma/client";

export const LEAGUE_TIER_LABEL: Record<LeagueTier, string> = {
  bronze: "Bronce",
  silver: "Plata",
  gold: "Oro",
  platinum: "Platino",
  diamond: "Diamante",
};
