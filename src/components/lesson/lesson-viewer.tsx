"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/components/ui/loading-link";
import { Progress } from "@/components/ui/progress";
import { completeStep } from "@/lib/lessons-actions";
import type { StepContent } from "@/types/lesson";

import { StepTheory } from "./step-theory";
import { StepCodeExample } from "./step-code-example";
import { StepQuiz } from "./step-quiz";
import { StepFillBlank } from "./step-fill-blank";
import { StepCodeChallenge } from "./step-code-challenge";
import { LessonCompleted } from "./lesson-completed";

export interface ViewerStep {
  id: string;
  order: number;
  type: StepContent["type"];
  content: StepContent;
  completed: boolean;
  exercise?: {
    id: string;
    prompt: string;
    starterCode: string;
    hints: string[];
    difficulty: "easy" | "medium" | "hard";
    xpReward: number;
    visibleTests: {
      id: string;
      stdin: string;
      expectedStdout: string;
      description: string | null;
    }[];
  };
}

export interface LessonViewerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    steps: ViewerStep[];
  };
  unit: {
    slug: string;
    title: string;
    order: number;
  };
  nextLessonLink: { href: string; title: string } | null;
}

export function LessonViewer({
  lesson,
  unit,
  nextLessonLink,
}: LessonViewerProps) {
  // Empezar en el primer paso no completado, o el primero si todos lo están
  const initialIndex = React.useMemo(() => {
    const firstIncomplete = lesson.steps.findIndex((s) => !s.completed);
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  }, [lesson.steps]);

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isPending, startTransition] = React.useTransition();
  const [completedDialog, setCompletedDialog] = React.useState<{
    open: boolean;
    xp: number;
  }>({ open: false, xp: 0 });

  const router = useRouter();
  const total = lesson.steps.length;
  const currentStep = lesson.steps[currentIndex];
  const progressPercent = ((currentIndex + 1) / total) * 100;

  function handleNext() {
    if (!currentStep) return;

    startTransition(async () => {
      try {
        const res = await completeStep(currentStep.id);
        if (res.lessonCompleted) {
          setCompletedDialog({ open: true, xp: res.xpEarned });
        } else if (currentIndex < total - 1) {
          setCurrentIndex(currentIndex + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No pudimos guardar tu progreso.",
        );
      }
    });
  }

  if (!currentStep) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Esta lección no tiene contenido todavía.
      </div>
    );
  }

  return (
    <>
      {/* Header sticky — barra fina y limpia */}
      <div className="sticky top-16 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="-ml-2 hidden sm:inline-flex"
          >
            <LoadingLink href={`/app/u/${unit.slug}`} showHint={false}>
              <ChevronLeft />
              <span className="max-w-[16ch] truncate">{unit.title}</span>
            </LoadingLink>
          </Button>

          <div className="flex flex-1 items-center gap-3">
            <Progress value={progressPercent} size="xs" className="flex-1" />
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
              {currentIndex + 1}/{total}
            </span>
          </div>

          <Button
            asChild
            size="icon-sm"
            variant="ghost"
            aria-label="Salir de la lección"
          >
            <LoadingLink href="/app" showHint={false}>
              <X className="size-4" />
            </LoadingLink>
          </Button>
        </div>
      </div>

      <div
        key={currentStep.id}
        className="animate-slide-in-right mx-auto flex max-w-4xl flex-col gap-8 px-5 py-6 sm:px-6 lg:py-8"
      >
        {/* Title */}
        <header className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Paso {currentIndex + 1} de {total}
          </p>
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-[32px]">
            {lesson.title}
          </h1>
        </header>

        {/* Step content */}
        <div className="min-h-[400px]">
          <StepRenderer
            step={currentStep}
            onNext={handleNext}
            isPending={isPending}
          />
        </div>
      </div>

      <LessonCompleted
        open={completedDialog.open}
        onOpenChange={(open) => {
          setCompletedDialog({ ...completedDialog, open });
          if (!open) {
            router.refresh();
          }
        }}
        xpEarned={completedDialog.xp || lesson.xpReward}
        nextLessonLink={nextLessonLink}
        unitHref={`/app/u/${unit.slug}`}
      />
    </>
  );
}

function StepRenderer({
  step,
  onNext,
  isPending,
}: {
  step: ViewerStep;
  onNext: () => void;
  isPending: boolean;
}) {
  switch (step.type) {
    case "theory":
      return (
        <StepTheory
          content={step.content as Extract<StepContent, { type: "theory" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "code_example":
      return (
        <StepCodeExample
          content={step.content as Extract<StepContent, { type: "code_example" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "quiz":
      return (
        <StepQuiz
          content={step.content as Extract<StepContent, { type: "quiz" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "fill_blank":
      return (
        <StepFillBlank
          content={step.content as Extract<StepContent, { type: "fill_blank" }>}
          onNext={onNext}
          isPending={isPending}
        />
      );
    case "code_challenge": {
      if (!step.exercise) {
        return (
          <p className="text-sm text-destructive">
            Este reto está mal configurado (falta el ejercicio).
          </p>
        );
      }
      return (
        <StepCodeChallenge
          exercise={step.exercise}
          onNext={onNext}
          isPending={isPending}
        />
      );
    }
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Tipo de paso desconocido.
        </p>
      );
  }
}
