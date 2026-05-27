import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-medium transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-soft text-primary-soft-foreground",
        secondary:
          "border-border bg-surface-2 text-muted-foreground",
        success:
          "border-transparent bg-success-soft text-success",
        warning:
          "border-transparent bg-warning-soft text-warning-foreground",
        destructive:
          "border-transparent bg-destructive-soft text-destructive",
        info:
          "border-transparent bg-info-soft text-info",
        outline:
          "border-border text-foreground bg-transparent",
        solid:
          "border-transparent bg-foreground text-background",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] tracking-wide [&_svg]:size-3",
        md: "px-2.5 py-0.5 text-xs [&_svg]:size-3.5",
        lg: "px-3 py-1 text-sm [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
