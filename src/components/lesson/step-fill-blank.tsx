"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FillBlankStepContent } from "@/types/lesson";

interface StepFillBlankProps {
  content: FillBlankStepContent;
  onNext: () => void;
  isPending: boolean;
}

export function StepFillBlank({
  content,
  onNext,
  isPending,
}: StepFillBlankProps) {
  const [values, setValues] = React.useState<string[]>(
    () => content.blanks.map(() => ""),
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [showHint, setShowHint] = React.useState<number | null>(null);

  const allCorrect = content.blanks.every(
    (b, i) => values[i]?.trim() === b.answer.trim(),
  );

  // Renderiza el template intercalando inputs en los placeholders {{0}}, {{1}}...
  const parts = renderTemplate(content.template, values, setValues, submitted, content);

  return (
    <article className="space-y-7">
      <header className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Completa el código
        </p>
        <h3 className="text-balance text-xl font-semibold tracking-tight">
          Llena los espacios para que el programa compile.
        </h3>
      </header>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)]">
        <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-4 py-2 text-[11px] text-zinc-400">
          <span className="font-mono">main.cpp</span>
          <span className="font-mono uppercase tracking-wider">edición</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-[13px] leading-relaxed text-zinc-100">
          {parts}
        </pre>
      </div>

      {content.blanks.some((b) => b.hint) ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">¿Atorado?</span>
          {content.blanks.map((blank, idx) =>
            blank.hint ? (
              <Button
                key={idx}
                variant="ghost"
                size="xs"
                onClick={() => setShowHint(showHint === idx ? null : idx)}
              >
                <Lightbulb className="text-warning" />
                Pista {idx + 1}
              </Button>
            ) : null,
          )}
        </div>
      ) : null}

      {showHint !== null && content.blanks[showHint]?.hint ? (
        <div className="rounded-[var(--radius-md)] border border-warning/40 bg-warning-soft p-3 text-sm">
          <strong className="font-semibold text-warning-foreground">Pista:</strong>{" "}
          <span className="text-foreground/90">
            {content.blanks[showHint].hint}
          </span>
        </div>
      ) : null}

      {submitted && !allCorrect ? (
        <div className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">
          Algunas respuestas no son correctas. Revisa los campos marcados.
        </div>
      ) : null}

      {submitted && allCorrect ? (
        <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-success/30 bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            ¡Perfecto! Eso es justo lo que faltaba.
            {content.explanation ? (
              <span className="text-foreground/85"> — {content.explanation}</span>
            ) : null}
          </span>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 border-t border-border/70 pt-6">
        {!submitted || !allCorrect ? (
          <>
            {submitted && !allCorrect ? (
              <Button
                onClick={() => setSubmitted(false)}
                variant="ghost"
                size="lg"
              >
                <RotateCcw />
                Limpiar
              </Button>
            ) : null}
            <Button
              onClick={() => setSubmitted(true)}
              disabled={values.some((v) => !v.trim())}
              size="lg"
            >
              Verificar
            </Button>
          </>
        ) : (
          <Button onClick={onNext} loading={isPending} size="lg">
            Continuar
            <ArrowRight />
          </Button>
        )}
      </div>
    </article>
  );
}

function renderTemplate(
  template: string,
  values: string[],
  setValues: React.Dispatch<React.SetStateAction<string[]>>,
  submitted: boolean,
  content: FillBlankStepContent,
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\{\{(\d+)\}\}/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIdx) {
      parts.push(
        <span key={`t-${key++}`}>{template.slice(lastIdx, match.index)}</span>,
      );
    }
    const blankIdx = Number(match[1]);
    const value = values[blankIdx] ?? "";
    const expected = content.blanks[blankIdx]?.answer ?? "";
    const isWrong = submitted && value.trim() !== expected.trim();
    const isRight = submitted && !isWrong;
    parts.push(
      <input
        key={`b-${blankIdx}`}
        value={value}
        onChange={(e) => {
          const next = [...values];
          next[blankIdx] = e.target.value;
          setValues(next);
        }}
        disabled={isRight}
        aria-invalid={isWrong || undefined}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        className={cn(
          "mx-1 inline-block min-w-20 rounded-md border-b-2 bg-transparent px-1.5 font-mono text-[13px] outline-none transition-colors",
          isWrong
            ? "border-destructive text-destructive"
            : isRight
              ? "border-success text-success"
              : "border-zinc-500 text-cyan-300 focus:border-cyan-300",
        )}
        style={{ width: `${Math.max(value.length, expected.length, 4) + 1}ch` }}
      />,
    );
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < template.length) {
    parts.push(<span key={`t-${key++}`}>{template.slice(lastIdx)}</span>);
  }
  return parts;
}
