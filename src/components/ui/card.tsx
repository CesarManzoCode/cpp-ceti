import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Panel. Se usa poco a propósito: la separación por defecto en este
 * producto es el espacio y el filete, no un rectángulo flotante. Un
 * panel se justifica cuando su contenido es un objeto distinto del
 * flujo de la página (un formulario, un diálogo embebido, un resultado).
 */
const cardVariants = cva(
  "rounded-[var(--radius-lg)] border bg-card text-card-foreground transition-[border-color,background-color] duration-150",
  {
    variants: {
      variant: {
        default: "border-border",
        flat: "border-border",
        elevated: "border-border shadow-[var(--shadow-md)]",
        interactive: [
          "border-border cursor-pointer",
          "hover:border-border-strong hover:bg-surface-2/60",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        ].join(" "),
        muted: "border-border bg-surface-2",
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
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base font-semibold leading-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-5 pt-0", className)}
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
