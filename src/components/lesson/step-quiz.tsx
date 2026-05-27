"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import type { QuizStepContent } from "@/types/lesson";

interface StepQuizProps {
  content: QuizStepContent;
  onNext: () => void;
  isPending: boolean;
}

export function StepQuiz({ content, onNext, isPending }: StepQuizProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const isCorrect = selected === content.correctIndex;

  function handleCheck() {
    if (selected === null) return;
    setSubmitted(true);
  }

  return (
    <article className="space-y-7">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Pregunta
        </p>
        <h3 className="text-balance text-2xl font-semibold leading-snug tracking-tight">
          {content.question}
        </h3>
      </header>

      <ul className="space-y-2" role="radiogroup" aria-label="Opciones">
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
                  "group flex w-full items-center gap-4 rounded-[var(--radius-lg)] border bg-card p-4 text-left text-[15px] font-medium transition-all",
                  "border-border",
                  !submitted &&
                    "hover:border-border-strong hover:bg-surface-2",
                  isSelected &&
                    !submitted &&
                    "border-primary bg-primary-soft/50 ring-1 ring-primary/40",
                  showCorrect && "border-success bg-success-soft text-success",
                  showWrong &&
                    "border-destructive bg-destructive-soft text-destructive",
                  submitted &&
                    !isSelected &&
                    !isThisCorrect &&
                    "opacity-55",
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

      {submitted ? (
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            isCorrect
              ? "border-success/30 bg-success-soft"
              : "border-warning/40 bg-warning-soft",
          )}
        >
          <p
            className={cn(
              "mb-1 flex items-center gap-2 text-sm font-semibold",
              isCorrect ? "text-success" : "text-warning-foreground",
            )}
          >
            {isCorrect ? (
              <CheckCircle2 className="size-4" aria-hidden />
            ) : (
              <XCircle className="size-4" aria-hidden />
            )}
            {isCorrect ? "¡Correcto!" : "Aún no — repasa esto:"}
          </p>
          <div className="text-[15px] text-foreground/90">
            <Markdown>{content.explanation}</Markdown>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 border-t border-border/70 pt-6">
        {!submitted ? (
          <Button
            onClick={handleCheck}
            disabled={selected === null}
            size="lg"
          >
            Verificar
          </Button>
        ) : isCorrect ? (
          <Button onClick={onNext} loading={isPending} size="lg">
            Continuar
            <ArrowRight />
          </Button>
        ) : (
          <Button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
            }}
            variant="outline"
            size="lg"
          >
            <RotateCcw />
            Intentar de nuevo
          </Button>
        )}
      </div>
    </article>
  );
}
