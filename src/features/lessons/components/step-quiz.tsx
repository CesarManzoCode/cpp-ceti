"use client";

import * as React from "react";
import { ArrowRight, Check, CircleHelp, Eye, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import { Markdown } from "@/components/shared/markdown";
import { cn } from "@/lib/utils";
import type { QuizStepContent } from "@/features/lessons/types";

import { StepActions, StepHeader, Verdict } from "./step-shell";
import type { StepSignalHandler } from "./step-signal";
import type { LanguageId } from "@/lib/code-languages";

interface StepQuizProps {
  language: LanguageId;
  content: QuizStepContent;
  onNext: () => void;
  isPending: boolean;
  onSignal?: StepSignalHandler;
}

const ATTEMPTS_BEFORE_REVEAL = 3;

export function StepQuiz({
  language,
  content,
  onNext,
  isPending,
  onSignal,
}: StepQuizProps) {
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
    const correct = selected === content.correctIndex;
    if (!correct) {
      setFailedAttempts((n) => n + 1);
    }
    onSignal?.({ kind: "attempt", correct });
  }

  function revealAnswer() {
    setSelected(content.correctIndex);
    setRevealed(true);
    setSubmitted(true);
    setFeedbackKey((k) => k + 1);
    onSignal?.({ kind: "reveal", failedAttempts });
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

  // La explicación completa suele nombrar la respuesta correcta: mostrarla
  // tras un error equivaldría a revelarla. Se guarda para el acierto o el
  // reveal explícito.
  const showExplanation = isCorrect || revealed;

  return (
    <article className="space-y-7">
      <StepHeader label="Pregunta" icon={<CircleHelp aria-hidden />}>
        <h2 className="text-balance text-[21px] font-extrabold leading-snug tracking-[-0.022em] sm:text-[25px]">
          <InlineCodeText>{content.question}</InlineCodeText>
        </h2>
      </StepHeader>

      {/* Cada opción es una pieza tomable, con área táctil holgada.
          El estado se lee por la marca, el icono y el borde — no sólo
          por el color de fondo. */}
      <ul
        key={feedbackKey}
        className="flex flex-col gap-2.5"
        role="radiogroup"
        aria-label="Opciones"
      >
        {content.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isThisCorrect = idx === content.correctIndex;
          // La correcta sólo se pinta cuando el alumno ACERTÓ o cuando pidió
          // el reveal. Marcarla desde el primer error convertía los tres
          // intentos en un trámite: bastaba con elegir la que ya estaba
          // verde. El reintento tiene que seguir diagnosticando.
          const showCorrect =
            submitted && isThisCorrect && (isCorrect || revealed);
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
                  "flex w-full items-center gap-3.5 rounded-[var(--radius-lg)] border bg-card p-3.5 text-left transition-[border-color,background-color,box-shadow,transform] duration-150 sm:p-4",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  !submitted &&
                    "shadow-[var(--shadow-xs)] hover:-translate-y-px hover:border-primary/45 hover:shadow-[var(--shadow-sm)]",
                  isSelected && !submitted && "border-primary bg-primary-tint",
                  !isSelected && !submitted && "border-border",
                  showCorrect && "border-success bg-success-soft/70",
                  showWrong && "animate-shake border-destructive bg-destructive-soft/70",
                  submitted &&
                    !isSelected &&
                    !showCorrect &&
                    "border-border opacity-55",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[13px] font-extrabold",
                    showCorrect
                      ? "bg-success text-success-foreground"
                      : showWrong
                        ? "bg-destructive text-destructive-foreground"
                        : isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-muted-foreground",
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </span>

                <span
                  className={cn(
                    "min-w-0 flex-1 text-[16px] leading-snug",
                    showCorrect
                      ? "font-bold text-success"
                      : showWrong
                        ? "font-bold text-destructive"
                        : "font-medium text-foreground",
                  )}
                >
                  <InlineCodeText>{option}</InlineCodeText>
                </span>

                {showCorrect ? (
                  <Check
                    className="size-5 shrink-0 text-success"
                    strokeWidth={3}
                    aria-hidden
                  />
                ) : null}
                {showWrong ? (
                  <X
                    className="size-5 shrink-0 text-destructive"
                    strokeWidth={3}
                    aria-hidden
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {perOptionFeedback ? (
        <Verdict tone="hint" title="No es por ahí">
          {perOptionFeedback}
        </Verdict>
      ) : null}

      {submitted ? (
        <Verdict
          key={`fb-${feedbackKey}`}
          tone={isCorrect ? "correct" : revealed ? "neutral" : "wrong"}
          title={
            isCorrect
              ? "Correcto"
              : revealed
                ? "Respuesta revelada"
                : "Aún no — vuelve a leer la pregunta"
          }
          className={cn("animate-fade-up", isCorrect && "animate-correct")}
        >
          {showExplanation ? (
            <Markdown language={language}>{content.explanation}</Markdown>
          ) : (
            <p>
              Esa no es. Descarta lo que ya sabes que no puede ser y elige otra
              vez.
              {canReveal
                ? " Si te atoraste, puedes ver la respuesta correcta."
                : ""}
            </p>
          )}
        </Verdict>
      ) : null}

      <StepActions
        hint={!submitted ? "para verificar" : canProceed ? "para continuar" : undefined}
        leading={
          canReveal ? (
            <Button onClick={revealAnswer} variant="ghost" size="sm">
              <Eye />
              Ver respuesta correcta
            </Button>
          ) : null
        }
      >
        {!submitted ? (
          <Button onClick={handleCheck} disabled={selected === null} size="lg">
            Verificar respuesta
          </Button>
        ) : canProceed ? (
          <Button onClick={onNext} loading={isPending} size="lg">
            Continuar
            <ArrowRight />
          </Button>
        ) : (
          <Button onClick={() => setSubmitted(false)} variant="outline" size="lg">
            <RotateCcw />
            Intentar de nuevo
          </Button>
        )}
      </StepActions>
    </article>
  );
}
