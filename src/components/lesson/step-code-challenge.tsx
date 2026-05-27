"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Play,
  Send,
  XCircle,
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
        toast.success("¡Ejercicio resuelto! +" + exercise.xpReward + " XP");
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
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Columna izquierda: enunciado */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="default">Reto · {exercise.difficulty}</Badge>
          <Badge variant="warning">+{exercise.xpReward} XP</Badge>
        </div>

        <Markdown>{exercise.prompt}</Markdown>

        {exercise.visibleTests.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Ejemplos
            </h4>
            <div className="space-y-2">
              {exercise.visibleTests.map((t, idx) => (
                <div
                  key={t.id}
                  className="rounded-xl border bg-card p-4 text-sm"
                >
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    Ejemplo {idx + 1}
                    {t.description ? ` · ${t.description}` : ""}
                  </p>
                  {t.stdin ? (
                    <>
                      <p className="text-xs text-muted-foreground">Entrada:</p>
                      <pre className="my-1 rounded bg-muted p-2 font-mono text-xs">
                        {t.stdin}
                      </pre>
                    </>
                  ) : null}
                  <p className="text-xs text-muted-foreground">Salida esperada:</p>
                  <pre className="my-1 rounded bg-muted p-2 font-mono text-xs">
                    {t.expectedStdout}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {exercise.hints.length > 0 ? (
          <div className="space-y-2 rounded-xl border border-warning/40 bg-warning/10 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="size-4 text-warning" />
                Pistas {hintsShown}/{exercise.hints.length}
              </p>
              {hintsShown < exercise.hints.length ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setHintsShown(hintsShown + 1)}
                >
                  Ver pista
                </Button>
              ) : null}
            </div>
            {hintsShown > 0 ? (
              <ul className="space-y-2 text-sm text-foreground/80">
                {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                  <li key={i} className="border-l-2 border-warning/60 pl-3">
                    {hint}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Columna derecha: editor + tests */}
      <div className="space-y-3">
        <CppEditor
          value={code}
          onChange={setCode}
          onRun={() => playground.run(code)}
          minHeight={360}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => playground.run(code)}
            disabled={playground.state === "running" || submitting}
          >
            {playground.state === "running" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
            Probar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || playground.state === "running"}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Enviar solución
          </Button>
          {submission?.passed ? (
            <Button
              onClick={onNext}
              disabled={isPending}
              variant="success"
              className="ml-auto"
            >
              Siguiente
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>

        {/* Output del "Probar" */}
        {playground.state !== "idle" && !submission ? (
          <div className="rounded-xl border bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
            {playground.state === "running" ? (
              <p className="text-zinc-400">Ejecutando…</p>
            ) : null}
            {playground.error ? (
              <p className="text-red-400">{playground.error}</p>
            ) : null}
            {playground.result ? (
              <div className="space-y-2">
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
                <p className="text-xs text-zinc-500">
                  {playground.result.message} · {playground.result.durationMs}ms
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Resultados de los tests */}
        {submission ? (
          <SubmissionResults
            submission={submission}
            onTryAgain={handleTryAgain}
          />
        ) : null}
      </div>
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
        "rounded-xl border p-4",
        submission.passed
          ? "border-success/40 bg-success/10"
          : "border-amber-500/40 bg-amber-500/10",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p
          className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            submission.passed ? "text-success" : "text-amber-600 dark:text-amber-400",
          )}
        >
          {submission.passed ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertTriangle className="size-4" />
          )}
          {submission.feedback}
        </p>
        <span className="font-mono text-xs">
          {passedCount}/{submission.results.length} tests
        </span>
      </div>

      <ul className="space-y-2">
        {submission.results.map((r, idx) => (
          <li
            key={r.testId}
            className={cn(
              "rounded-lg border bg-card p-3 text-xs",
              !r.passed && "border-destructive/30",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                {r.passed ? (
                  <CheckCircle2 className="size-3.5 text-success" />
                ) : (
                  <XCircle className="size-3.5 text-destructive" />
                )}
                Test {idx + 1}
                {!r.visible ? (
                  <Badge variant="secondary" className="text-[10px]">
                    Oculto
                  </Badge>
                ) : null}
              </span>
              <span className="font-mono text-muted-foreground">
                {r.durationMs}ms
              </span>
            </div>

            {!r.passed && r.visible ? (
              <div className="mt-2 space-y-1.5">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Esperado</p>
                  <pre className="rounded bg-zinc-950 p-2 font-mono text-[11px] text-zinc-100">
                    {r.expectedStdout || "(vacío)"}
                  </pre>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Tu salida</p>
                  <pre className="rounded bg-zinc-950 p-2 font-mono text-[11px] text-zinc-100">
                    {r.actualStdout || "(vacío)"}
                  </pre>
                </div>
                {r.stderr ? (
                  <pre className="rounded bg-destructive/10 p-2 font-mono text-[11px] text-destructive">
                    {r.stderr}
                  </pre>
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
