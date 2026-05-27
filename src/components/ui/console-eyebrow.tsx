import * as React from "react";

import { cn } from "@/lib/utils";

interface ConsoleEyebrowProps extends React.ComponentProps<"span"> {
  /** Color tone. "primary" by default, "muted" for less weight. */
  tone?: "primary" | "muted" | "warning" | "success";
  /** Show a blinking caret to the right of the label. */
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
 * Eyebrow editorial — el motivo `::` (scope operator de C++) es la firma
 * tipográfica de la marca. Va en cada cabecera de sección para crear
 * identidad reconocible a primer pixel.
 */
export function ConsoleEyebrow({
  tone = "primary",
  caret = false,
  className,
  children,
  ...props
}: ConsoleEyebrowProps) {
  return (
    <span
      data-slot="console-eyebrow"
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em]",
        toneColor[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden className="opacity-70 tracking-tighter">::</span>
      <span>{children}</span>
      {caret ? (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-[2px] bg-current animate-blink"
        />
      ) : null}
    </span>
  );
}
