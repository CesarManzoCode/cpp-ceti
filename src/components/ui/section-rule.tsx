import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionRuleProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  trailing?: React.ReactNode;
}

/**
 * Encabezado de sección dentro de la app:
 *
 *   Título ───────────────────────────────── trailing
 *
 * El filete que une el título con el dato de la derecha es la misma
 * regla que separa todo lo demás: ata la sección al ritmo de la página
 * sin necesidad de meterla en una tarjeta.
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
      className={cn("flex items-center gap-4", className)}
      {...props}
    >
      <h2 className="shrink-0 text-[15px] font-semibold text-foreground">
        {children}
      </h2>
      <span aria-hidden className="h-px min-w-4 flex-1 bg-border" />
      {trailing ? (
        <span className="label-micro shrink-0 text-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
