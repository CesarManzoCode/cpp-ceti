import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Small keyboard chip — used inline for shortcuts (e.g. "Pulsa Ctrl+Enter").
 * Pairs with the global `kbd` styles in globals.css and adds React-friendly composition.
 */
function Kbd({ className, children, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center font-mono text-[0.7em] font-semibold tabular-nums leading-none",
        "px-1.5 py-0.5 rounded-md border border-border bg-surface-2 text-foreground",
        "shadow-[inset_0_-1px_0_var(--border)]",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export { Kbd };
