"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Eye,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/shared/markdown";
import { renderTokens, tokenizeCpp } from "@/features/lessons/lib/cpp-syntax";
import { cn } from "@/lib/utils";
import type { CodeCompletionStepContent } from "@/features/lessons/types";

import { StepActions, StepHeader, Verdict } from "./step-shell";

interface StepCodeCompletionProps {
  content: CodeCompletionStepContent;
  onNext: () => void;
  isPending: boolean;
}

const ATTEMPTS_BEFORE_REVEAL = 3;

/**
 * Reordenar líneas. La UI muestra las líneas mezcladas (post-mount para
 * evitar hydration mismatch) y el alumno las mueve con ↑/↓ hasta dar con
 * el orden correcto.
 *
 * Comparamos por texto, no por índice, por si el contenido repite alguna
 * línea (aunque idealmente no debería pasar).
 */
export function StepCodeCompletion({
  content,
  onNext,
  isPending,
}: StepCodeCompletionProps) {
  const correctOrder = content.lines;
  const [items, setItems] = React.useState<string[]>(() => [...correctOrder]);
  const [submitted, setSubmitted] = React.useState(false);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    // Shuffle inicial post-mount (Math.random no es SSR-safe). Si por
    // casualidad sale igual al correcto, forzamos un swap para que el
    // alumno tenga algo que ordenar.
    const next = [...correctOrder];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    if (
      next.length > 1 &&
      next.every((line, idx) => line === correctOrder[idx])
    ) {
      [next[0], next[next.length - 1]] = [next[next.length - 1], next[0]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount shuffle intencional
    setItems(next);
  }, [correctOrder]);

  const isCorrect = items.every((line, idx) => line === correctOrder[idx]);
  const canProceed = isCorrect || revealed;
  const canReveal =
    failedAttempts >= ATTEMPTS_BEFORE_REVEAL && !isCorrect && !revealed;

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function verify() {
    setSubmitted(true);
    if (!isCorrect) setFailedAttempts((n) => n + 1);
  }

  function tryAgain() {
    setSubmitted(false);
  }

  function revealAnswer() {
    setItems([...correctOrder]);
    setRevealed(true);
    setSubmitted(true);
    toast.info("Te dejamos el orden correcto.");
  }

  return (
    <article className="space-y-7">
      <StepHeader label="Reordena el código">
        {content.prompt ? (
          <div className="prose-instructions text-balance text-foreground">
            <Markdown>{content.prompt}</Markdown>
          </div>
        ) : (
          <h2 className="text-balance text-[20px] font-semibold leading-snug">
            Acomoda las líneas en el orden correcto.
          </h2>
        )}
      </StepHeader>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-terminal">
        <div className="flex items-center justify-between border-b border-[var(--terminal-border)] bg-terminal-elevated px-4 py-2 text-[11px] text-terminal-muted">
          <span className="flex items-center gap-2 font-mono">
            <span className="flex gap-1" aria-hidden>
              <span className="size-2 rounded-[1px] bg-terminal-danger/80" />
              <span className="size-2 rounded-[1px] bg-terminal-warning/80" />
              <span className="size-2 rounded-[1px] bg-terminal-success/80" />
            </span>
            main.cpp
          </span>
          <span className="font-mono uppercase tracking-[0.1em]">orden</span>
        </div>
        <ol className="font-mono text-[13px] leading-[1.7] text-terminal-fg">
          {items.map((line, idx) => {
            const correct = submitted && line === correctOrder[idx];
            const wrong = submitted && line !== correctOrder[idx];
            return (
              <li
                key={`${line}-${idx}`}
                className={cn(
                  "grid grid-cols-[3.25rem_1fr_auto] items-center gap-2 border-b border-[var(--terminal-border)]/40 px-2 py-1 last:border-b-0",
                  wrong && "bg-destructive/10",
                  correct && "bg-success/10",
                )}
              >
                <span className="select-none text-right font-mono text-terminal-faint tabular-nums">
                  {idx + 1}
                </span>
                <span className="overflow-x-auto whitespace-pre">
                  {renderTokens(tokenizeCpp(line), `l${idx}`)}
                </span>
                {!submitted ? (
                  <span className="flex items-center gap-1 pr-2">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Subir línea ${idx + 1}`}
                      className="grid size-8 place-items-center rounded-[1px] text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-fg disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === items.length - 1}
                      aria-label={`Bajar línea ${idx + 1}`}
                      className="grid size-8 place-items-center rounded-[1px] text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-fg disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" aria-hidden />
                    </button>
                  </span>
                ) : (
                  <span className="pr-3">
                    {correct ? (
                      <CheckCircle2
                        className="size-4 text-terminal-success"
                        aria-hidden
                      />
                    ) : wrong ? (
                      <XCircle className="size-4 text-terminal-danger" aria-hidden />
                    ) : null}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {submitted ? (
        <Verdict
          className="animate-fade-up"
          tone={isCorrect ? "correct" : revealed ? "neutral" : "wrong"}
          icon={
            isCorrect ? (
              <CheckCircle2 className="size-3.5" aria-hidden />
            ) : revealed ? (
              <Eye className="size-3.5" aria-hidden />
            ) : (
              <XCircle className="size-3.5" aria-hidden />
            )
          }
          title={
            isCorrect
              ? "Orden correcto"
              : revealed
                ? "Orden revelado"
                : "Algunas líneas siguen fuera de lugar"
          }
        >
          {content.explanation ?? null}
        </Verdict>
      ) : null}

      <StepActions
        leading={
          canReveal ? (
            <Button onClick={revealAnswer} variant="ghost" size="sm">
              <Eye />
              Ver orden correcto
            </Button>
          ) : null
        }
      >
        {!submitted ? (
          <Button onClick={verify} size="lg">
            Verificar orden
          </Button>
        ) : canProceed ? (
          <Button onClick={onNext} loading={isPending} size="lg">
            Continuar
            <ArrowRight />
          </Button>
        ) : (
          <Button onClick={tryAgain} variant="outline" size="lg">
            <RotateCcw />
            Seguir intentando
          </Button>
        )}
      </StepActions>
    </article>
  );
}
