import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Etiqueta de estado. Rectangular y monoespaciada: es un dato
 * (dificultad, veredicto, disponibilidad), no un adorno. El color
 * refuerza, pero el texto solo ya basta para leer el estado.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border whitespace-nowrap",
    "font-mono font-medium uppercase tracking-[0.08em]",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary-soft text-primary-soft-foreground",
        secondary: "border-border bg-surface-2 text-muted-foreground",
        success: "border-success/30 bg-success-soft text-success",
        warning: "border-warning/30 bg-warning-soft text-warning",
        destructive: "border-destructive/30 bg-destructive-soft text-destructive",
        info: "border-info/30 bg-info-soft text-info",
        outline: "border-border-strong bg-transparent text-foreground",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px] [&_svg]:size-2.5",
        md: "px-2 py-0.5 text-[11px] [&_svg]:size-3",
        lg: "px-2.5 py-1 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
