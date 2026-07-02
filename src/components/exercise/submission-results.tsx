import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOBlock } from "@/components/exercise/io-block";
import {
  describeDiff,
  diffOutputs,
  type OutputDiff,
} from "@/components/exercise/output-diff";
import type { SubmissionState } from "@/components/exercise/types";
import { normalizeOutput } from "@/lib/executor/normalize";
import { cn } from "@/lib/utils";

interface SubmissionResultsProps {
  submission: SubmissionState;
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
                <DiffedOutput
                  expected={r.expectedStdout}
                  actual={r.actualStdout}
                />
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

/**
 * Esperado vs Tu salida con la primera diferencia RESALTADA y explicada.
 * Sin esto, una diferencia de un caracter (una mayúscula, un espacio) hace
 * que ambos bloques "se vean iguales" y el alumno crea que la plataforma
 * calificó mal.
 */
function DiffedOutput({
  expected,
  actual,
}: {
  expected: string;
  actual: string;
}) {
  const diff = diffOutputs(expected, actual);

  if (!diff) {
    // Falló por otra razón (runtime error, timeout, output vacío).
    return (
      <>
        <IOBlock label="Esperado" value={expected || "(vacío)"} />
        <IOBlock label="Tu salida" value={actual || "(vacío)"} />
      </>
    );
  }

  return (
    <>
      <HighlightedOutput label="Esperado" value={expected} diff={diff} side="expected" />
      <HighlightedOutput label="Tu salida" value={actual} diff={diff} side="actual" />
      <p className="sm:col-span-2 rounded-[var(--radius-xs)] bg-warning-soft px-2.5 py-1.5 text-[12px] leading-relaxed text-warning-foreground">
        {describeDiff(diff)}
      </p>
    </>
  );
}

function HighlightedOutput({
  label,
  value,
  diff,
  side,
}: {
  label: string;
  value: string;
  diff: OutputDiff;
  side: "expected" | "actual";
}) {
  // Mostramos el output normalizado (igual que lo compara el servidor) para
  // que línea/columna del mensaje coincidan con lo que se ve en pantalla.
  const lines = normalizeOutput(value).split("\n");
  const diffLine = diff.line - 1;
  const markClass =
    side === "expected"
      ? "rounded-[2px] bg-success/25 font-semibold"
      : "rounded-[2px] bg-destructive/25 font-semibold";

  return (
    <div className="min-w-0">
      <p className="eyebrow mb-1 text-muted-foreground">{label}</p>
      <pre className="max-h-44 overflow-auto rounded-[var(--radius-xs)] bg-surface-2 px-3 py-1.5 font-mono text-[12.5px] leading-[1.55]">
        {lines.map((line, i) => {
          if (i !== diffLine) {
            return (
              <span key={i}>
                {line}
                {i < lines.length - 1 ? "\n" : ""}
              </span>
            );
          }
          const col = diff.col - 1;
          return (
            <span key={i}>
              {line.slice(0, col)}
              <mark className={markClass}>
                {line.slice(col, col + 1) || " "}
              </mark>
              {line.slice(col + 1)}
              {i < lines.length - 1 ? "\n" : ""}
            </span>
          );
        })}
        {diffLine >= lines.length && side === "actual" ? (
          <mark className={cn(markClass, "opacity-70")}>(línea faltante)</mark>
        ) : null}
      </pre>
    </div>
  );
}
