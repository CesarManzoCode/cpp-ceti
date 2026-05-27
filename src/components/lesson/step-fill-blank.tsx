"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/markdown";
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
    <div className="space-y-6">
      <p className="text-sm font-medium uppercase tracking-wider text-primary">
        Completa el código
      </p>

      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border bg-zinc-950 p-5 font-mono text-sm leading-relaxed text-zinc-100">
        {parts}
      </pre>

      {content.blanks.some((b) => b.hint) ? (
        <div className="flex flex-wrap gap-2">
          {content.blanks.map((blank, idx) =>
            blank.hint ? (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(showHint === idx ? null : idx)}
              >
                <Lightbulb className="size-3.5" />
                Pista {idx + 1}
              </Button>
            ) : null,
          )}
        </div>
      ) : null}

      {showHint !== null && content.blanks[showHint]?.hint ? (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          <strong className="text-warning-foreground">Pista:</strong>{" "}
          {content.blanks[showHint].hint}
        </div>
      ) : null}

      {submitted && !allCorrect ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          Algunas respuestas no son correctas. Revisa los campos en rojo.
        </div>
      ) : null}

      {submitted && allCorrect ? (
        <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-success">
          <CheckCircle2 className="size-4" />
          ¡Perfecto! Eso es justo lo que faltaba.
          {content.explanation ? (
            <span className="text-foreground/80"> — {content.explanation}</span>
          ) : null}
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        {!submitted || !allCorrect ? (
          <Button
            onClick={() => setSubmitted(true)}
            disabled={values.some((v) => !v.trim())}
            size="lg"
          >
            Verificar
          </Button>
        ) : (
          <Button onClick={onNext} disabled={isPending} size="lg">
            Continuar
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
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
    parts.push(
      <input
        key={`b-${blankIdx}`}
        value={value}
        onChange={(e) => {
          const next = [...values];
          next[blankIdx] = e.target.value;
          setValues(next);
        }}
        disabled={submitted && value.trim() === expected.trim()}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        className={cn(
          "mx-1 inline-block min-w-20 rounded border-b-2 bg-transparent px-1 font-mono text-sm text-cyan-300 outline-none transition-colors",
          isWrong
            ? "border-destructive text-destructive"
            : submitted && !isWrong
              ? "border-success text-success"
              : "border-zinc-500 focus:border-cyan-300",
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
