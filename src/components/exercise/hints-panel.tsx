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
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="flex items-center gap-2 text-[15px] font-bold text-warning">
          <Lightbulb className="size-[18px]" aria-hidden />
          Pistas
        </h4>
        <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">
          {shown}/{hints.length}
        </span>
      </div>

      {shown === 0 ? (
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          ¿Atorado? Hay {hints.length}{" "}
          {hints.length === 1 ? "pista" : "pistas"} y se revelan una por una,
          para que sigas pensando entre cada una.
        </p>
      ) : (
        <ol className="space-y-2.5">
          {hints.slice(0, shown).map((hint, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-[var(--radius-md)] border border-warning/20 bg-warning-soft/45 p-3.5 text-[15px] leading-relaxed text-foreground"
            >
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full bg-warning-vivid text-[12px] font-extrabold tabular-nums text-warning-ink"
              >
                {i + 1}
              </span>
              <span className="min-w-0">{hint}</span>
            </li>
          ))}
        </ol>
      )}

      {remaining > 0 ? (
        <Button size="default" variant="outline" onClick={() => setShown(shown + 1)}>
          {shown === 0 ? "Ver primera pista" : `Ver pista ${shown + 1}`}
        </Button>
      ) : null}
    </div>
  );
}
