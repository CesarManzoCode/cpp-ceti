import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOBlock } from "@/components/exercise/io-block";
import type { TestCaseResult } from "@/lib/executor";
import { cn } from "@/lib/utils";

interface SubmissionResultsProps {
  submission: {
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
  };
  onTryAgain: () => void;
}

/** Graded test-run results, shared by the lesson challenge and practice viewer. */
export function SubmissionResults({
  submission,
  onTryAgain,
}: SubmissionResultsProps) {
  const passedCount = submission.results.filter((r) => r.passed).length;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border p-4 animate-fade-up",
        submission.passed
          ? "border-success/30 bg-success-soft animate-correct"
          : "border-warning/40 bg-warning-soft animate-shake",
      )}
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p
          className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            submission.passed ? "text-success" : "text-warning-foreground",
          )}
        >
          {submission.passed ? (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          ) : (
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
          )}
          {submission.feedback}
        </p>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
          {passedCount}/{submission.results.length} tests
        </span>
      </div>

      <ul
        data-stagger
        style={{ "--stagger": "40ms" } as CSSProperties}
        className="space-y-2"
      >
        {submission.results.map((r, idx) => (
          <li
            key={r.testId}
            style={{ "--i": idx } as CSSProperties}
            className={cn(
              "animate-fade-up overflow-hidden rounded-[var(--radius-sm)] border bg-card text-xs",
              r.passed ? "border-border" : "border-destructive/40",
            )}
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="inline-flex items-center gap-2 font-medium">
                {r.passed ? (
                  <CheckCircle2 className="size-3.5 text-success" aria-hidden />
                ) : (
                  <XCircle className="size-3.5 text-destructive" aria-hidden />
                )}
                Test {idx + 1}
                {!r.visible ? (
                  <Badge variant="secondary" size="sm" className="uppercase">
                    Oculto
                  </Badge>
                ) : null}
              </span>
              <span className="font-mono text-[10.5px] text-muted-foreground">
                {r.durationMs}ms
              </span>
            </div>

            {!r.passed && r.visible ? (
              <div className="grid gap-2 border-t border-border/70 bg-surface-2/40 p-3 sm:grid-cols-2">
                <IOBlock label="Esperado" value={r.expectedStdout || "(vacío)"} />
                <IOBlock label="Tu salida" value={r.actualStdout || "(vacío)"} />
                {r.stderr ? (
                  <div className="sm:col-span-2">
                    <p className="eyebrow mb-1 text-destructive/80">stderr</p>
                    <pre className="max-h-40 overflow-auto rounded-md bg-destructive-soft px-2.5 py-1.5 font-mono text-[11.5px] text-destructive">
                      {r.stderr}
                    </pre>
                  </div>
                ) : null}
              </div>
            ) : !r.passed && !r.visible ? (
              <div className="border-t border-border/70 bg-surface-2/40 px-3 py-2.5">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Caso oculto — no mostramos la entrada. Revisa tu lógica con los
                  ejemplos de arriba.
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {!submission.passed ? (
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="ghost" onClick={onTryAgain}>
            Intentar de nuevo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
