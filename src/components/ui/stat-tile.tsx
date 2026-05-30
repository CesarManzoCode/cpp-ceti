import * as React from "react";

import { cn } from "@/lib/utils";

interface StatTileProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "primary" | "warning" | "success" | "info" | "muted";
  /** Versión compacta para sidebars o grids muy densos. */
  size?: "default" | "lg";
}

const toneIcon = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  info: "text-info",
  muted: "text-muted-foreground",
} as const;

const toneIconBg = {
  primary: "bg-primary/10 ring-primary/15",
  warning: "bg-warning/10 ring-warning/20",
  success: "bg-success/10 ring-success/20",
  info: "bg-info/10 ring-info/20",
  muted: "bg-muted ring-border/40",
} as const;

const toneAura = {
  primary: "before:bg-gradient-to-br before:from-primary/12 before:via-transparent before:to-transparent",
  warning: "before:bg-gradient-to-br before:from-warning/12 before:via-transparent before:to-transparent",
  success: "before:bg-gradient-to-br before:from-success/12 before:via-transparent before:to-transparent",
  info: "before:bg-gradient-to-br before:from-info/12 before:via-transparent before:to-transparent",
  muted: "before:bg-gradient-to-br before:from-muted before:via-transparent before:to-transparent",
} as const;

/**
 * Stat tile premium: aura tonal sutil (radial corner) + icono con ring,
 * valor grande tabular. La aura es decorativa, NUNCA dominante — el
 * número sigue siendo la jerarquía principal.
 */
export function StatTile({
  label,
  value,
  sub,
  icon,
  tone = "primary",
  size = "default",
  className,
  ...props
}: StatTileProps) {
  const isLg = size === "lg";
  return (
    <div
      data-slot="stat-tile"
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card",
        "transition-[border-color,transform,box-shadow] duration-200 ease-[var(--ease-out-quart)]",
        "hover:-translate-y-px hover:border-border-strong hover:shadow-[var(--shadow-sm)]",
        // Aura decorativa con ::before (radial corner)
        "before:pointer-events-none before:absolute before:-right-12 before:-top-12 before:size-44 before:rounded-full before:blur-2xl before:opacity-60 before:transition-opacity before:duration-300 group-hover:before:opacity-90",
        toneAura[tone],
        isLg ? "p-6" : "p-5",
        className,
      )}
      {...props}
    >
      <div className="relative flex items-start gap-4">
        {icon ? (
          <span
            className={cn(
              "grid shrink-0 place-items-center rounded-[var(--radius-md)] ring-1 ring-inset",
              isLg ? "size-12 [&_svg]:size-6" : "size-10 [&_svg]:size-5",
              toneIcon[tone],
              toneIconBg[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1.5 font-bold leading-none tracking-tight tabular-nums text-foreground",
              isLg ? "text-[34px]" : "text-[28px]",
            )}
          >
            {value}
          </p>
          {sub ? (
            <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type { StatTileProps };
