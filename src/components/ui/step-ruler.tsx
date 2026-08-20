import * as React from "react";

import { cn } from "@/lib/utils";

interface StepRulerProps extends Omit<React.ComponentProps<"div">, "children"> {
  total: number;
  /** Índice del paso actual, base 0. */
  current: number;
}

/**
 * Regla de pasos de la lección.
 *
 * Los pasos son discretos, así que el avance también: una marca por
 * paso en vez de una barra continua. El alumno lee de un vistazo
 * "voy en el 4 y faltan 3", que es la pregunta que realmente se hace
 * a media lección. La marca actual es más alta que las demás para que
 * el ojo la encuentre sin depender del color.
 */
export function StepRuler({
  total,
  current,
  className,
  ...props
}: StepRulerProps) {
  const safeTotal = Math.max(1, total);
  return (
    <div
      data-slot="step-ruler"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={Math.min(current + 1, safeTotal)}
      aria-valuetext={`Paso ${Math.min(current + 1, safeTotal)} de ${safeTotal}`}
      className={cn("flex h-3 items-end gap-[3px]", className)}
      {...props}
    >
      {Array.from({ length: safeTotal }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              "min-w-1 flex-1 rounded-[1px] transition-[height,background-color] duration-200",
              active
                ? "h-3 bg-primary"
                : done
                  ? "h-1.5 bg-primary/45"
                  : "h-1.5 bg-surface-3",
            )}
          />
        );
      })}
    </div>
  );
}
