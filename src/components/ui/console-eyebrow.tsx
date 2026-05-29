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
 * Eyebrow editorial: uppercase, tight letterspacing, no decoration.
 * Used as section labels across landing + internal pages.
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
      className={cn("eyebrow inline-block", toneColor[tone], className)}
      {...props}
    >
      {children}
    </span>
  );
}
