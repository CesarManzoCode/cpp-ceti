import * as React from "react";

import { cn } from "@/lib/utils";

interface EyebrowProps extends React.ComponentProps<"span"> {
  tone?: "primary" | "muted" | "warning" | "success";
  /** Deprecated — kept for backwards compat. */
  caret?: boolean;
  children: React.ReactNode;
}

const toneColor = {
  primary: "text-primary",
  muted: "text-muted-foreground",
  warning: "text-warning",
  success: "text-success",
} as const;

/**
 * Micro-etiqueta monoespaciada en versalitas. La única mayúscula del
 * sistema: marca secciones y estados sin robarle peso al título.
 */
export function ConsoleEyebrow({
  tone = "muted",
  caret: _caret,
  className,
  children,
  ...props
}: EyebrowProps) {
  void _caret;
  return (
    <span
      data-slot="eyebrow"
      className={cn("label-micro inline-block", toneColor[tone], className)}
      {...props}
    >
      {children}
    </span>
  );
}
