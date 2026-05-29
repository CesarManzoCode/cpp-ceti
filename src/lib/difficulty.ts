import type { BadgeProps } from "@/components/ui/badge";

export type Difficulty = "easy" | "medium" | "hard";

/**
 * Single source of truth for how exercise difficulty is labeled and colored.
 * Used by the lesson challenge, the practice viewer and the exercises list so
 * the same concept always reads the same way.
 */
export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
  easy: { label: "Fácil", variant: "success" },
  medium: { label: "Intermedio", variant: "info" },
  hard: { label: "Difícil", variant: "warning" },
};
