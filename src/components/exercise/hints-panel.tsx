"use client";

import * as React from "react";
import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Progressive hint reveal, shared by the lesson challenge and practice viewer. */
export function HintsPanel({ hints }: { hints: string[] }) {
  const [shown, setShown] = React.useState(0);

  if (hints.length === 0) return null;

  const remaining = hints.length - shown;

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-warning/35 bg-warning-soft p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
          <Lightbulb className="size-4 text-warning" aria-hidden />
          Pistas
          <span className="font-mono text-[11px] font-medium tabular-nums text-muted-foreground">
            {shown}/{hints.length}
          </span>
        </p>
        {remaining > 0 ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShown(shown + 1)}
            className="-mr-1 text-warning-foreground hover:bg-warning/15 hover:text-warning-foreground"
          >
            {shown === 0 ? "Ver pista" : "Otra pista"}
          </Button>
        ) : null}
      </div>
      {shown === 0 ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          ¿Atorado? Tenemos {hints.length}{" "}
          {hints.length === 1 ? "pista" : "pistas"} progresivas. Se revelan una
          por una para que sigas pensando.
        </p>
      ) : (
        <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
          {hints.slice(0, shown).map((hint, i) => (
            <li
              key={i}
              className="rounded-[var(--radius-xs)] border-l-2 border-warning/70 bg-card/60 px-3 py-1.5"
            >
              {hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
