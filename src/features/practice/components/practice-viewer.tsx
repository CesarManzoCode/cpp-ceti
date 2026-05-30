"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
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
import {
  diagnosticsFromExecution,
  diagnosticsFromSubmission,
} from "@/components/editor/diagnostics";
import { useCodeDraft } from "@/components/editor/use-code-draft";
import { Markdown } from "@/components/shared/markdown";
import { ExampleTests } from "@/components/exercise/example-tests";
import { HintsPanel } from "@/components/exercise/hints-panel";
import { RunOutput } from "@/components/exercise/run-output";
import { SubmissionResults } from "@/components/exercise/submission-results";
import type {
  SubmissionState,
  VisibleTest,
} from "@/components/exercise/types";
import { ReportBugDialog } from "@/features/bug-reports/components/report-bug-dialog";
import { useRunCode } from "@/hooks/use-run-code";
import { submitPracticeExercise } from "@/features/practice/actions";
import { DIFFICULTY_META } from "@/lib/difficulty";
import { cn } from "@/lib/utils";

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
  // Borrador local + mejor intento del servidor + fallback al starter.
  const [code, setCode, resetCode] = useCodeDraft({
    key: exercise.id,
    fallback: exercise.starterCode,
    serverBest: exercise.bestAttemptCode,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [submission, setSubmission] = React.useState<
    | (SubmissionState & { xpEarned: number; firstPass: boolean })
    | null
  >(null);

  const playground = useRunCode();
  const running = playground.state === "running";

  const diagnostics = React.useMemo(() => {
    if (submission && !submission.passed) {
      return diagnosticsFromSubmission(submission.results);
    }
    return diagnosticsFromExecution(playground.result);
  }, [submission, playground.result]);

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
    resetCode();
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
            <ReportBugDialog
              target={{
                kind: "practice",
                practiceExerciseId: exercise.id,
              }}
            />
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
            diagnostics={diagnostics}
            ariaLabel={`Editor de práctica: ${exercise.title}. Ctrl+Enter para ejecutar.`}
          />

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRun}
              disabled={running || submitting}
              loading={running}
              className="h-11 flex-1 sm:h-9 sm:flex-none"
            >
              <Play className="fill-current" />
              Probar
            </Button>
            <Button
              variant="outline"
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

          {diagnostics.length > 0 ? (
            <p
              className="flex items-center gap-1.5 text-xs text-destructive"
              role="status"
            >
              <AlertTriangle className="size-3 shrink-0" aria-hidden />
              {diagnostics.length === 1
                ? "1 error de compilación marcado en el editor"
                : `${diagnostics.length} errores de compilación marcados en el editor`}
            </p>
          ) : null}

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
