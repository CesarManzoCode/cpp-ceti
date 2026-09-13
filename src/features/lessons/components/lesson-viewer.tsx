"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";

import { BrickRow } from "@/components/ui/bricks";
import { Button } from "@/components/ui/button";
import { LearningHelpMenu } from "@/components/layout/learning-help-menu";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import { SkipLink } from "@/components/shared/skip-link";
import {
  StudySessionProvider,
  useStudySession,
} from "@/features/analytics/telemetry";
import { completeStep, markStepAssisted } from "@/features/lessons/actions";
import type { LanguageId } from "@/lib/code-languages";
import { cn } from "@/lib/utils";
import type { ViewerStep } from "@/features/lessons/types";

import { LessonCompletedPanel } from "./lesson-completed";
import { LessonStepRenderer } from "./lesson-step-renderer";
import type { StepSignal } from "./step-signal";

/** Tipos de step con señal pedagógica propia (ver `step-signal.ts`). */
const INTERACTIVE_STEP_TYPES = new Set([
  "quiz",
  "fill_blank",
  "matching",
  "code_completion",
  "code_challenge",
]);

export interface LessonViewerProps {
  /**
   * Lenguaje del curso al que pertenece la lección. Viaja desde el servidor
   * hasta cada paso con código: editor, resaltado, sugerencias y parser de
   * errores salen de aquí.
   */
  language: LanguageId;
  /** Curso dueño de la lección: todos los enlaces lo llevan. */
  courseSlug: string;
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

/**
 * Envoltura de telemetría: abre la `StudySession` de esta lección para todo
 * lo que se renderice adentro (pasos, retos, pistas). El reproductor real es
 * `LessonPlayer`.
 */
export function LessonViewer(props: LessonViewerProps) {
  return (
    <StudySessionProvider surface="lesson" resourceId={props.lesson.id}>
      <LessonPlayer {...props} />
    </StudySessionProvider>
  );
}

function LessonPlayer({
  language,
  courseSlug,
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
  const { track, markEngaged, studySessionId } = useStudySession();

  // Mantener la URL sincronizada con el paso actual para soportar deep-link
  // y refresh sin perder posición. Usamos history.replaceState para no inflar
  // el back-stack con cada avance de paso.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("p", String(currentIndex + 1));
    window.history.replaceState(null, "", url.toString());
  }, [currentIndex]);

  const currentStepForView = lesson.steps[currentIndex];

  // Vista del paso. `studySessionId` está en las dependencias A PROPÓSITO: al
  // montar todavía no existe la sesión, y sin esto la vista del PRIMER paso
  // (justo la que sostiene el funnel) se perdía para siempre. El dedupe vive
  // en el servidor —una vista por paso y por sesión—, así que reintentar
  // cuando llega el id no duplica nada.
  React.useEffect(() => {
    if (!currentStepForView || !studySessionId) return;
    track({
      name: "lesson_step_view",
      lessonId: lesson.id,
      lessonStepId: currentStepForView.id,
      stepType: currentStepForView.type,
      stepIndex: currentIndex,
    });
  }, [track, studySessionId, lesson.id, currentStepForView, currentIndex]);

  // Ordinal de intento POR PASO Y POR VISITA. Vive aquí, no en el componente
  // de paso: al volver atrás y regresar, React remonta el paso (`key` = id) y
  // su contador local vuelve a 1. Con eso, el segundo intento reusaba el
  // dedupeKey del primero y se perdía en silencio.
  const attemptOrdinalsRef = React.useRef<Map<string, number>>(new Map());

  // Pasos cuya respuesta/solución se reveló en esta sesión de estudio. El
  // registro DURADERO lo hace `markStepAssisted` en el servidor; este set
  // es lo que viaja con el completado, para que "completado" no signifique
  // lo mismo después de copiar una solución que después de resolverla.
  // Arranca VACÍO a propósito: para avanzar, cada paso interactivo exige
  // responderlo otra vez, así que completarlo en esta visita sin revelar
  // nada es una resolución autónoma y debe poder limpiar el estado previo.
  const [assistedSteps, setAssistedSteps] = React.useState<Set<string>>(
    () => new Set<string>(),
  );

