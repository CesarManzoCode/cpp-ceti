"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CppEditor } from "@/components/editor/cpp-editor";
import { Markdown } from "@/components/markdown";
import { useRunCode } from "@/hooks/use-run-code";
import { submitPracticeExercise } from "@/lib/practice-actions";
import type { TestCaseResult } from "@/lib/executor";
import { cn } from "@/lib/utils";

interface VisibleTest {
  id: string;
  stdin: string;
  expectedStdout: string;
  description: string | null;
}

interface PracticeViewerProps {
  exercise: {
    id: string;
    slug: string;
    unitTitle: string | null;
    title: string;
    prompt: string;
    starterCode: string;
    hints: string[];
    difficulty: "easy" | "medium" | "hard";
    xpReward: number;
    visibleTests: VisibleTest[];
    passed: boolean;
    bestAttemptCode: string | null;
  };
}

const difficultyMeta = {
  easy: { label: "Fácil", variant: "success" as const },
  medium: { label: "Intermedio", variant: "info" as const },
  hard: { label: "Difícil", variant: "warning" as const },
};

export function PracticeViewer({ exercise }: PracticeViewerProps) {
  // Si ya tiene un intento guardado, lo cargamos. Si no, el starter.
  const [code, setCode] = React.useState(
    exercise.bestAttemptCode ?? exercise.starterCode,
  );
  const [hintsShown, setHintsShown] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [submission, setSubmission] = React.useState<{
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
    xpEarned: number;
    firstPass: boolean;
  } | null>(null);

  const playground = useRunCode();

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await submitPracticeExercise({
        exerciseId: exercise.id,
        sourceCode: code,
      });
      setSubmission(res);
      if (res.passed) {
        if (res.firstPass) {
          toast.success(`¡Resuelto! +${res.xpEarned} XP`);
        } else {
          toast.success("¡Pasaste los tests!");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falló el envío");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setCode(exercise.starterCode);
    setSubmission(null);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="space-y-3">
        <Button asChild size="sm" variant="ghost" className="-ml-2.5">
          <Link href="/app/ejercicios">
            <ChevronLeft />
            Ejercicios
          </Link>
        </Button>

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="space-y-1">
            {exercise.unitTitle ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {exercise.unitTitle}
              </p>
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {exercise.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={difficultyMeta[exercise.difficulty].variant}
              size="md"
            >
              {difficultyMeta[exercise.difficulty].label}
            </Badge>
            <Badge variant="outline" size="md">
              <Zap className="text-warning" />+{exercise.xpReward} XP
            </Badge>
            {exercise.passed ? (
              <Badge variant="success" size="md">
                <CheckCircle2 />
                Resuelto
              </Badge>
            ) : null}
          </div>
        </div>
      </header>

      <article className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Columna izquierda — enunciado */}
        <section className="space-y-5">
          <Markdown>{exercise.prompt}</Markdown>

          {exercise.visibleTests.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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
                        <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground/80">
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
                      <IOBlock
                        label="Salida esperada"
                        value={t.expectedStdout}
                      />
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
                  <Lightbulb
                    className="size-4 text-warning"
                    aria-hidden
                  />
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

        {/* Columna derecha — editor + tests */}
        <section className="space-y-3">
          <CppEditor
            value={code}
            onChange={setCode}
            onRun={() => playground.run(code)}
            minHeight={420}
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
              Enviar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={submitting}
              className="ml-auto text-muted-foreground"
            >
              <RotateCcw />
              Reiniciar
            </Button>
          </div>

          {playground.state !== "idle" && !submission ? (
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] font-mono text-[12px] text-zinc-100">
              <div className="border-b border-[var(--terminal-border)] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
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
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                      {playground.result.message} ·{" "}
                      {playground.result.durationMs}ms
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          {submission ? (
            <SubmissionResults
              submission={submission}
              onTryAgain={() => setSubmission(null)}
            />
          ) : null}
        </section>
      </article>
    </div>
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
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
  submission: {
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
  };
  onTryAgain: () => void;
}) {
  const passedCount = submission.results.filter((r) => r.passed).length;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border p-4 animate-fade-up",
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
              "overflow-hidden rounded-[var(--radius-sm)] border bg-card text-xs",
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
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Oculto
                  </span>
                ) : null}
              </span>
              <span className="font-mono text-[10.5px] text-muted-foreground">
                {r.durationMs}ms
              </span>
            </div>

            {!r.passed && r.visible ? (
              <div className="grid gap-2 border-t border-border/70 bg-surface-2/40 p-3 sm:grid-cols-2">
                <IOBlock
                  label="Esperado"
                  value={r.expectedStdout || "(vacío)"}
                />
                <IOBlock label="Tu salida" value={r.actualStdout || "(vacío)"} />
                {r.stderr ? (
                  <div className="sm:col-span-2">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive/80">
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
