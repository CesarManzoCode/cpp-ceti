"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StepRuler } from "@/components/ui/step-ruler";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import { ReportBugDialog } from "@/features/bug-reports/components/report-bug-dialog";
import { completeStep } from "@/features/lessons/actions";
import { cn } from "@/lib/utils";
import type { ViewerStep } from "@/features/lessons/types";

import { LessonCompleted } from "./lesson-completed";
import { LessonStepRenderer } from "./lesson-step-renderer";

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
  /** Si viene de `?p=N` (1-indexed) en la URL, gana sobre el firstIncomplete. */
  initialStepIndex?: number | null;
}

export function LessonViewer({
  lesson,
  unit,
  nextLessonLink,
  initialStepIndex,
}: LessonViewerProps) {
  const initialIndex = React.useMemo(() => {
    if (
      initialStepIndex !== null &&
      initialStepIndex !== undefined &&
      initialStepIndex >= 0 &&
      initialStepIndex < lesson.steps.length
    ) {
      return initialStepIndex;
    }
    const firstIncomplete = lesson.steps.findIndex((s) => !s.completed);
    return firstIncomplete === -1 ? 0 : firstIncomplete;
  }, [lesson.steps, initialStepIndex]);

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  // Mantener la URL sincronizada con el paso actual para soportar deep-link
  // y refresh sin perder posición. Usamos history.replaceState para no inflar
  // el back-stack con cada avance de paso.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("p", String(currentIndex + 1));
    window.history.replaceState(null, "", url.toString());
  }, [currentIndex]);

  const [isPending, startTransition] = React.useTransition();
  const [completedDialog, setCompletedDialog] = React.useState<{
    open: boolean;
    xp: number;
  }>({ open: false, xp: 0 });

  const router = useRouter();
  const total = lesson.steps.length;
  const currentStep = lesson.steps[currentIndex];
  const isFirstStep = currentIndex === 0;
  // Los retos de código necesitan más ancho para el editor que la lectura.
  const isWideStep = currentStep?.type === "code_challenge";
  const containerMax = isWideStep ? "max-w-6xl" : "max-w-3xl";

  function scrollTop() {
    if (window.scrollY > 80) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrev() {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    scrollTop();
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
          scrollTop();
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
      {/* Barra del reproductor. La regla de pasos es el elemento central:
          marca discreta por paso, la actual más alta. Contesta "¿cuánto
          me falta?" sin tener que leer un porcentaje. */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div
          className={cn(
            "mx-auto flex items-center gap-3 px-3 py-2.5 sm:px-6",
            containerMax,
          )}
        >
          {isFirstStep ? (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="-ml-2 shrink-0"
              aria-label={`Volver a ${unit.title}`}
            >
              <Link href={`/app/u/${unit.slug}`}>
                <ChevronLeft />
                <span className="hidden max-w-[18ch] truncate sm:inline">
                  {unit.title}
                </span>
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handlePrev}
              disabled={isPending}
              className="-ml-2 shrink-0"
            >
              <ChevronLeft />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
          )}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <StepRuler total={total} current={currentIndex} className="flex-1" />
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
              {String(currentIndex + 1).padStart(2, "0")}
              <span className="text-muted-foreground/50">
                /{String(total).padStart(2, "0")}
              </span>
            </span>
          </div>

          <div className="flex shrink-0 items-center">
            <ReportBugDialog
              target={
                currentStep.type === "code_challenge" && currentStep.exercise
                  ? { kind: "exercise", exerciseId: currentStep.exercise.id }
                  : { kind: "lesson_step", lessonStepId: currentStep.id }
              }
            />

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
      </div>

      <div
        key={currentStep.id}
        className={cn(
          "animate-slide-in-right mx-auto flex flex-col gap-7 px-5 py-6 sm:px-6 lg:py-9",
          containerMax,
        )}
      >
        {isFirstStep ? (
          <header>
            <p className="label-micro text-primary">
              Unidad {unit.order.toString().padStart(2, "0")} · {unit.title}
            </p>
            <h1 className="mt-3 text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[32px]">
              <InlineCodeText>{lesson.title}</InlineCodeText>
            </h1>
            {lesson.description ? (
              <p className="mt-2.5 max-w-[58ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {lesson.description}
              </p>
            ) : null}
          </header>
        ) : (
          <header>
            <p className="label-micro text-muted-foreground">
              {lesson.title.replace(/`/g, "")}
            </p>
          </header>
        )}

        <div className="min-h-[280px]">
          <LessonStepRenderer
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
