import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionRuleProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  /** Optional trailing content (e.g. progress %, link). */
  trailing?: React.ReactNode;
  tone?: "muted" | "primary";
}

const toneClasses = {
  muted: "text-muted-foreground",
  primary: "text-primary",
} as const;

/**
 * Encabezado editorial estilo "▸ SECTION ──────────".
 * El triángulo + hairline crean estructura visual de magazine
 * — reemplaza muchos h2/h3 sueltos con algo más distintivo.
 */
export function SectionRule({
  children,
  trailing,
  tone = "muted",
  className,
  ...props
}: SectionRuleProps) {
  return (
    <div
      data-slot="section-rule"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] whitespace-nowrap",
          toneClasses[tone],
        )}
      >
        <span aria-hidden className="text-[0.85em] opacity-70">▸</span>
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      {trailing ? (
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
