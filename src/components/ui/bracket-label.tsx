import * as React from "react";

import { cn } from "@/lib/utils";

interface BracketLabelProps extends React.ComponentProps<"span"> {
  children: React.ReactNode;
  /** Subtle bracket weight. Defaults to muted-foreground for both label and brackets. */
  tone?: "muted" | "primary" | "success" | "warning" | "info";
}

const toneClasses = {
  muted: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning-foreground",
  info: "text-info",
} as const;

/**
 * Etiqueta editorial `[ LABEL ]` en monospace uppercase.
 * Usado en topbar, stats y metadata — firma visual recurrente
 * que aporta carácter de IDE/terminal.
 */
export function BracketLabel({
  tone = "muted",
  className,
  children,
  ...props
}: BracketLabelProps) {
  return (
    <span
      data-slot="bracket-label"
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden className="opacity-50">[</span>
      {children}
      <span aria-hidden className="opacity-50">]</span>
    </span>
  );
}
