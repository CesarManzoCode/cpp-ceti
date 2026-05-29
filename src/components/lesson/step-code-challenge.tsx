"use client";

import * as React from "react";
import { ArrowRight, Play, Send, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { CppEditor } from "@/components/editor/cpp-editor";
import { ExampleTests } from "@/components/exercise/example-tests";
import { HintsPanel } from "@/components/exercise/hints-panel";
import { RunOutput } from "@/components/exercise/run-output";
import { SubmissionResults } from "@/components/exercise/submission-results";
import { useRunCode } from "@/hooks/use-run-code";
import { submitExercise } from "@/lib/lessons-actions";
import { DIFFICULTY_META } from "@/lib/difficulty";
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
  const [submitting, setSubmitting] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const [submission, setSubmission] = React.useState<{
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
  } | null>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const playground = useRunCode();

  // Lleva la mirada al veredicto en cada intento (también si vuelve a fallar).
  React.useEffect(() => {
    if (attempt > 0) {
      resultRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [attempt]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await submitExercise({
        exerciseId: exercise.id,
        sourceCode: code,
      });
      setSubmission(res);
      setAttempt((a) => a + 1);
      if (res.passed) {
        toast.success(`¡Ejercicio resuelto! +${exercise.xpReward} XP`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falló el envío");
    } finally {
      setSubmitting(false);
    }
  }

  const running = playground.state === "running";

  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
      {/* Enunciado — siempre primero (móvil y desktop col. izquierda) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant={DIFFICULTY_META[exercise.difficulty].variant} size="sm">
            {DIFFICULTY_META[exercise.difficulty].label}
          </Badge>
          <span className="eyebrow inline-flex items-center gap-1 text-warning">
            <Zap className="size-3" aria-hidden />
            +{exercise.xpReward} XP
          </span>
        </div>

        <Markdown>{exercise.prompt}</Markdown>
      </section>

      {/* Editor + acciones — en móvil va justo bajo el enunciado; en desktop, col. derecha */}
      <section className="space-y-3 lg:col-start-2 lg:row-span-2">
        <CppEditor
          value={code}
          onChange={setCode}
          onRun={() => playground.run(code)}
          minHeight={380}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSubmission(null);
                playground.run(code);
              }}
              disabled={running || submitting}
              loading={running}
              className="h-11 flex-1 sm:h-9 sm:flex-none"
            >
              <Play className="fill-current" />
              Probar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || running}
              loading={submitting}
              className="h-11 flex-1 sm:h-9 sm:flex-none"
            >
              <Send />
              Enviar solución
            </Button>
          </div>
          {submission?.passed ? (
            <Button
              onClick={onNext}
              loading={isPending}
              variant="success"
              className="h-11 w-full sm:h-9 sm:w-auto"
            >
              Siguiente
              <ArrowRight />
            </Button>
          ) : null}
        </div>

        <div ref={resultRef}>
          {submission ? (
            <SubmissionResults
              key={attempt}
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
        </div>
      </section>

      {/* Referencia — ejemplos y pistas: bajo el editor en móvil, col. izquierda en desktop */}
      <section className="space-y-5 lg:col-start-1">
        <ExampleTests tests={exercise.visibleTests} />
        <HintsPanel hints={exercise.hints} />
      </section>
    </article>
  );
}
