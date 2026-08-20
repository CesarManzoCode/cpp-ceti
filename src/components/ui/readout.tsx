import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Una medida del alumno (XP, racha, lecciones). No es un KPI de
 * dashboard: es un dato de apoyo, así que la cifra es grande pero la
 * pieza es pequeña y vive en el margen de la página, nunca en el
 * centro. Se agrupan con `ReadoutBar`.
 */
interface ReadoutProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  /** Marca gráfica pequeña junto a la etiqueta (llama, rayo…). */
  mark?: React.ReactNode;
  size?: "default" | "lg";
}

export function Readout({
  label,
  value,
  sub,
  mark,
  size = "default",
  className,
  ...props
}: ReadoutProps) {
  return (
    <div
      data-slot="readout"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
        {mark ? (
          <span className="inline-flex [&_svg]:size-4">{mark}</span>
        ) : null}
        {label}
      </p>
      <p
        className={cn(
          "font-bold leading-none tabular-nums tracking-[-0.03em] text-foreground",
          size === "lg" ? "text-[34px]" : "text-[28px]",
        )}
      >
        {value}
      </p>
      {sub ? (
        <p className="text-[13px] leading-snug text-subtle-foreground">{sub}</p>
      ) : null}
    </div>
  );
}

/**
 * Fila de medidas. En móvil son dos columnas para que las cifras sigan
 * siendo grandes; en desktop una fila de tres dentro de una sola pieza.
 */
export function ReadoutBar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="readout-bar"
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-6 rounded-[var(--radius-lg)] border border-border bg-card p-5",
        "shadow-[var(--shadow-xs)]",
        "sm:grid-cols-3 sm:gap-x-0 sm:divide-x sm:divide-border",
        "[&>[data-slot=readout]]:sm:px-6 [&>[data-slot=readout]]:sm:first:pl-0 [&>[data-slot=readout]]:sm:last:pr-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type { ReadoutProps };
