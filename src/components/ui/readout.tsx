import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Lectura de una medida (XP, racha, lecciones, retos).
 *
 * No es una tarjeta: es una cifra con su etiqueta, como la lectura de
 * un instrumento. Se agrupan con `ReadoutBar`, separadas por filetes,
 * porque son valores comparables del mismo sistema — no tres objetos
 * independientes que casualmente miden algo.
 */
interface ReadoutProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  /** Marca gráfica pequeña a la izquierda de la etiqueta (llama, rayo…). */
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
      className={cn("flex min-w-0 flex-col gap-1.5", className)}
      {...props}
    >
      <p className="label-micro flex items-center gap-1.5 text-muted-foreground">
        {mark ? (
          <span className="inline-flex [&_svg]:size-3.5">{mark}</span>
        ) : null}
        {label}
      </p>
      <p
        className={cn(
          "font-mono font-medium leading-none tabular-nums text-foreground",
          size === "lg" ? "text-[32px]" : "text-[26px]",
        )}
      >
        {value}
      </p>
      {sub ? (
        <p className="text-xs leading-snug text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  );
}

/**
 * Fila de lecturas separadas por filetes. En móvil se parte en dos
 * columnas para que las cifras sigan siendo grandes y comparables.
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
        "grid grid-cols-2 gap-x-6 gap-y-6 border-y border-border py-5",
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
