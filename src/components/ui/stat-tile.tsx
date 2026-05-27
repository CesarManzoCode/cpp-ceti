import * as React from "react";

import { cn } from "@/lib/utils";
import { BracketLabel } from "@/components/ui/bracket-label";

interface StatTileProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  /** Optional small decoration (e.g. StreakFlame). Renders to the left of label. */
  icon?: React.ReactNode;
  /** Tone is mostly decorative now — used for the sub-text and icon tint. */
  tone?: "primary" | "warning" | "success" | "info" | "muted";
  /** Layout density. */
  size?: "sm" | "md" | "lg";
}

const toneClass = {
  primary: "text-primary",
  warning: "text-warning-foreground",
  success: "text-success",
  info: "text-info",
  muted: "text-muted-foreground",
} as const;

const valueSize = {
  sm: "text-[28px]",
  md: "text-[40px]",
  lg: "text-[52px]",
} as const;

/**
 * Stat editorial: número GIGANTE en JetBrains Mono Bold + bracket
 * label arriba + sub-text. Sin colored-icon-in-cajita genérico —
 * la tipografía hace todo el peso visual.
 */
export function StatTile({
  label,
  value,
  sub,
  icon,
  tone = "primary",
  size = "md",
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      data-slot="stat-tile"
      className={cn(
        "group flex flex-col gap-2 border-t border-border pt-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon ? (
          <span className={cn("shrink-0", toneClass[tone])}>{icon}</span>
        ) : null}
        <BracketLabel tone={tone === "muted" ? "muted" : tone}>
          {label}
        </BracketLabel>
      </div>
      <p
        className={cn(
          "font-display tabular-nums leading-none text-foreground",
          valueSize[size],
        )}
      >
        {value}
      </p>
      {sub ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export type { StatTileProps };
