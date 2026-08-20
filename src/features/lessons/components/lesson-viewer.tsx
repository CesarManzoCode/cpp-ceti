"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

import { BrickRow } from "@/components/ui/bricks";
import { Button } from "@/components/ui/button";
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
  const containerMax = isWideStep ? "max-w-6xl" : "max-w-[46rem]";

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
      {/* Cabecera del reproductor. Los bloques de la izquierda a la
          derecha son los pasos de la lección: el mismo objeto con el
          que se dibuja el curso entero, aquí a la escala más pequeña. */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div
          className={cn(
            "mx-auto flex h-14 items-center gap-3 px-3 sm:h-16 sm:px-6",
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
            <BrickRow
              className="min-w-0 flex-1"
              total={total}
              done={currentIndex}
              current={currentIndex}
              size="md"
              srLabel={`Paso ${currentIndex + 1} de ${total}`}
            />
            <span className="shrink-0 text-[13px] font-bold tabular-nums text-muted-foreground">
              {currentIndex + 1}
              <span className="text-subtle-foreground">/{total}</span>
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
                <X className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div
        key={currentStep.id}
        className={cn(
          "animate-slide-in-right mx-auto flex flex-col gap-7 px-4 py-7 sm:px-6 lg:py-10",
          containerMax,
        )}
      >
        {isFirstStep ? (
          <header className="border-b border-border pb-7">
            <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-primary">
              Unidad {unit.order} · {unit.title}
            </p>
            <h1 className="mt-3 text-balance text-[28px] font-extrabold leading-[1.12] tracking-[-0.032em] sm:text-[36px]">
              <InlineCodeText>{lesson.title}</InlineCodeText>
            </h1>
            {lesson.description ? (
              <p className="mt-3 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                {lesson.description}
              </p>
            ) : null}
          </header>
        ) : (
          <p className="truncate text-[14px] font-semibold text-subtle-foreground">
            {lesson.title.replace(/`/g, "")}
          </p>
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
