import * as React from "react";

import { BrickRow } from "@/components/ui/bricks";
import { cn } from "@/lib/utils";

interface StepRulerProps extends Omit<React.ComponentProps<"div">, "children"> {
  total: number;
  /** Índice del paso actual, base 0. */
  current: number;
}

/**
 * Los pasos de la lección, con el mismo lenguaje de bloques del curso:
 * cada paso es una pieza que colocas. El alumno lee "voy en el 4 y me
 * faltan 3" sin tener que interpretar un porcentaje.
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
      className={cn("flex items-center", className)}
      {...props}
    >
      <BrickRow
        className="w-full"
        total={safeTotal}
        done={current}
        current={current}
        size="md"
        srLabel={`Paso ${Math.min(current + 1, safeTotal)} de ${safeTotal}`}
      />
    </div>
  );
}
