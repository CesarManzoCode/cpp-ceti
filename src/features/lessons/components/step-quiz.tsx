"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Markdown } from "@/components/shared/markdown";
import { cn } from "@/lib/utils";
import type { QuizStepContent } from "@/features/lessons/types";

interface StepQuizProps {
  content: QuizStepContent;
  onNext: () => void;
  isPending: boolean;
}

const ATTEMPTS_BEFORE_REVEAL = 3;

export function StepQuiz({ content, onNext, isPending }: StepQuizProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [feedbackKey, setFeedbackKey] = React.useState(0);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);

  const isCorrect = selected === content.correctIndex;
  const canProceed = isCorrect || revealed;
  const canReveal =
    failedAttempts >= ATTEMPTS_BEFORE_REVEAL && !isCorrect && !revealed;

  function handleCheck() {
    if (selected === null) return;
    setSubmitted(true);
    setFeedbackKey((k) => k + 1);
    if (selected !== content.correctIndex) {
      setFailedAttempts((n) => n + 1);
    }
  }

  function revealAnswer() {
    setSelected(content.correctIndex);
    setRevealed(true);
    setSubmitted(true);
    setFeedbackKey((k) => k + 1);
  }

  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key !== "Enter") return;
      if (!submitted) {
        if (selected !== null) handleCheck();
      } else if (canProceed && !isPending) {
        onNext();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, submitted, canProceed, isPending]);

  const perOptionFeedback =
    submitted && selected !== null && !isCorrect && !revealed
      ? content.feedbackPerOption?.[selected]
      : null;

  return (
    <article className="space-y-7">
      <header className="space-y-2">
        <p className="eyebrow text-primary">Pregunta</p>
        <h3 className="text-balance text-[22px] font-semibold leading-snug tracking-tight">
          {content.question}
        </h3>
      </header>

      <ul
        key={feedbackKey}
        className="space-y-2"
        role="radiogroup"
        aria-label="Opciones"
      >
        {content.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isThisCorrect = idx === content.correctIndex;
          const showCorrect = submitted && isThisCorrect;
          const showWrong = submitted && isSelected && !isThisCorrect;

          return (
            <li key={idx}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => !submitted && setSelected(idx)}
                disabled={submitted}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-[var(--radius-md)] border bg-card p-4 text-left text-[15px] font-medium transition-all",
                  "border-border",
                  !submitted &&
                    "hover:border-border-strong hover:bg-surface-2/60",
                  isSelected &&
                    !submitted &&
                    "border-primary bg-primary-soft/50",
                  showCorrect && "border-success bg-success-soft text-success",
                  showWrong &&
                    "animate-shake border-destructive bg-destructive-soft text-destructive",
                  submitted &&
                    !isSelected &&
                    !isThisCorrect &&
                    "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs font-bold",
                    "border-border bg-surface-2 text-foreground",
                    isSelected &&
                      !submitted &&
                      "border-primary bg-primary text-primary-foreground",
                    showCorrect &&
                      "border-success bg-success text-success-foreground",
                    showWrong &&
                      "border-destructive bg-destructive text-destructive-foreground",
                  )}
                  aria-hidden
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect ? (
                  <CheckCircle2 className="size-5 text-success" aria-hidden />
                ) : null}
                {showWrong ? (
                  <XCircle className="size-5 text-destructive" aria-hidden />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {perOptionFeedback ? (
        <div className="rounded-[var(--radius-md)] border border-warning/40 bg-warning-soft p-4 text-sm">
          <p className="mb-1 font-semibold text-warning-foreground">
            No es por ahí:
          </p>
          <p className="text-foreground/90">{perOptionFeedback}</p>
        </div>
      ) : null}

      {submitted ? (
        <div
          key={`fb-${feedbackKey}`}
          className={cn(
            "rounded-[var(--radius-md)] border p-5 animate-fade-up",
            canProceed
              ? "border-success/30 bg-success-soft"
              : "border-warning/40 bg-warning-soft",
            isCorrect && "animate-correct",
          )}
        >
          <p
            className={cn(
              "mb-1.5 flex items-center gap-2 text-sm font-semibold",
              canProceed ? "text-success" : "text-warning-foreground",
            )}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="size-4" aria-hidden />
                Correcto
              </>
            ) : revealed ? (
              <>
                <Eye className="size-4" aria-hidden />
                Respuesta revelada
              </>
            ) : (
              <>
                <XCircle className="size-4" aria-hidden />
                Aún no — repasa esto
              </>
            )}
          </p>
          <div className="text-[15px] text-foreground/90">
            <Markdown>{content.explanation}</Markdown>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-6">
        {canReveal ? (
          <Button
            onClick={revealAnswer}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Eye />
            Ver respuesta correcta
          </Button>
        ) : null}

        <span className="ml-auto inline-flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-1.5">
            <Kbd>Enter</Kbd>
            {!submitted ? "verificar" : canProceed ? "continuar" : ""}
          </span>
          {!submitted ? (
            <Button onClick={handleCheck} disabled={selected === null} size="lg">
              Verificar
            </Button>
          ) : canProceed ? (
            <Button onClick={onNext} loading={isPending} size="lg">
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              size="lg"
            >
              <RotateCcw />
              Intentar de nuevo
            </Button>
          )}
        </span>
      </div>
    </article>
  );
}
