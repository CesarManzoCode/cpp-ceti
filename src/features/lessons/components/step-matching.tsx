"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/shared/markdown";
import { cn } from "@/lib/utils";
import type { MatchingStepContent } from "@/features/lessons/types";

interface StepMatchingProps {
  content: MatchingStepContent;
  onNext: () => void;
  isPending: boolean;
}

const ATTEMPTS_BEFORE_REVEAL = 3;

/**
 * Pareo conceptual. La columna izquierda mantiene su orden; la derecha se
 * mezcla al montar (una vez por instancia para evitar saltos al re-render).
 * UX click-to-pair: click en izquierda → click en derecha → forma el par.
 * Click de nuevo en un item ya emparejado desbloquea el par.
 */
export function StepMatching({
  content,
  onNext,
  isPending,
}: StepMatchingProps) {
  const lefts = content.pairs.map((p) => p.left);
  const rights = content.pairs.map((p) => p.right);

  // pairings[leftIdx] = rightIdx | null. rightIdx siempre es el ÍNDICE en
  // content.pairs.right (no en el orden mezclado). Así verificamos === leftIdx.
  const [pairings, setPairings] = React.useState<(number | null)[]>(
    () => Array(content.pairs.length).fill(null),
  );
  const [selectedLeft, setSelectedLeft] = React.useState<number | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);

  // Mezcla la columna derecha post-mount para evitar hydration mismatch.
  // Math.random() en SSR daría salidas distintas server vs client.
  const [shuffledRight, setShuffledRight] = React.useState<number[]>(() =>
    content.pairs.map((_, i) => i),
  );
  const pairCount = content.pairs.length;
  React.useEffect(() => {
    const next = Array.from({ length: pairCount }, (_, i) => i);
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount shuffle intencional
    setShuffledRight(next);
  }, [pairCount]);

  const allFilled = pairings.every((p) => p !== null);
  const allCorrect = pairings.every((p, i) => p === i);
  const canProceed = allCorrect || revealed;
  const canReveal =
    failedAttempts >= ATTEMPTS_BEFORE_REVEAL && !allCorrect && !revealed;

  function clearPair(leftIdx: number) {
    setPairings((prev) => {
      const next = [...prev];
      next[leftIdx] = null;
      return next;
    });
  }

  function handleLeftClick(leftIdx: number) {
    if (submitted) return;
    if (pairings[leftIdx] !== null) {
      clearPair(leftIdx);
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(leftIdx);
  }

  function handleRightClick(rightIdx: number) {
    if (submitted) return;
    if (selectedLeft === null) return;
    setPairings((prev) => {
      const next = [...prev];
      // Si este right ya estaba pareado con otro left, lo liberamos.
      for (let i = 0; i < next.length; i++) {
        if (next[i] === rightIdx) next[i] = null;
      }
      next[selectedLeft] = rightIdx;
      return next;
    });
    setSelectedLeft(null);
  }

  function verify() {
    setSubmitted(true);
    if (!allCorrect) {
      setFailedAttempts((n) => n + 1);
    }
  }

  function tryAgain() {
    setSubmitted(false);
    // Limpiamos sólo los pares incorrectos; los correctos quedan fijados.
    setPairings((prev) => prev.map((p, i) => (p === i ? p : null)));
  }

  function revealAnswers() {
    setPairings(content.pairs.map((_, i) => i));
    setRevealed(true);
    setSubmitted(true);
    toast.info("Te dejamos las respuestas. Léelas con calma.");
  }

  return (
    <article className="space-y-7">
      <header className="space-y-2">
        <p className="eyebrow text-primary">Pareo</p>
        {content.prompt ? (
          <div className="prose-instructions text-balance text-foreground">
            <Markdown>{content.prompt}</Markdown>
          </div>
        ) : (
          <h3 className="text-balance text-xl font-semibold tracking-tight">
            Empareja cada concepto con su descripción.
          </h3>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <ul className="space-y-2" aria-label="Conceptos">
          {lefts.map((text, idx) => {
            const isSelected = selectedLeft === idx;
            const pair = pairings[idx];
            const isPaired = pair !== null;
            const isCorrect = submitted && pair === idx;
            const isWrong = submitted && pair !== null && pair !== idx;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => handleLeftClick(idx)}
                  disabled={submitted}
                  aria-pressed={isPaired}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[var(--radius-md)] border bg-card px-4 py-3 text-left text-sm font-medium transition-all",
                    "border-border hover:border-border-strong",
                    isSelected && "border-primary ring-2 ring-[var(--primary-ring)]",
                    isPaired &&
                      !submitted &&
                      "border-primary/60 bg-primary-soft/40",
                    isCorrect && "border-success bg-success-soft text-success",
                    isWrong &&
                      "animate-shake border-destructive bg-destructive-soft text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold",
                      "border-border bg-surface-2 text-foreground",
                      isPaired && !submitted && "border-primary bg-primary text-primary-foreground",
                      isCorrect && "border-success bg-success text-success-foreground",
                      isWrong && "border-destructive bg-destructive text-destructive-foreground",
                    )}
                    aria-hidden
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1">{text}</span>
                  {isPaired ? (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {String.fromCharCode(65 + (pair as number))}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <ul className="space-y-2" aria-label="Descripciones">
          {shuffledRight.map((rightIdx) => {
            const text = rights[rightIdx];
            const pairedLeft = pairings.findIndex((p) => p === rightIdx);
            const isPaired = pairedLeft !== -1;
            const isCorrect = submitted && pairedLeft === rightIdx;
            const isWrong = submitted && isPaired && pairedLeft !== rightIdx;
            const isClickable = !submitted && selectedLeft !== null;
            return (
              <li key={rightIdx}>
                <button
                  type="button"
                  onClick={() => handleRightClick(rightIdx)}
                  disabled={submitted || !isClickable}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[var(--radius-md)] border bg-card px-4 py-3 text-left text-sm transition-all",
                    "border-border",
                    isClickable && "hover:border-primary hover:bg-primary-soft/30",
                    !isClickable && !submitted && "cursor-default opacity-70",
                    isPaired && !submitted && "border-primary/60 bg-primary-soft/40 opacity-100",
                    isCorrect && "border-success bg-success-soft text-success",
                    isWrong &&
                      "animate-shake border-destructive bg-destructive-soft text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold",
                      "border-border bg-surface-2 text-foreground",
                      isPaired && !submitted && "border-primary bg-primary text-primary-foreground",
                      isCorrect && "border-success bg-success text-success-foreground",
                      isWrong && "border-destructive bg-destructive text-destructive-foreground",
                    )}
                    aria-hidden
                  >
                    {String.fromCharCode(65 + rightIdx)}
                  </span>
                  <span className="flex-1">{text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {submitted ? (
        <div
          className={cn(
            "rounded-[var(--radius-md)] border p-4 text-sm animate-fade-up",
            canProceed
              ? "border-success/30 bg-success-soft text-success"
              : "border-warning/40 bg-warning-soft text-warning-foreground",
          )}
        >
          <p className="flex items-center gap-2 font-semibold">
            {allCorrect ? (
              <>
                <CheckCircle2 className="size-4" aria-hidden />
                ¡Todo emparejado correctamente!
              </>
            ) : revealed ? (
              <>
                <Eye className="size-4" aria-hidden />
                Respuestas reveladas
              </>
            ) : (
              <>
                <XCircle className="size-4" aria-hidden />
                Hay errores — revisa los pares marcados en rojo
              </>
            )}
          </p>
          {content.explanation ? (
            <p className="mt-1 text-foreground/85">{content.explanation}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-6">
        {canReveal ? (
          <Button
            onClick={revealAnswers}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Eye />
            Ver respuestas
          </Button>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          {!submitted ? (
            <Button onClick={verify} disabled={!allFilled} size="lg">
              Verificar
            </Button>
          ) : canProceed ? (
            <Button onClick={onNext} loading={isPending} size="lg">
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={tryAgain} variant="outline" size="lg">
              <RotateCcw />
              Intentar de nuevo
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
