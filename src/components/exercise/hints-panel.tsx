"use client";

import * as React from "react";
import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Progressive hint reveal, shared by the lesson challenge and practice viewer. */
export function HintsPanel({ hints }: { hints: string[] }) {
  const [shown, setShown] = React.useState(0);

  if (hints.length === 0) return null;

  return (
    <div className="space-y-2 rounded-[var(--radius-md)] border border-warning/30 bg-warning-soft p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="size-4 text-warning" aria-hidden />
          Pistas
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {shown}/{hints.length}
          </span>
        </p>
        {shown < hints.length ? (
          <Button size="xs" variant="ghost" onClick={() => setShown(shown + 1)}>
            Ver pista
          </Button>
        ) : null}
      </div>
      {shown > 0 ? (
        <ul className="space-y-2 text-sm text-foreground/90">
          {hints.slice(0, shown).map((hint, i) => (
            <li
              key={i}
              className="rounded border-l-2 border-warning/60 bg-card/40 px-3 py-1.5"
            >
              {hint}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
