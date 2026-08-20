import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botones a escuadra. La jerarquía la da el peso del relleno, no el
 * tamaño del radio ni una sombra: sólido = la acción de la pantalla,
 * contorno = alternativa, fantasma = navegación o descarte.
 */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "rounded-[var(--radius-xs)]",
    "transition-[background-color,color,border-color] duration-120 ease-[var(--ease-out-quart)]",
    "disabled:pointer-events-none disabled:opacity-45",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/88",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/88",
        success: "bg-success text-success-foreground hover:bg-success/88",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-accent",
        secondary:
          "border border-border bg-surface-2 text-secondary-foreground hover:bg-accent hover:border-border-strong",
        soft: "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/75",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        link: "text-foreground underline decoration-border-strong decoration-1 underline-offset-4 hover:decoration-current px-0 h-auto",
      },
      size: {
        xs: "h-7 px-2 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3 text-[13px]",
        default: "h-9 px-3.5 text-sm",
        lg: "h-10 px-4 text-sm",
        xl: "h-12 px-5 text-[15px]",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
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
