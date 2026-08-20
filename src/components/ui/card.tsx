import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Pieza. En este producto la tarjeta SÍ es la unidad de composición:
 * una lección, una unidad, un logro o un resultado son objetos con
 * bordes propios sobre el lienzo. La elevación es suave y sólo sube
 * cuando el objeto es interactivo o está en foco.
 */
const cardVariants = cva(
  "rounded-[var(--radius-lg)] border bg-card text-card-foreground transition-[border-color,background-color,box-shadow,transform] duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-[var(--shadow-xs)]",
        flat: "border-border",
        elevated: "border-border shadow-[var(--shadow-md)]",
        interactive: [
          "border-border shadow-[var(--shadow-xs)] cursor-pointer",
          "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-md)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        ].join(" "),
        muted: "border-border bg-surface-2",
        accent:
          "border-primary/25 bg-primary-tint shadow-[var(--shadow-xs)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5 sm:p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-[17px] font-bold leading-tight tracking-[-0.015em]", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[15px] leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
export type { CardProps };
