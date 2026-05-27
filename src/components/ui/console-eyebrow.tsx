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
 * Eyebrow consistente para secciones — motivo de terminal.
 *
 *   >_ section_name
 *
 * Se usa en TODA la app para crear identidad reconocible.
 * Reemplaza eyebrows ad-hoc tipo "Por qué" / "Cómo funciona" sueltos.
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
        "inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]",
        toneColor[tone],
        className,
      )}
      {...props}
    >
      <span aria-hidden className="opacity-70">{">_"}</span>
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
