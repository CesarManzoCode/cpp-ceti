"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
          Pregunta
        </p>
        <h3 className="text-2xl font-semibold leading-snug">
          {content.question}
        </h3>
      </div>

      <ul className="space-y-2">
        {content.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isThisCorrect = idx === content.correctIndex;
          const showCorrect = submitted && isThisCorrect;
          const showWrong = submitted && isSelected && !isThisCorrect;

          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => !submitted && setSelected(idx)}
                disabled={submitted}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left text-base font-medium transition-all",
                  !submitted && "hover:border-primary/40 hover:bg-accent",
                  isSelected && !submitted && "border-primary bg-primary/10",
                  showCorrect && "border-success bg-success/10 text-success",
                  showWrong && "border-destructive bg-destructive/10 text-destructive",
                  submitted && !isSelected && !isThisCorrect && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-md border font-mono text-xs",
                    isSelected && !submitted && "border-primary bg-primary text-primary-foreground",
                    showCorrect && "border-success bg-success text-success-foreground",
                    showWrong && "border-destructive bg-destructive text-destructive-foreground",
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect ? <CheckCircle2 className="size-5 text-success" /> : null}
                {showWrong ? <XCircle className="size-5 text-destructive" /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {submitted ? (
        <div
          className={cn(
            "rounded-xl border p-4",
            isCorrect
              ? "border-success/40 bg-success/10"
              : "border-amber-500/40 bg-amber-500/10",
          )}
        >
          <p className="mb-1 text-sm font-semibold">
            {isCorrect ? "¡Correcto!" : "Aún no — repasa esto:"}
          </p>
          <div className="text-sm text-foreground/80">
            <Markdown>{content.explanation}</Markdown>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        {!submitted ? (
          <Button onClick={handleCheck} disabled={selected === null} size="lg">
            Verificar
          </Button>
        ) : isCorrect ? (
          <Button onClick={onNext} disabled={isPending} size="lg">
            Continuar
            <ArrowRight className="size-4" />
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
            Intentar de nuevo
          </Button>
        )}
      </div>
    </div>
  );
}
