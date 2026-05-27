import * as React from "react";

import { cn } from "@/lib/utils";

interface ConsoleEyebrowProps extends React.ComponentProps<"span"> {
  tone?: "primary" | "muted" | "warning" | "success";
  /** Deprecated — kept for backwards compat. */
  caret?: boolean;
  children: React.ReactNode;
}

const toneColor = {
  primary: "text-primary",
  muted: "text-muted-foreground",
  warning: "text-warning-foreground",
  success: "text-success",
} as const;

/**
 * Eyebrow sutil para cabeceras de sección. Inter Semibold uppercase
 * con un círculo de color al inicio — se siente premium y limpio,
 * sin caer en el motivo terminal ":: foo_bar" que se sentía técnico.
 */
export function ConsoleEyebrow({
  tone = "primary",
  caret: _caret,
  className,
  children,
  ...props
}: ConsoleEyebrowProps) {
  void _caret;
  return (
    <span
      data-slot="section-eyebrow"
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]",
        toneColor[tone],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-current"
      />
      <span>{children}</span>
    </span>
  );
}
