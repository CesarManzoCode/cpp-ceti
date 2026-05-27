import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionRuleProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  tone?: "muted" | "primary";
}

/**
 * Section heading limpio para listas/grids dentro del app:
 * `Section title          trailing`
 * Tipografía Inter Semibold, sin motivos terminal. Pensado para
 * dar estructura clara sin agregar ruido decorativo.
 */
export function SectionRule({
  children,
  trailing,
  className,
  ...props
}: SectionRuleProps) {
  return (
    <div
      data-slot="section-rule"
      className={cn("flex items-baseline justify-between gap-3", className)}
      {...props}
    >
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {children}
      </h2>
      {trailing ? (
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
