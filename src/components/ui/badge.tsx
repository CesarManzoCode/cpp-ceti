import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full border font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color] duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-soft text-primary-soft-foreground",
        secondary: "border-border bg-surface-2 text-muted-foreground",
        success: "border-transparent bg-success-soft text-success",
        warning: "border-transparent bg-warning-soft text-warning",
        destructive: "border-transparent bg-destructive-soft text-destructive",
        info: "border-transparent bg-info-soft text-info",
        outline: "border-border text-foreground bg-transparent",
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
