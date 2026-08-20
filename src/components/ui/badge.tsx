import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Ficha de estado. Se lee en sans (no en monoespaciada: no es código)
 * y siempre lleva texto — el color sólo refuerza lo que la palabra ya
 * dice, para que funcione también sin ver el color.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap",
    "font-semibold leading-none",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary-soft text-primary-soft-foreground",
        secondary: "border-border bg-surface-2 text-muted-foreground",
        success: "border-success/25 bg-success-soft text-success",
        warning: "border-warning/25 bg-warning-soft text-warning",
        destructive: "border-destructive/25 bg-destructive-soft text-destructive",
        info: "border-info/25 bg-info-soft text-info",
        outline: "border-border-strong bg-transparent text-foreground",
        solid: "border-transparent bg-primary text-primary-foreground",
      },
      size: {
        sm: "px-2 py-1 text-[11px] [&_svg]:size-3",
        md: "px-2.5 py-1 text-xs [&_svg]:size-3.5",
        lg: "px-3 py-1.5 text-[13px] [&_svg]:size-4",
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
