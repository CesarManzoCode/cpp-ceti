"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Code2,
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
import { CodeEditor } from "@/components/editor/code-editor";
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
import {
  HintsTargetProvider,
  useStudySession,
} from "@/features/analytics/telemetry";
import { StepKind } from "@/features/lessons/components/step-shell";
import { useRunCode } from "@/hooks/use-run-code";
import { submitExercise } from "@/features/lessons/actions";
import { DIFFICULTY_META } from "@/lib/difficulty";

import type { StepSignalHandler } from "./step-signal";
import type { LanguageId } from "@/lib/code-languages";

interface StepCodeChallengeProps {
  language: LanguageId;
  lessonId: string;
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
  onSignal?: StepSignalHandler;
}

const ATTEMPTS_BEFORE_SOLUTION = 3;

export function StepCodeChallenge({
  language,
  lessonId,
  exercise,
  onNext,
  isPending,
  onSignal,
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

  const { studySessionId, markEngaged } = useStudySession();

  // Los envíos calificados ya viven en `UserExerciseAttempt`: aquí sólo
  // instrumentamos lo que NO queda registrado allá (compilar sin calificar).
  const playground = useRunCode({
    target: { exerciseId: exercise.id, lessonId },
    studySessionId,
  });

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
      return diagnosticsFromSubmission(submission.results, language);
    }
    return diagnosticsFromExecution(playground.result, language);
  }, [submission, playground.result, language]);

  async function handleSubmit() {
    markEngaged("code_run");
    setSubmitting(true);
    try {
      const res = await submitExercise({
        exerciseId: exercise.id,
        sourceCode: code,
        // Enviar la solución insertada no vale lo mismo que resolverla:
        // conserva el XP, pero el paso queda marcado como asistido.
        assisted: solutionRevealed,
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
    // Señal pedagógica: rendirse tras N intentos NO puede quedar
    // indistinguible de resolverlo a la primera.
    onSignal?.({ kind: "reveal", failedAttempts });
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
    <article className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-8">
      {/* Enunciado — siempre primero (móvil y desktop col. izquierda) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StepKind label="Reto" icon={<Code2 aria-hidden />} tone="warning" />
          <Badge variant={DIFFICULTY_META[exercise.difficulty].variant} size="md">
            {DIFFICULTY_META[exercise.difficulty].label}
          </Badge>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-warning">
            <Zap className="size-4" aria-hidden />
            +{exercise.xpReward} XP
          </span>
          {solutionRevealed ? (
            <span className="text-[13px] font-semibold text-muted-foreground">
              Solución revelada
            </span>
          ) : null}
        </div>

        <Markdown language={language}>{exercise.prompt}</Markdown>
      </section>

      {/* Editor + acciones — en móvil va justo bajo el enunciado; en desktop, col. derecha */}
      <section className="space-y-3 lg:col-start-2 lg:row-span-2">
        <CodeEditor
          language={language}
          value={code}
          onChange={(next) => {
            markEngaged("code_edit");
            setCode(next);
          }}
          onRun={() => {
            markEngaged("code_run");
            void playground.run(code);
          }}
          minHeight={380}
          diagnostics={diagnostics}
          ariaLabel="Editor del reto. Ctrl+Enter para ejecutar, botón Enviar para calificar."
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                markEngaged("code_run");
                setSubmission(null);
                void playground.run(code);
              }}
              disabled={running || submitting}
              loading={running}
              className="h-12 flex-1 sm:h-10 sm:flex-none"
            >
              <Play className="fill-current" />
              Compilar
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={submitting || running}
              loading={submitting}
              className="h-12 flex-1 sm:h-10 sm:flex-none"
            >
              <Send />
              Calificar solución
            </Button>
          </div>
          {diagnostics.length > 0 ? (
            <p
              className="flex items-center gap-1.5 text-[13px] font-semibold text-destructive"
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
              className="h-10 w-full justify-center text-muted-foreground hover:text-foreground"
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
              className="h-12 w-full sm:h-10 sm:w-auto"
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
        <ExampleTests tests={exercise.visibleTests} language={language} />
        <HintsTargetProvider
          target={{ kind: "exercise", exerciseId: exercise.id }}
        >
          <HintsPanel hints={exercise.hints} />
        </HintsTargetProvider>
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
              enseña. Conservas todo tu XP, y el paso quedará guardado como
              &ldquo;completado con ayuda&rdquo; para que sepas qué repasar.
              Si más adelante lo resuelves sin ver la solución, vuelve a
              contar como resuelto por ti.
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
