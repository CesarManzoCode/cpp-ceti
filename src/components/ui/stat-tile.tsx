import * as React from "react";

import { cn } from "@/lib/utils";

interface StatTileProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "primary" | "warning" | "success" | "info" | "muted";
}

const toneTokens = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  info: "text-info",
  muted: "text-muted-foreground",
} as const;

/**
 * Stat tile sobrio: borde fino, icono inline a la izquierda,
 * label discreto + valor grande tabular. Sin ring decorativo,
 * sin background tonal — el color va solo en el icono.
 */
export function StatTile({
  label,
  value,
  sub,
  icon,
  tone = "primary",
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      data-slot="stat-tile"
      className={cn(
        "flex items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5",
        "transition-[border-color] duration-200 hover:border-border-strong",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-surface-2",
            toneTokens[tone],
            "[&_svg]:size-5",
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-[26px] font-bold leading-none tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {sub ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

export type { StatTileProps };
