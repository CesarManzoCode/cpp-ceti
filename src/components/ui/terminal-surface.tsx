import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface TerminalSurfaceProps {
  /** Eyebrow label shown at the left of the header. */
  title?: React.ReactNode;
  /** Icon rendered before the title. */
  icon?: LucideIcon;
  /** macOS-style window dots, for editor-like surfaces. */
  dots?: boolean;
  /** Right-aligned header content (status, meta). */
  trailing?: React.ReactNode;
  /** Diagonal scan sweep while compiling/running. */
  running?: boolean;
  /** Hide the header bar entirely (raw terminal). */
  hideHeader?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

/**
 * The shared dark "terminal / console" chrome used by the editor output,
 * exercise run panels, expected-output blocks and the fill-blank surface.
 * Always dark (both themes) — see the --terminal-* tokens in globals.css.
 */
export function TerminalSurface({
  title,
  icon: Icon,
  dots,
  trailing,
  running,
  hideHeader,
  className,
  headerClassName,
  bodyClassName,
  children,
}: TerminalSurfaceProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-terminal font-mono text-terminal-fg",
        running && "scan-sweep",
        className,
      )}
    >
      {hideHeader ? null : (
        <div
          className={cn(
            "relative flex items-center justify-between gap-3 border-b border-[var(--terminal-border)] px-4 py-2",
            headerClassName,
          )}
        >
          <span className="flex min-w-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-terminal-muted">
            {dots ? (
              <span className="mr-1 flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-terminal-danger/90" />
                <span className="size-2.5 rounded-full bg-terminal-warning/90" />
                <span className="size-2.5 rounded-full bg-terminal-success/90" />
              </span>
            ) : null}
            {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
            {title ? <span className="truncate">{title}</span> : null}
          </span>
          {trailing ? (
            <span className="shrink-0 text-[11px] text-terminal-muted">
              {trailing}
            </span>
          ) : null}
        </div>
      )}
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  );
}
