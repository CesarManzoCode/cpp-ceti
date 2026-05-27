import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "rounded-[var(--radius-md)] transition-[background,color,border-color,box-shadow,transform] duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow-[var(--shadow-xs)]",
          "hover:bg-primary/92 hover:shadow-[var(--shadow-sm)]",
          "active:bg-primary active:shadow-none active:translate-y-[0.5px]",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-xs)]",
          "hover:bg-destructive/92",
          "active:translate-y-[0.5px]",
        ].join(" "),
        success: [
          "bg-success text-success-foreground shadow-[var(--shadow-xs)]",
          "hover:bg-success/92",
          "active:translate-y-[0.5px]",
        ].join(" "),
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-accent hover:border-border-strong",
          "active:bg-accent",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground border border-border/60",
          "hover:bg-accent hover:border-border",
          "active:translate-y-[0.5px]",
        ].join(" "),
        soft: [
          "bg-primary-soft text-primary-soft-foreground",
          "hover:bg-primary-soft/80",
        ].join(" "),
        ghost: [
          "text-muted-foreground hover:bg-accent hover:text-foreground",
        ].join(" "),
        link: "text-primary underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 px-3.5 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        xl: "h-13 px-7 text-base rounded-[var(--radius-lg)]",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
        "icon-xs": "h-7 w-7 [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // asChild + loading: keep children clean, no spinner injection
  const content = asChild ? (
    children
  ) : (
    <>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </>
  );

  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
