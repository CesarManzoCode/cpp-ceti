import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botón. La jerarquía la da el relleno, no el tamaño:
 *
 *  · sólido    — la única acción principal de la pantalla
 *  · outline   — alternativa real
 *  · soft      — acción frecuente pero no protagonista
 *  · ghost     — navegación, descarte, utilidades
 *
 * Los tamaños están calibrados para el dedo: `lg` y `xl` superan los
 * 44px de alto, que es el mínimo cómodo en móvil.
 */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-[var(--ease-out-quart)]",
    "active:translate-y-px",
    // Deshabilitado = superficie apagada con texto legible; bajar la
    // opacidad de un botón sólido dejaba texto blanco sobre azul claro.
    "disabled:pointer-events-none disabled:border-transparent disabled:bg-surface-3 disabled:text-subtle-foreground disabled:shadow-none",
    // Mientras carga conserva su color: sigue siendo la acción en curso.
    "data-[loading]:!bg-primary data-[loading]:!text-primary-foreground",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-primary-hover hover:shadow-[var(--shadow-md)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:brightness-110 data-[loading]:!bg-destructive data-[loading]:!text-destructive-foreground",
        success:
          "bg-success text-success-foreground shadow-[var(--shadow-sm)] hover:brightness-110 data-[loading]:!bg-success data-[loading]:!text-success-foreground",
        outline:
          "border border-border-strong bg-card text-foreground shadow-[var(--shadow-xs)] hover:border-primary/45 hover:bg-primary-tint hover:text-primary-soft-foreground",
        secondary:
          "border border-border bg-surface-2 text-secondary-foreground hover:border-border-strong hover:bg-accent",
        soft: "bg-primary-soft text-primary-soft-foreground hover:brightness-[0.97]",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-foreground disabled:bg-transparent",
        link: "disabled:bg-transparent text-primary underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary px-0 h-auto",
      },
      size: {
        xs: "h-7 rounded-[var(--radius-xs)] px-2.5 text-xs gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 rounded-[var(--radius-sm)] px-3 text-[13px]",
        default: "h-10 rounded-[var(--radius-sm)] px-4 text-sm",
        lg: "h-11 rounded-[var(--radius-md)] px-5 text-[15px]",
        xl: "h-13 rounded-[var(--radius-lg)] px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 rounded-[var(--radius-sm)]",
        "icon-sm": "size-9 rounded-[var(--radius-sm)]",
        "icon-xs": "size-8 rounded-[var(--radius-xs)] [&_svg:not([class*='size-'])]:size-3.5",
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
