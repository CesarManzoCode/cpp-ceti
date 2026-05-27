import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "rounded-[var(--radius-md)]",
    "transition-[background,color,border-color,box-shadow,transform] duration-150 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "[&_svg]:transition-transform [&_svg]:duration-200",
    "select-none active:scale-[0.97] active:transition-transform active:duration-75",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow-[var(--shadow-xs)]",
          "hover:bg-primary/92 hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px]",
          "active:translate-y-0 active:shadow-[var(--shadow-xs)]",
        ].join(" "),
        destructive: [
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-xs)]",
          "hover:bg-destructive/92 hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px]",
          "active:translate-y-0",
        ].join(" "),
        success: [
          "bg-success text-success-foreground shadow-[var(--shadow-xs)]",
          "hover:bg-success/92 hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px]",
          "active:translate-y-0",
        ].join(" "),
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-accent hover:border-border-strong",
          "active:bg-accent",
        ].join(" "),
        secondary: [
          "bg-secondary text-secondary-foreground border border-border/60",
          "hover:bg-accent hover:border-border",
          "active:bg-accent",
        ].join(" "),
        soft: [
          "bg-primary-soft text-primary-soft-foreground",
          "hover:bg-primary-soft/80",
        ].join(" "),
        ghost: [
          "text-muted-foreground hover:bg-accent hover:text-foreground",
        ].join(" "),
        link: "text-primary underline-offset-4 hover:underline px-0 h-auto active:scale-100",
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
      {loading ? <ButtonSpinner /> : null}
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

/**
 * Tiny brand-aligned spinner used inside buttons. Lives here (not a
 * separate file) to keep the Button import surface clean.
 */
function ButtonSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      aria-hidden
      style={{ animation: "brand-arc 0.9s linear infinite" }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="32 28"
        opacity="0.9"
      />
    </svg>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