  const handleStepSignal = React.useCallback(
    (signal: StepSignal) => {
      const step = lesson.steps[currentIndex];
      if (!step || !INTERACTIVE_STEP_TYPES.has(step.type)) return;
      markEngaged("step_interaction");
      const stepType = step.type as
        | "quiz"
        | "fill_blank"
        | "matching"
        | "code_completion"
        | "code_challenge";
      if (signal.kind === "attempt") {
        const attemptNumber =
          (attemptOrdinalsRef.current.get(step.id) ?? 0) + 1;
        attemptOrdinalsRef.current.set(step.id, attemptNumber);
        track({
          name: "lesson_step_attempt",
          lessonId: lesson.id,
          lessonStepId: step.id,
          stepType,
          attemptNumber,
          correct: signal.correct,
        });
        return;
      }
      track({
        name: "lesson_step_answer_revealed",
        lessonId: lesson.id,
        lessonStepId: step.id,
        stepType,
        failedAttempts: signal.failedAttempts,
      });
      // Persistir el reveal AHORA, no al completar: el diálogo promete que
      // quedará marcado como asistido y esa promesa no puede depender de
      // que el alumno termine el paso.
      setAssistedSteps((prev) => new Set(prev).add(step.id));
      void markStepAssisted(step.id).catch(() => {
        // Un fallo aquí no puede bloquear el aprendizaje: el completado
        // manda igual la bandera y el estado se corrige entonces.
      });
    },
    [track, markEngaged, lesson.id, lesson.steps, currentIndex],
  );

  const [isPending, startTransition] = React.useTransition();
  // Cierre EN FLUJO, no modal (blueprint UX/UI, C1/G8): terminar la lección
  // reemplaza el paso actual por un estado de cierre dentro de la misma
  // página, con foco propio — no interrumpe con un diálogo.
  const [completion, setCompletion] = React.useState<{
    done: boolean;
    xp: number;
  }>({ done: false, xp: 0 });

  const router = useRouter();
  const total = lesson.steps.length;
  const currentStep = lesson.steps[currentIndex];
  const isFirstStep = currentIndex === 0;
  // Asistido si se reveló ayuda en esta visita, o si así quedó registrado
  // la última vez que se completó.
  const stepAssisted = currentStep
    ? assistedSteps.has(currentStep.id) || currentStep.assisted === true
    : false;
  // Los retos de código necesitan más ancho para el editor que la lectura.
  const isWideStep = currentStep?.type === "code_challenge";
  const containerMax = isWideStep ? "max-w-6xl" : "max-w-[46rem]";

