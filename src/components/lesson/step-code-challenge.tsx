"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Play,
  Send,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { CppEditor } from "@/components/editor/cpp-editor";
import { useRunCode } from "@/hooks/use-run-code";
import { submitExercise } from "@/lib/lessons-actions";
import { cn } from "@/lib/utils";
import type { TestCaseResult } from "@/lib/executor";

interface VisibleTest {
  id: string;
  stdin: string;
  expectedStdout: string;
  description: string | null;
}

interface StepCodeChallengeProps {
  exercise: {
    id: string;
    prompt: string;
    starterCode: string;
    hints: string[];
    difficulty: "easy" | "medium" | "hard";
    xpReward: number;
    visibleTests: VisibleTest[];
  };
  onNext: () => void;
  isPending: boolean;
}

const difficultyLabel = {
  easy: "Fácil",
  medium: "Intermedio",
  hard: "Difícil",
} as const;

export function StepCodeChallenge({
  exercise,
  onNext,
  isPending,
}: StepCodeChallengeProps) {
  const [code, setCode] = React.useState(exercise.starterCode);
  const [hintsShown, setHintsShown] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [submission, setSubmission] = React.useState<{
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
  } | null>(null);

  const playground = useRunCode();

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await submitExercise({
        exerciseId: exercise.id,
        sourceCode: code,
      });
      setSubmission(res);
      if (res.passed) {
        toast.success(`¡Ejercicio resuelto! +${exercise.xpReward} XP`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falló el envío");
    } finally {
      setSubmitting(false);
    }
  }

  function handleTryAgain() {
    setSubmission(null);
  }

  return (
    <article className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      {/* Columna izquierda: enunciado */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info" size="sm">
            <Sparkles className="size-3" aria-hidden />
            Reto · {difficultyLabel[exercise.difficulty]}
          </Badge>
          <Badge variant="warning" size="sm">
            <Zap className="size-3" aria-hidden />
            +{exercise.xpReward} XP
          </Badge>
        </div>

        <Markdown>{exercise.prompt}</Markdown>

        {exercise.visibleTests.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Ejemplos
            </h4>
            <div className="space-y-2">
              {exercise.visibleTests.map((t, idx) => (
                <div
                  key={t.id}
                  className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-card text-sm"
                >
                  <div className="border-b border-border/70 bg-surface-2/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Ejemplo {idx + 1}
                    {t.description ? (
                      <span className="ml-2 font-normal text-muted-foreground/80 normal-case tracking-normal">
                        {t.description}
                      </span>
                    ) : null}
                  </div>
                  <div className="grid gap-3 p-3 sm:grid-cols-2">
                    {t.stdin ? (
                      <IOBlock label="Entrada" value={t.stdin} />
                    ) : (
                      <IOBlock label="Entrada" value="(ninguna)" muted />
                    )}
                    <IOBlock label="Salida esperada" value={t.expectedStdout} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {exercise.hints.length > 0 ? (
          <div className="space-y-2 rounded-[var(--radius-md)] border border-warning/30 bg-warning-soft p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="size-4 text-warning" aria-hidden />
                Pistas
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {hintsShown}/{exercise.hints.length}
                </span>
              </p>
              {hintsShown < exercise.hints.length ? (
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setHintsShown(hintsShown + 1)}
                >
                  Ver pista
                </Button>
              ) : null}
            </div>
            {hintsShown > 0 ? (
              <ul className="space-y-2 text-sm text-foreground/90">
                {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                  <li
                    key={i}
                    className="rounded border-l-2 border-warning/60 bg-card/40 px-3 py-1.5"
                  >
                    {hint}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* Columna derecha: editor + tests */}
      <section className="space-y-3">
        <CppEditor
          value={code}
          onChange={setCode}
          onRun={() => playground.run(code)}
          minHeight={360}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => playground.run(code)}
            disabled={playground.state === "running" || submitting}
            loading={playground.state === "running"}
            size="sm"
          >
            <Play className="fill-current" />
            Probar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || playground.state === "running"}
            loading={submitting}
            size="sm"
          >
            <Send />
            Enviar solución
          </Button>
          {submission?.passed ? (
            <Button
              onClick={onNext}
              loading={isPending}
              variant="success"
              size="sm"
              className="ml-auto"
            >
              Siguiente
              <ArrowRight />
            </Button>
          ) : null}
        </div>

        {/* Output del "Probar" */}
        {playground.state !== "idle" && !submission ? (
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] font-mono text-[12px] text-zinc-100">
            <div className="border-b border-[var(--terminal-border)] px-3 py-1.5 text-[10px] uppercase tracking-wider text-zinc-400">
              Salida
            </div>
            <div className="space-y-2 p-3">
              {playground.state === "running" ? (
                <p className="text-zinc-400">Ejecutando…</p>
              ) : null}
              {playground.error ? (
                <p className="text-red-400">{playground.error}</p>
              ) : null}
              {playground.result ? (
                <>
                  {playground.result.stdout ? (
                    <pre className="whitespace-pre-wrap">
                      {playground.result.stdout}
                    </pre>
                  ) : null}
                  {playground.result.compileOutput ? (
                    <pre className="whitespace-pre-wrap text-amber-300">
                      {playground.result.compileOutput}
                    </pre>
                  ) : null}
                  {playground.result.stderr ? (
                    <pre className="whitespace-pre-wrap text-red-300">
                      {playground.result.stderr}
                    </pre>
                  ) : null}
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    {playground.result.message} · {playground.result.durationMs}ms
                  </p>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Resultados de los tests */}
        {submission ? (
          <SubmissionResults
            submission={submission}
            onTryAgain={handleTryAgain}
          />
        ) : null}
      </section>
    </article>
  );
}

function IOBlock({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <pre
        className={cn(
          "rounded-md bg-surface-2 px-2.5 py-1.5 font-mono text-[11.5px] leading-relaxed",
          muted && "text-muted-foreground/70",
        )}
      >
        {value}
      </pre>
    </div>
  );
}

function SubmissionResults({
  submission,
  onTryAgain,
}: {
  submission: { passed: boolean; results: TestCaseResult[]; feedback: string };
  onTryAgain: () => void;
}) {
  const passedCount = submission.results.filter((r) => r.passed).length;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border p-4 animate-fade-up",
        submission.passed
          ? "border-success/30 bg-success-soft animate-correct"
          : "border-warning/40 bg-warning-soft animate-shake",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p
          className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            submission.passed ? "text-success" : "text-warning-foreground",
          )}
        >
          {submission.passed ? (
            <CheckCircle2 className="size-4" aria-hidden />
          ) : (
            <AlertTriangle className="size-4" aria-hidden />
          )}
          {submission.feedback}
        </p>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {passedCount}/{submission.results.length} tests
        </span>
      </div>

      <ul className="space-y-2">
        {submission.results.map((r, idx) => (
          <li
            key={r.testId}
            className={cn(
              "overflow-hidden rounded-[var(--radius-md)] border bg-card text-xs",
              r.passed ? "border-border" : "border-destructive/40",
            )}
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="inline-flex items-center gap-2 font-medium">
                {r.passed ? (
                  <CheckCircle2
                    className="size-3.5 text-success"
                    aria-hidden
                  />
                ) : (
                  <XCircle
                    className="size-3.5 text-destructive"
                    aria-hidden
                  />
                )}
                Test {idx + 1}
                {!r.visible ? (
                  <Badge variant="secondary" size="sm">
                    Oculto
                  </Badge>
                ) : null}
              </span>
              <span className="font-mono text-[10.5px] text-muted-foreground">
                {r.durationMs}ms
              </span>
            </div>

            {!r.passed && r.visible ? (
              <div className="grid gap-2 border-t border-border/70 bg-surface-2/40 p-3 sm:grid-cols-2">
                <IOBlock label="Esperado" value={r.expectedStdout || "(vacío)"} />
                <IOBlock label="Tu salida" value={r.actualStdout || "(vacío)"} />
                {r.stderr ? (
                  <div className="sm:col-span-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-destructive/80">
                      stderr
                    </p>
                    <pre className="rounded-md bg-destructive-soft px-2.5 py-1.5 font-mono text-[11.5px] text-destructive">
                      {r.stderr}
                    </pre>
                  </div>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {!submission.passed ? (
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="ghost" onClick={onTryAgain}>
            Intentar de nuevo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
