import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconWrap = cva(
  "grid shrink-0 place-items-center rounded-[var(--radius-md)] transition-colors",
  {
    variants: {
      tone: {
        primary: "bg-primary-soft text-primary-soft-foreground",
        warning: "bg-warning-soft text-warning-foreground",
        success: "bg-success-soft text-success",
        info: "bg-info-soft text-info",
        muted: "bg-surface-2 text-muted-foreground",
      },
      size: {
        sm: "size-9 [&_svg]:size-4",
        md: "size-11 [&_svg]:size-5",
        lg: "size-12 [&_svg]:size-5",
      },
    },
    defaultVariants: { tone: "primary", size: "md" },
  },
);

interface StatTileProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof iconWrap> {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}

/**
 * Consolidated stat tile used by dashboard, perfil, logros. Replaces
 * three different ad-hoc implementations across the app with one premium
 * pattern: icon → label/value (+ optional sub).
 */
function StatTile({
  icon,
  label,
  value,
  sub,
  tone,
  size,
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      data-slot="stat-tile"
      className={cn(
        "group flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:p-5",
        "transition-[border-color,box-shadow] duration-200 hover:border-border-strong",
        className,
      )}
      {...props}
    >
      <span className={iconWrap({ tone, size })}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </p>
        {sub ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>
        ) : null}
      </div>
    </div>
  );
}

export { StatTile };
export type { StatTileProps };
