"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Eye, Link2, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import { Markdown } from "@/components/shared/markdown";
import { cn } from "@/lib/utils";
import type { MatchingStepContent } from "@/features/lessons/types";

import { StepActions, StepHeader, Verdict } from "./step-shell";
import type { StepSignalHandler } from "./step-signal";

interface StepMatchingProps {
  content: MatchingStepContent;
  onNext: () => void;
  isPending: boolean;
  onSignal?: StepSignalHandler;
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
  onSignal,
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
  const [attempts, setAttempts] = React.useState(0);
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
    const attemptNumber = attempts + 1;
    setAttempts(attemptNumber);
    setSubmitted(true);
    if (!allCorrect) {
      setFailedAttempts((n) => n + 1);
    }
    onSignal?.({ kind: "attempt", correct: allCorrect, attemptNumber });
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
    onSignal?.({ kind: "reveal", failedAttempts });
    toast.info("Te dejamos las respuestas. Léelas con calma.");
  }

  return (
    <article className="space-y-7">
      <StepHeader label="Relaciona" icon={<Link2 aria-hidden />} tone="info">
        {content.prompt ? (
          <div className="prose-instructions text-balance text-foreground">
            <Markdown>{content.prompt}</Markdown>
          </div>
        ) : (
          <h2 className="text-balance text-[21px] font-extrabold leading-snug tracking-[-0.022em] sm:text-[24px]">
            Empareja cada concepto con su descripción.
          </h2>
        )}
      </StepHeader>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-5">
        <div>
          <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">
            Concepto
          </p>
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
                    "flex w-full items-center gap-3 rounded-[var(--radius-md)] border bg-card px-3.5 py-3 text-left text-[15px] font-semibold transition-colors",
                    "border-border hover:border-border-strong",
                    isSelected && "border-primary ring-2 ring-[var(--primary-ring)]",
                    isPaired && !submitted && "border-primary bg-primary-soft/40",
                    isCorrect && "border-success bg-success-soft text-success",
                    isWrong &&
                      "animate-shake border-destructive bg-destructive-soft text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-[var(--radius-sm)] border text-[12px] font-extrabold",
                      "border-border-strong bg-surface-2 text-muted-foreground",
                      isPaired && !submitted && "border-primary bg-primary text-primary-foreground",
                      isCorrect && "border-success bg-success text-success-foreground",
                      isWrong && "border-destructive bg-destructive text-destructive-foreground",
                    )}
                    aria-hidden
                  >
                    {idx + 1}
                  </span>
                  <span className="flex-1">
                    <InlineCodeText>{text}</InlineCodeText>
                  </span>
                  {isPaired ? (
                    <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {String.fromCharCode(65 + (pair as number))}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        </div>

        <div>
          <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.05em] text-subtle-foreground">
            Descripción
          </p>
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
                    "flex w-full items-center gap-3 rounded-[var(--radius-md)] border bg-card px-3.5 py-3 text-left text-[15px] transition-colors",
                    "border-border",
                    isClickable && "hover:border-primary hover:bg-primary-soft/30",
                    !isClickable && !submitted && "cursor-default opacity-70",
                    isPaired && !submitted && "border-primary bg-primary-soft/40 opacity-100",
                    isCorrect && "border-success bg-success-soft text-success",
                    isWrong &&
                      "animate-shake border-destructive bg-destructive-soft text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-[var(--radius-sm)] border text-[12px] font-extrabold",
                      "border-border-strong bg-surface-2 text-muted-foreground",
                      isPaired && !submitted && "border-primary bg-primary text-primary-foreground",
                      isCorrect && "border-success bg-success text-success-foreground",
                      isWrong && "border-destructive bg-destructive text-destructive-foreground",
                    )}
                    aria-hidden
                  >
                    {String.fromCharCode(65 + rightIdx)}
                  </span>
                  <span className="flex-1">
                    <InlineCodeText>{text}</InlineCodeText>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        </div>
      </div>

      {submitted ? (
        <Verdict
          className="animate-fade-up"
          tone={allCorrect ? "correct" : revealed ? "neutral" : "wrong"}
          icon={
            allCorrect ? (
              <CheckCircle2 className="size-3.5" aria-hidden />
            ) : revealed ? (
              <Eye className="size-3.5" aria-hidden />
            ) : (
              <XCircle className="size-3.5" aria-hidden />
            )
          }
          title={
            allCorrect
              ? "Todo emparejado"
              : revealed
                ? "Respuestas reveladas"
                : "Hay errores — revisa los pares en rojo"
          }
        >
          {content.explanation ?? null}
        </Verdict>
      ) : null}

      <StepActions
        leading={
          canReveal ? (
            <Button onClick={revealAnswers} variant="ghost" size="sm">
              <Eye />
              Ver respuestas
            </Button>
          ) : null
        }
      >
        {!submitted ? (
          <Button onClick={verify} disabled={!allFilled} size="lg">
            Verificar pares
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
      </StepActions>
    </article>
  );
}
