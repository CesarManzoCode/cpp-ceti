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
  primary: {
    bg: "bg-primary/12",
    text: "text-primary",
    ring: "ring-primary/20",
  },
  warning: {
    bg: "bg-warning-soft",
    text: "text-warning-foreground",
    ring: "ring-warning/30",
  },
  success: {
    bg: "bg-success-soft",
    text: "text-success",
    ring: "ring-success/25",
  },
  info: {
    bg: "bg-info-soft",
    text: "text-info",
    ring: "ring-info/25",
  },
  muted: {
    bg: "bg-surface-2",
    text: "text-muted-foreground",
    ring: "ring-border",
  },
} as const;

/**
 * Stat card amigable estilo Mimo:
 *  • Card con borde + leve elevación
 *  • Icono prominente en círculo coloreado a la izquierda
 *  • Label discreto + valor grande en Inter Bold (sans, no mono)
 *  • Sub-text opcional para contexto extra
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
  const t = toneTokens[tone];
  return (
    <div
      data-slot="stat-tile"
      className={cn(
        "flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[var(--shadow-sm)]",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset",
            t.bg,
            t.text,
            t.ring,
            "[&_svg]:size-6",
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-[26px] font-bold leading-none tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {sub ? (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

export type { StatTileProps };
