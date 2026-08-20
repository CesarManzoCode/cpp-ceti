"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Barra de avance continua. Rectangular a propósito: es una regla que
 * se llena, no una píldora. Para secuencias discretas (los pasos de una
 * lección) usa `StepRuler`, que muestra cuántos faltan.
 */
const progressVariants = cva("relative w-full overflow-hidden bg-surface-3", {
  variants: {
    size: {
      xs: "h-[3px]",
      sm: "h-1",
      default: "h-1.5",
      lg: "h-2",
    },
    tone: {
      primary: "",
      success: "",
      warning: "",
    },
  },
  defaultVariants: { size: "default", tone: "primary" },
});

const indicatorTones = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
} as const;

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

function Progress({
  className,
  value,
  size,
  tone = "primary",
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-transform duration-500 ease-out",
          indicatorTones[tone ?? "primary"],
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
export type { ProgressProps };
