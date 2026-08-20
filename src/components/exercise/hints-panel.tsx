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
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h4 className="label-micro flex items-center gap-1.5 text-warning">
          <Lightbulb className="size-3.5" aria-hidden />
          Pistas
        </h4>
        <span aria-hidden className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {shown}/{hints.length}
        </span>
      </div>

      {shown === 0 ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          ¿Atorado? Hay {hints.length}{" "}
          {hints.length === 1 ? "pista" : "pistas"} y se revelan una por una,
          para que sigas pensando entre cada una.
        </p>
      ) : (
        <ol className="space-y-2.5">
          {hints.slice(0, shown).map((hint, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-foreground/90"
            >
              <span
                aria-hidden
                className="shrink-0 font-mono text-[11px] tabular-nums text-warning"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">{hint}</span>
            </li>
          ))}
        </ol>
      )}

      {remaining > 0 ? (
        <Button size="sm" variant="outline" onClick={() => setShown(shown + 1)}>
          {shown === 0 ? "Ver primera pista" : `Ver pista ${shown + 1}`}
        </Button>
      ) : null}
    </div>
  );
}
