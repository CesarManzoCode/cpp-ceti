"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  Play,
  RotateCcw,
  Send,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CppEditor } from "@/components/editor/cpp-editor";
import { Markdown } from "@/components/markdown";
import { ExampleTests } from "@/components/exercise/example-tests";
import { HintsPanel } from "@/components/exercise/hints-panel";
import { RunOutput } from "@/components/exercise/run-output";
import { SubmissionResults } from "@/components/exercise/submission-results";
import { useRunCode } from "@/hooks/use-run-code";
import { submitPracticeExercise } from "@/lib/practice-actions";
import type { TestCaseResult } from "@/lib/executor";

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

      <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Columna izquierda — enunciado */}
        <section className="space-y-5">
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
    </div>
  );
}
