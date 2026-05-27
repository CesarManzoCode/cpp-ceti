import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-[var(--radius-lg)] border bg-card text-card-foreground transition-[border-color,box-shadow,background-color] duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-[var(--shadow-xs)]",
        flat: "border-border shadow-none",
        elevated: "border-border shadow-[var(--shadow-md)]",
        interactive: [
          "border-border shadow-[var(--shadow-xs)] cursor-pointer",
          "hover:border-border-strong hover:shadow-[var(--shadow-sm)]",
          "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]",
        ].join(" "),
        muted: "border-border/60 bg-surface-2 shadow-none",
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
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base font-semibold leading-tight tracking-tight",
        className,
      )}
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
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
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
