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
import { DIFFICULTY_META } from "@/lib/difficulty";
import { cn } from "@/lib/utils";
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

export function PracticeViewer({ exercise }: PracticeViewerProps) {
  // Si ya tiene un intento guardado, lo cargamos. Si no, el starter.
  const [code, setCode] = React.useState(
    exercise.bestAttemptCode ?? exercise.starterCode,
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [submission, setSubmission] = React.useState<{
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
    xpEarned: number;
    firstPass: boolean;
  } | null>(null);

  const playground = useRunCode();
  const running = playground.state === "running";

  function handleRun() {
    setSubmission(null);
    playground.run(code);
  }

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
    // Dos pasos: el primer clic arma la confirmación para no borrar trabajo por error.
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setConfirmReset(false);
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
              <p className="eyebrow text-muted-foreground">
                {exercise.unitTitle}
              </p>
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {exercise.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={DIFFICULTY_META[exercise.difficulty].variant}
              size="md"
            >
              {DIFFICULTY_META[exercise.difficulty].label}
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

      <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        {/* Enunciado — siempre primero */}
        <section className="space-y-4">
          <Markdown>{exercise.prompt}</Markdown>
        </section>

        {/* Editor + acciones — bajo el enunciado en móvil; col. derecha en desktop */}
        <section className="space-y-3 lg:col-start-2 lg:row-span-2">
          <CppEditor
            value={code}
            onChange={setCode}
            onRun={handleRun}
            minHeight={420}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRun}
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
              Enviar
            </Button>
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={submitting}
              className={cn(
                "ml-auto h-11 sm:h-9",
                confirmReset ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <RotateCcw />
              {confirmReset ? "¿Reiniciar?" : "Reiniciar"}
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

        {/* Referencia — ejemplos y pistas: bajo el editor en móvil, izquierda en desktop */}
        <section className="space-y-5 lg:col-start-1">
          <ExampleTests tests={exercise.visibleTests} />
          <HintsPanel hints={exercise.hints} />
        </section>
      </article>
    </div>
  );
}
