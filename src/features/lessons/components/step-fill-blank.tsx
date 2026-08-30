"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Eye, Lightbulb, Pencil, SquarePen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/shared/markdown";
import { StepActions, StepHeader, Verdict } from "@/features/lessons/components/step-shell";
import { cn } from "@/lib/utils";
import type { FillBlankStepContent } from "@/features/lessons/types";
import { isBlankCorrect } from "@/features/lessons/lib/cpp-validation";
import { renderTokens, tokenizeCpp } from "@/features/lessons/lib/cpp-syntax";

import type { StepSignalHandler } from "./step-signal";

interface StepFillBlankProps {
  content: FillBlankStepContent;
  onNext: () => void;
  isPending: boolean;
  onSignal?: StepSignalHandler;
}

const ATTEMPTS_BEFORE_SOLUTION = 3;

export function StepFillBlank({
  content,
  onNext,
  isPending,
  onSignal,
}: StepFillBlankProps) {
  const [values, setValues] = React.useState<string[]>(
    () => content.blanks.map(() => ""),
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [showHint, setShowHint] = React.useState<number | null>(null);
  const [feedbackKey, setFeedbackKey] = React.useState(0);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [solutionRevealed, setSolutionRevealed] = React.useState(false);

  const allCorrect = content.blanks.every((b, i) =>
    isBlankCorrect(b, values[i] ?? "", values),
  );

  function verify() {
    setSubmitted(true);
    setFeedbackKey((k) => k + 1);
    if (!allCorrect) {
      setFailedAttempts((n) => n + 1);
    }
    onSignal?.({ kind: "attempt", correct: allCorrect });
  }

  function revealSolution() {
    setValues(content.blanks.map((b) => b.answer));
    setSolutionRevealed(true);
    setSubmitted(true);
    setFeedbackKey((k) => k + 1);
    onSignal?.({ kind: "reveal", failedAttempts });
    toast.info("Te dejamos las respuestas. Léelas y entiende el porqué.");
  }

  const canShowSolution =
    failedAttempts >= ATTEMPTS_BEFORE_SOLUTION && !allCorrect && !solutionRevealed;

  const lines = renderTemplateLines(
    content.template,
    values,
    setValues,
    submitted,
    content,
  );

  return (
    <article className="space-y-7">
      <StepHeader label="Completa el código" icon={<SquarePen aria-hidden />} tone="warning">
        {content.prompt ? (
          <div className="prose-instructions text-balance text-foreground">
            <Markdown>{content.prompt}</Markdown>
          </div>
        ) : (
          <h2 className="text-balance text-[21px] font-extrabold leading-snug tracking-[-0.022em] sm:text-[24px]">
            Llena los espacios para que el programa compile.
          </h2>
        )}
      </StepHeader>

      <div
        key={feedbackKey}
        className={cn(
          "overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-terminal",
          submitted && !allCorrect && "animate-shake",
          submitted && allCorrect && "animate-correct",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--terminal-border)] px-4 py-2.5 text-[12px] font-semibold text-terminal-muted">
          <span className="font-mono">main.cpp</span>
          <span>Completa los huecos</span>
        </div>
        <div className="overflow-x-auto py-4 font-mono text-[13.5px] leading-[1.9] text-terminal-fg sm:text-[14px]">
          {lines.map((nodes, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[3.25rem_1fr] hover:bg-terminal-elevated/50"
            >
              <span className="select-none border-r border-[var(--terminal-border)] pr-3 text-right font-mono text-terminal-faint tabular-nums">
                {idx + 1}
              </span>
              <div className="whitespace-pre pl-4">
                {nodes.length === 0 ? " " : nodes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {content.blanks.some((b) => b.hint) ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-muted-foreground">
            ¿Atorado?
          </span>
          {content.blanks.map((blank, idx) =>
            blank.hint ? (
              <Button
                key={idx}
                variant="outline"
                size="sm"
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
        <Verdict tone="hint" title={`Pista ${showHint + 1}`}>
          {content.blanks[showHint].hint}
        </Verdict>
      ) : null}

      {submitted && !allCorrect ? (
        <Verdict tone="wrong" title="Todavía no compila">
          Algunas respuestas no son correctas. Revisa los campos marcados en
          rojo.
        </Verdict>
      ) : null}

      {submitted && allCorrect ? (
        <Verdict
          tone="correct"
          title="Correcto"
          icon={<CheckCircle2 className="size-3.5" aria-hidden />}
        >
          Eso es justo lo que faltaba.
          {content.explanation ? <> {content.explanation}</> : null}
        </Verdict>
      ) : null}

      <StepActions
        leading={
          canShowSolution ? (
            <Button onClick={revealSolution} variant="ghost" size="sm">
              <Eye />
              Ver solución
            </Button>
          ) : null
        }
      >
        {!submitted || !allCorrect ? (
          <>
            {submitted && !allCorrect ? (
              <Button
                onClick={() => setSubmitted(false)}
                variant="ghost"
                size="lg"
              >
                <Pencil />
                Corregir
              </Button>
            ) : null}
            <Button
              onClick={verify}
              disabled={values.some((v) => !v.trim())}
              size="lg"
            >
              Verificar código
            </Button>
          </>
        ) : (
          <Button onClick={onNext} loading={isPending} size="lg">
            Continuar
            <ArrowRight />
          </Button>
        )}
      </StepActions>
    </article>
  );
}

// =====================================================================
// Template renderer — convierte `cout << "Hola" {{0}} endl;\n...` en
// líneas de JSX con los textos tokenizados (C++ highlighting) y los
// inputs de cada blank insertados en su lugar.
// =====================================================================

type Segment =
  | { type: "text"; text: string }
  | { type: "newline" }
  | { type: "input"; idx: number };

function parseTemplate(template: string): Segment[] {
  const segments: Segment[] = [];
  const re = /\{\{(\d+)\}\}|\n/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    if (match.index > lastIdx) {
      segments.push({
        type: "text",
        text: template.slice(lastIdx, match.index),
      });
    }
    if (match[0] === "\n") {
      segments.push({ type: "newline" });
    } else {
      segments.push({ type: "input", idx: Number(match[1]) });
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < template.length) {
    segments.push({ type: "text", text: template.slice(lastIdx) });
  }
  return segments;
}

function renderTemplateLines(
  template: string,
  values: string[],
  setValues: React.Dispatch<React.SetStateAction<string[]>>,
  submitted: boolean,
  content: FillBlankStepContent,
): React.ReactNode[][] {
  const segments = parseTemplate(template);
  const lines: React.ReactNode[][] = [[]];
  let textKey = 0;

  for (const seg of segments) {
    if (seg.type === "newline") {
      lines.push([]);
      continue;
    }
    if (seg.type === "text") {
      const tokens = tokenizeCpp(seg.text);
      const rendered = renderTokens(tokens, `t${textKey++}`);
      lines[lines.length - 1].push(...rendered);
      continue;
    }
    // input
    const blankIdx = seg.idx;
    const value = values[blankIdx] ?? "";
    const blank = content.blanks[blankIdx];
    const expected = blank?.answer ?? "";
    const isWrong =
      submitted && !(blank && isBlankCorrect(blank, value, values));
    const isRight = submitted && !isWrong;
    lines[lines.length - 1].push(
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
        aria-label={`Espacio ${blankIdx + 1}`}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        className={cn(
          // 16px en móvil evita el auto-zoom de iOS Safari al enfocar el input.
          "mx-[2px] inline-block min-w-16 rounded-[1px] border px-1.5 py-[1px] align-baseline font-mono text-[16px] outline-none transition-colors sm:text-[13px]",
          isWrong
            ? "border-destructive/70 bg-destructive/15 text-destructive"
            : isRight
              ? "border-success/70 bg-success/15 text-success"
              : "border-terminal-faint bg-terminal-elevated text-syntax-type focus:border-syntax-type focus:ring-2 focus:ring-syntax-type/30",
        )}
        style={{
          width: `${Math.max(value.length, expected.length, 6) + 1}ch`,
        }}
      />,
    );
  }
  return lines;
}
