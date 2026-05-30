"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  Play,
  Send,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Markdown } from "@/components/shared/markdown";
import { CppEditor } from "@/components/editor/cpp-editor";
import {
  diagnosticsFromExecution,
  diagnosticsFromSubmission,
} from "@/components/editor/diagnostics";
import { useCodeDraft } from "@/components/editor/use-code-draft";
import { ExampleTests } from "@/components/exercise/example-tests";
import { HintsPanel } from "@/components/exercise/hints-panel";
import { RunOutput } from "@/components/exercise/run-output";
import { SubmissionResults } from "@/components/exercise/submission-results";
import type {
  SubmissionState,
  VisibleTest,
} from "@/components/exercise/types";
import { useRunCode } from "@/hooks/use-run-code";
import { submitExercise } from "@/features/lessons/actions";
import { DIFFICULTY_META } from "@/lib/difficulty";

interface StepCodeChallengeProps {
  exercise: {
    id: string;
    prompt: string;
    starterCode: string;
    solutionCode: string;
    hints: string[];
    difficulty: "easy" | "medium" | "hard";
    xpReward: number;
    bestAttemptCode: string | null;
    visibleTests: VisibleTest[];
  };
  onNext: () => void;
  isPending: boolean;
}

const ATTEMPTS_BEFORE_SOLUTION = 3;

export function StepCodeChallenge({
  exercise,
  onNext,
  isPending,
}: StepCodeChallengeProps) {
  const [code, setCode] = useCodeDraft({
    key: exercise.id,
    fallback: exercise.starterCode,
    serverBest: exercise.bestAttemptCode,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [showSolutionDialog, setShowSolutionDialog] = React.useState(false);
  const [solutionRevealed, setSolutionRevealed] = React.useState(false);
  const [submission, setSubmission] = React.useState<SubmissionState | null>(
    null,
  );
  const resultRef = React.useRef<HTMLDivElement>(null);

  const playground = useRunCode();

  React.useEffect(() => {
    if (attempt > 0) {
      resultRef.current?.scrollIntoView({
        block: attempt === 1 ? "start" : "nearest",
        behavior: "smooth",
      });
    }
  }, [attempt]);

  const diagnostics = React.useMemo(() => {
    if (submission && !submission.passed) {
      return diagnosticsFromSubmission(submission.results);
    }
    return diagnosticsFromExecution(playground.result);
  }, [submission, playground.result]);

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
      } else {
        setFailedAttempts((n) => n + 1);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falló el envío");
    } finally {
      setSubmitting(false);
    }
  }

  function revealSolution() {
    setCode(exercise.solutionCode);
    setSolutionRevealed(true);
    setShowSolutionDialog(false);
    setSubmission(null);
    toast.info(
      "Solución insertada. Léela con calma e intenta entender cada línea.",
    );
  }

  const running = playground.state === "running";
  const canShowSolution =
    failedAttempts >= ATTEMPTS_BEFORE_SOLUTION &&
    !submission?.passed &&
    !solutionRevealed;

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
          {solutionRevealed ? (
            <span className="eyebrow inline-flex items-center gap-1 text-muted-foreground">
              Solución revelada
            </span>
          ) : null}
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
          diagnostics={diagnostics}
          ariaLabel="Editor del reto. Ctrl+Enter para ejecutar, botón Enviar para calificar."
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
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
              variant="outline"
              onClick={handleSubmit}
              disabled={submitting || running}
              loading={submitting}
              className="h-11 flex-1 sm:h-9 sm:flex-none"
            >
              <Send />
              Enviar solución
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
          {canShowSolution ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSolutionDialog(true)}
              className="h-9 w-full justify-center text-muted-foreground hover:text-foreground"
            >
              <Eye />
              Ver solución
            </Button>
          ) : null}
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

      <Dialog
        open={showSolutionDialog}
        onOpenChange={setShowSolutionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Ver la solución?</DialogTitle>
            <DialogDescription>
              Vamos a poner una solución correcta en tu editor. Léela paso por
              paso e intenta entender por qué funciona — el copy-paste no
              enseña. Conservas el XP cuando aún no has pasado, pero el reto
              quedará marcado como asistido.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowSolutionDialog(false)}
            >
              Sigo intentando
            </Button>
            <Button onClick={revealSolution}>
              <Eye />
              Mostrar solución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
