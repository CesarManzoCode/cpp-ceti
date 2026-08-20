import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionRuleProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

/**
 * Encabezado de sección dentro de la app. Un título con peso real y,
 * a la derecha, el dato que resume la sección. Sin filetes: la
 * separación la da el espacio, que es más silencioso y escala mejor.
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
      className={cn("flex items-baseline justify-between gap-4", className)}
      {...props}
    >
      <h2 className="text-[19px] font-bold tracking-[-0.02em] text-foreground">
        {children}
      </h2>
      {trailing ? (
        <span className="shrink-0 text-[13px] font-semibold text-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
