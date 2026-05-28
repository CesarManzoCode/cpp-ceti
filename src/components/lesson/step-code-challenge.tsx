"use client";

import * as React from "react";
import { ArrowRight, Play, Send, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { CppEditor } from "@/components/editor/cpp-editor";
import { ExampleTests } from "@/components/exercise/example-tests";
import { HintsPanel } from "@/components/exercise/hints-panel";
import { RunOutput } from "@/components/exercise/run-output";
import { SubmissionResults } from "@/components/exercise/submission-results";
import { useRunCode } from "@/hooks/use-run-code";
import { submitExercise } from "@/lib/lessons-actions";
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

  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Columna izquierda — enunciado */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <span className="text-primary">
            Reto · {difficultyLabel[exercise.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1 text-warning-foreground">
            <Zap className="size-3 text-warning" aria-hidden />
            +{exercise.xpReward} XP
          </span>
        </div>

        <Markdown>{exercise.prompt}</Markdown>

        <ExampleTests tests={exercise.visibleTests} />
        <HintsPanel hints={exercise.hints} />
      </section>

      {/* Columna derecha — editor + tests */}
      <section className="space-y-3">
        <CppEditor
          value={code}
          onChange={setCode}
          onRun={() => playground.run(code)}
          minHeight={380}
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

        {submission ? (
          <SubmissionResults
            submission={submission}
            onTryAgain={() => setSubmission(null)}
          />
        ) : (
          <RunOutput
            state={playground.state}
            result={playground.result}
            error={playground.error}
          />
        )}
      </section>
    </article>
  );
}