  // Foco y anuncio al cambiar de paso o al cerrar la lección (blueprint
  // UX/UI, D3/H6/J3): el título del paso recibe el foco programático y un
  // lector de pantalla anuncia "Paso n de total".
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const isInitialRender = React.useRef(true);
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    headingRef.current?.focus();
    setAnnouncement(
      completion.done
        ? "Lección completada"
        : `Paso ${currentIndex + 1} de ${total}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, completion.done]);

  function scrollTop() {
    if (window.scrollY > 80) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrev() {
    if (completion.done) {
      setCompletion({ done: false, xp: 0 });
      scrollTop();
      return;
    }
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    scrollTop();
  }

  function handleNext() {
    if (!currentStep) return;
    markEngaged("step_advance");

    startTransition(async () => {
      try {
        const res = await completeStep(currentStep.id, {
          assisted: assistedSteps.has(currentStep.id),
        });
        if (res.lessonCompleted) {
          setCompletion({ done: true, xp: res.xpEarned || lesson.xpReward });
          scrollTop();
          // Invalida el RSC cacheado de unidad/curso: sus contadores de
          // progreso deben reflejar esta lección ya al volver o navegar a
          // la siguiente, sin esperar a un refresh manual.
          router.refresh();
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

  const bugTarget: React.ComponentProps<typeof LearningHelpMenu>["bugTarget"] =
    currentStep.type === "code_challenge" && currentStep.exercise
      ? { kind: "exercise", exerciseId: currentStep.exercise.id }
      : { kind: "lesson_step", lessonStepId: currentStep.id };

  return (
    <>
      <SkipLink href="#paso-actual">Saltar a la consigna</SkipLink>
      {currentStep.type === "code_challenge" ? (
        <SkipLink href="#banco-de-trabajo">Saltar al editor</SkipLink>
      ) : null}
      {/* Learning Bar (blueprint UX/UI, D3/G6): volver → contexto →
          progreso → ayuda → salir. Sustituye por completo al shell global
          — sin sidebar ni bottom nav — mientras se estudia. */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div
          className={cn(
            "mx-auto flex h-14 items-center gap-3 px-3 sm:h-16 sm:px-6",
            containerMax,
          )}
        >
          {isFirstStep && !completion.done ? (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="-ml-2 shrink-0"
              aria-label={`Volver a ${unit.title}`}
            >
              <Link href={`/app/c/${courseSlug}/u/${unit.slug}`}>
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
              aria-label="Anterior"
              className="-ml-2 shrink-0"
            >
              <ChevronLeft />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
          )}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Unidad SIEMPRE identificable, no sólo en el primer paso
                (blueprint UX/UI, M4: "curso, unidad y paso son
                identificables en toda lección"). */}
            <span
              className="hidden shrink-0 max-w-[16ch] truncate text-[12px] font-bold uppercase tracking-[0.04em] text-subtle-foreground sm:inline"
              title={unit.title}
            >
              {unit.title}
            </span>
            <BrickRow
              className="min-w-0 flex-1"
              total={total}
              done={completion.done ? total : currentIndex}
              current={completion.done ? -1 : currentIndex}
              tone={completion.done ? "success" : "primary"}
              size="md"
              srLabel={
                completion.done
                  ? `Lección completada: ${total} de ${total}`
                  : `Paso ${currentIndex + 1} de ${total}`
              }
            />
            <span className="shrink-0 text-[13px] font-bold tabular-nums text-muted-foreground">
              {completion.done ? total : currentIndex + 1}
              <span className="text-subtle-foreground">/{total}</span>
            </span>
            {/* "Completado" no puede significar lo mismo después de copiar
                una solución que después de resolverla. El XP no cambia; lo
                que cambia es saber qué te toca repasar. */}
            {stepAssisted && !completion.done ? (
              <span className="hidden shrink-0 rounded-full bg-warning-soft px-2.5 py-1 text-[12px] font-bold text-warning sm:inline">
                Con ayuda
              </span>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <LearningHelpMenu bugTarget={bugTarget} />

            <Button
              asChild
              size="icon-sm"
              variant="ghost"
              aria-label="Salir de la lección"
            >
              <Link href={`/app/c/${courseSlug}`}>
                <X className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Anuncio para lector de pantalla del cambio de paso/cierre. El
          foco programático (más arriba) ya mueve la atención visual; esto
          asegura que también se anuncie sin leer el título dos veces. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {completion.done ? (
        <LessonCompletedPanel
          headingRef={headingRef}
          xpEarned={completion.xp}
          nextLessonLink={nextLessonLink}
          unitHref={`/app/c/${courseSlug}/u/${unit.slug}`}
          containerMax={containerMax}
        />
      ) : (
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
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 text-balance text-[28px] font-extrabold leading-[1.12] tracking-[-0.032em] outline-none sm:text-[36px]"
              >
                <InlineCodeText>{lesson.title}</InlineCodeText>
              </h1>
              {lesson.description ? (
                <p className="mt-3 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                  {lesson.description}
                </p>
              ) : null}
            </header>
          ) : (
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="truncate text-[14px] font-semibold text-subtle-foreground outline-none"
            >
              {lesson.title.replace(/`/g, "")}
            </h2>
          )}

          <div id="paso-actual" className="min-h-[280px]">
            <LessonStepRenderer
              step={currentStep}
              language={language}
              lessonId={lesson.id}
              onNext={handleNext}
              isPending={isPending}
              onSignal={handleStepSignal}
            />
          </div>
        </div>
      )}
    </>
  );
}
