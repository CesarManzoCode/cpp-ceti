import Link from "next/link";
import { ArrowRight, Check, Clock, Layers, Lock, Zap } from "lucide-react";

import { BrickRow } from "@/components/ui/bricks";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import { cn } from "@/lib/utils";
import type { RoadmapLesson, RoadmapLessonStatus } from "@/features/roadmap/types";

export interface RoadmapLessonsProps {
  unitSlug: string;
  unitOrder: number;
  lessons: RoadmapLesson[];
}

/**
 * Las lecciones de una unidad, en la misma gramática que la ruta del
 * curso pero un nivel más adentro: nudo de estado a la izquierda,
 * pieza a la derecha. Cada lección muestra sus pasos como bloques, así
 * que "cuánto me va a tomar" se ve antes de entrar.
 */
export function RoadmapLessons({ unitSlug, lessons }: RoadmapLessonsProps) {
  if (lessons.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-6 py-10 text-center text-[15px] text-muted-foreground">
        Esta unidad aún no tiene lecciones publicadas.
      </p>
    );
  }

  const headIndex = findHeadIndex(lessons);

  return (
    <ol className="flex flex-col gap-3">
      {lessons.map((lesson, idx) => {
        const isNext = idx === headIndex;
        const isLocked = headIndex !== -1 && idx > headIndex;
        const status = lesson.status;
        const done = status === "completed";
        const inProgress = status === "in_progress";

        const label = done
          ? { text: "Completada", className: "bg-success-soft text-success" }
          : inProgress
            ? { text: "En curso", className: "bg-primary text-primary-foreground" }
            : isNext
              ? { text: "Siguiente", className: "bg-primary text-primary-foreground" }
              : null;

        const body = (
          <div
            className={cn(
              "flex items-start gap-4 rounded-[var(--radius-lg)] border p-4 transition-[border-color,box-shadow,transform] duration-200 sm:p-5",
              isLocked
                ? "border-dashed border-border bg-transparent"
                : inProgress || isNext
                  ? "border-primary/30 bg-primary-tint shadow-[var(--shadow-xs)]"
                  : "border-border bg-card shadow-[var(--shadow-xs)]",
              !isLocked &&
                "group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[var(--shadow-md)]",
            )}
          >
            <LessonNode
              status={status}
              isLocked={isLocked}
              isNext={isNext}
              order={lesson.order}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <h3
                  className={cn(
                    "text-[16px] font-bold leading-snug tracking-[-0.012em] sm:text-[17px]",
                    isLocked ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  <InlineCodeText>{lesson.title}</InlineCodeText>
                </h3>
                {label ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold",
                      label.className,
                    )}
                  >
                    {label.text}
                  </span>
                ) : null}
              </div>

              {lesson.description ? (
                <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                  <InlineCodeText>{lesson.description}</InlineCodeText>
                </p>
              ) : null}

              {lesson.stepCount > 0 ? (
                <BrickRow
                  className="mt-3 max-w-[220px]"
                  size="sm"
                  total={lesson.stepCount}
                  done={done ? lesson.stepCount : 0}
                  tone={done ? "success" : "primary"}
                  srLabel={`${lesson.stepCount} pasos`}
                />
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden />
                  {lesson.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="size-4" aria-hidden />
                  {lesson.stepCount}{" "}
                  {lesson.stepCount === 1 ? "paso" : "pasos"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-warning">
                  <Zap className="size-4" aria-hidden />
                  {lesson.xpReward} XP
                </span>
              </div>
            </div>

            {!isLocked ? (
              <ArrowRight
                className="mt-1 hidden size-5 shrink-0 text-subtle-foreground transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
                aria-hidden
              />
            ) : null}
          </div>
        );

        return (
          <li key={lesson.id}>
            {isLocked ? (
              <div
                className="group opacity-80"
                aria-disabled="true"
                aria-label={`Lección ${lesson.order}: ${lesson.title} (bloqueada — termina la anterior)`}
                title="Termina la lección anterior para desbloquear"
              >
                {body}
              </div>
            ) : (
              <Link
                href={`/app/u/${unitSlug}/${lesson.slug}`}
                aria-label={`Lección ${lesson.order}: ${lesson.title}`}
                className="group block rounded-[var(--radius-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function findHeadIndex(lessons: RoadmapLesson[]): number {
  for (let i = 0; i < lessons.length; i++) {
    if (
      lessons[i].status !== "completed" &&
      lessons[i].status !== "in_progress"
    ) {
      return i;
    }
  }
  return -1;
}

function LessonNode({
  status,
  isLocked,
  isNext,
  order,
}: {
  status: RoadmapLessonStatus;
  isLocked: boolean;
  isNext: boolean;
  order: number;
}) {
  if (status === "completed") {
    return (
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-success text-success-foreground"
      >
        <Check className="size-[18px]" strokeWidth={3.2} />
      </span>
    );
  }
  if (isLocked) {
    return (
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] border border-dashed border-border-strong text-subtle-foreground"
      >
        <Lock className="size-4" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] text-[15px] font-extrabold tabular-nums",
        status === "in_progress" || isNext
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card text-muted-foreground",
      )}
    >
      {order}
    </span>
  );
}
