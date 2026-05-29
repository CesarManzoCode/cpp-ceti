"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { completeStep } from "@/lib/lessons-actions";
import { cn } from "@/lib/utils";
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
  // "Trabajo completado": llena al avanzar de paso, llega a 100% solo al cerrar.
  const progressPercent = (currentIndex / total) * 100;
  const isFirstStep = currentIndex === 0;
  // Los retos de código necesitan más ancho para el editor que la lectura.
  const isWideStep = currentStep?.type === "code_challenge";
  const containerMax = isWideStep ? "max-w-6xl" : "max-w-4xl";

  function handlePrev() {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
          err instanceof Error
            ? err.message
            : "No pudimos guardar tu progreso.",
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
      {/* Header sticky — fino y discreto (el Topbar global se oculta aquí) */}
      <div className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div
          className={cn(
            "mx-auto flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6",
            containerMax,
          )}
        >
          {isFirstStep ? (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="-ml-2 hidden sm:inline-flex"
            >
              <Link href={`/app/u/${unit.slug}`}>
                <ChevronLeft />
                <span className="max-w-[20ch] truncate">{unit.title}</span>
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handlePrev}
              disabled={isPending}
              className="-ml-2"
            >
              <ChevronLeft />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
          )}

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
            <Link href="/app">
              <X className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div
        key={currentStep.id}
        className={cn(
          "animate-slide-in-right mx-auto flex flex-col gap-8 px-5 py-7 sm:px-6 lg:py-9",
          containerMax,
        )}
      >
        {/* Title — solo en el primer paso para no repetir; resto muestra contexto */}
        {isFirstStep ? (
          <header className="space-y-2">
            <p className="eyebrow text-primary">
              Unidad {unit.order.toString().padStart(2, "0")}
            </p>
            <h1 className="text-balance text-[26px] font-bold leading-tight tracking-[-0.025em] sm:text-[34px]">
              {lesson.title}
            </h1>
            {lesson.description ? (
              <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {lesson.description}
              </p>
            ) : null}
          </header>
        ) : (
          <header>
            <p className="eyebrow text-muted-foreground">
              Paso {currentIndex + 1} de {total} · {lesson.title}
            </p>
          </header>
        )}

        <div className="min-h-[280px]">
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
          content={
            step.content as Extract<StepContent, { type: "code_example" }>
          }
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
          content={
            step.content as Extract<StepContent, { type: "fill_blank" }>
          }
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
