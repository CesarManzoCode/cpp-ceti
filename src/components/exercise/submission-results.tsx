import type { CSSProperties } from "react";
import { Check, X } from "lucide-react";

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

/**
 * Resultado de la calificación: se lee como la salida de un runner de
 * tests. Veredicto arriba con el marcador `2/3`, y debajo un test por
 * fila con su marca en la canaleta. El caso que falló se abre en su sitio
 * con el esperado y lo obtenido lado a lado.
 */
export function SubmissionResults({
  submission,
  onTryAgain,
}: SubmissionResultsProps) {
  const passedCount = submission.results.filter((r) => r.passed).length;

  return (
    <div
      className={cn(
        "animate-fade-up rounded-[var(--radius-lg)] border p-4 sm:p-5",
        submission.passed
          ? "animate-correct border-success/30 bg-success-soft/55"
          : "animate-shake border-destructive/30 bg-destructive-soft/45",
      )}
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p
          className={cn(
            "text-[16px] font-bold",
            submission.passed ? "text-success" : "text-destructive",
          )}
        >
          {submission.feedback}
        </p>
        <span className="shrink-0 text-[13px] font-bold tabular-nums text-muted-foreground">
          {passedCount}/{submission.results.length} pruebas
        </span>
      </div>

      <ul
        data-stagger
        style={{ "--stagger": "40ms" } as CSSProperties}
        className="mt-4 flex flex-col gap-1.5"
      >
        {submission.results.map((r, idx) => (
          <li
            key={r.testId}
            style={{ "--i": idx } as CSSProperties}
            className="animate-fade-up rounded-[var(--radius-md)] border border-border bg-card px-3.5 py-2"
          >
            <div className="flex items-center gap-2.5 py-2">
              <span
                aria-hidden
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full",
                  r.passed
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground",
                )}
              >
                {r.passed ? (
                  <Check className="size-3.5" strokeWidth={3.2} />
                ) : (
                  <X className="size-3.5" strokeWidth={3.2} />
                )}
              </span>
              <span className="text-[14px] font-bold tabular-nums text-foreground">
                Prueba {idx + 1}
              </span>
              {!r.visible ? (
                <span className="text-[12px] font-semibold text-subtle-foreground">
                  oculta
                </span>
              ) : null}
              <span className="ml-auto text-[12px] font-medium tabular-nums text-subtle-foreground">
                {r.durationMs} ms
              </span>
            </div>

            {!r.passed && r.visible ? (
              <div className="grid gap-3 pb-3 sm:grid-cols-2">
                <DiffedOutput
                  expected={r.expectedStdout}
                  actual={r.actualStdout}
                />
                {r.stderr ? (
                  <div className="sm:col-span-2">
                    <p className="mb-1.5 text-[13px] font-bold text-destructive">stderr</p>
                    <pre className="max-h-40 overflow-auto rounded-[var(--radius-sm)] bg-destructive-soft px-3 py-2 font-mono text-[13px] leading-relaxed text-destructive">
                      {r.stderr}
                    </pre>
                  </div>
                ) : null}
              </div>
            ) : !r.passed && !r.visible ? (
              <p className="pb-3 text-[14px] leading-relaxed text-muted-foreground">
                Caso oculto — no mostramos la entrada. Revisa tu lógica con los
                ejemplos de arriba.
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {!submission.passed ? (
        <div className="mt-3 flex justify-end">
          <Button size="default" variant="outline" onClick={onTryAgain}>
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
      <p className="rounded-[var(--radius-md)] border border-warning/25 bg-warning-soft/60 px-3.5 py-2.5 text-[14px] leading-relaxed text-foreground sm:col-span-2">
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
      ? "rounded-[1px] bg-success/25 font-medium"
      : "rounded-[1px] bg-destructive/25 font-medium";

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[13px] font-bold text-muted-foreground">{label}</p>
      <pre className="max-h-44 overflow-auto rounded-[var(--radius-sm)] border border-border bg-surface-2 px-3 py-2 font-mono text-[13px] leading-[1.6]">
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
