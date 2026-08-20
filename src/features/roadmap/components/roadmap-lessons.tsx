import Link from "next/link";
import { Check, Lock } from "lucide-react";

import { InlineCodeText } from "@/components/shared/inline-code-text";
import { cn } from "@/lib/utils";
import type { RoadmapLesson, RoadmapLessonStatus } from "@/features/roadmap/types";

export interface RoadmapLessonsProps {
  unitSlug: string;
  unitOrder: number;
  lessons: RoadmapLesson[];
}

/**
 * Lecciones de la unidad, con la misma canaleta que el temario: el
 * ordinal y el estado a la izquierda del filete. La metadata (XP,
 * minutos, pasos) va monoespaciada y alineada, para poder comparar dos
 * lecciones de un vistazo sin leerlas.
 */
export function RoadmapLessons({ unitSlug, lessons }: RoadmapLessonsProps) {
  if (lessons.length === 0) {
    return (
      <p className="border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
        Esta unidad aún no tiene lecciones publicadas.
      </p>
    );
  }

  const headIndex = findHeadIndex(lessons);

  return (
    <ol className="gutter-list border-y border-border">
      {lessons.map((lesson, idx) => {
        const isNext = idx === headIndex;
        const isLocked = headIndex !== -1 && idx > headIndex;
        const status = lesson.status;

        const label =
          status === "completed"
            ? { text: "Completada", tone: "text-success" }
            : status === "in_progress"
              ? { text: "En curso", tone: "text-primary" }
              : isNext
                ? { text: "Siguiente", tone: "text-primary" }
                : isLocked
                  ? { text: "Bloqueada", tone: "text-muted-foreground/70" }
                  : null;

        const body = (
          <>
            <span className="flex items-start justify-center pt-4 pr-3">
              <LessonMark
                status={status}
                isLocked={isLocked}
                order={lesson.order}
              />
            </span>

            <span className="min-w-0 py-4 pl-4">
              <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span
                  className={cn(
                    "text-[15px] font-semibold leading-snug sm:text-base",
                    isLocked ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  <InlineCodeText>{lesson.title}</InlineCodeText>
                </span>
                {label ? (
                  <span className={cn("label-micro", label.tone)}>
                    {label.text}
                  </span>
                ) : null}
              </span>

              {lesson.description ? (
                <span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">
                  {lesson.description}
                </span>
              ) : null}

              <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tabular-nums text-muted-foreground">
                <span>{lesson.estimatedMinutes} min</span>
                <span>
                  {lesson.stepCount} {lesson.stepCount === 1 ? "paso" : "pasos"}
                </span>
                <span className="text-warning">+{lesson.xpReward} XP</span>
              </span>
            </span>
          </>
        );

        return (
          <li key={lesson.id} className="border-t border-border first:border-t-0">
            {isLocked ? (
              <div
                className="gutter-row opacity-60"
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
                className="gutter-row transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
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

function LessonMark({
  status,
  isLocked,
  order,
}: {
  status: RoadmapLessonStatus;
  isLocked: boolean;
  order: number;
}) {
  if (status === "completed") {
    return (
      <span
        aria-hidden
        className="grid size-4 place-items-center rounded-[1px] bg-success text-success-foreground"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span
        aria-hidden
        className="grid size-4 place-items-center rounded-[1px] border border-primary"
      >
        <span className="size-2 bg-primary" />
      </span>
    );
  }
  if (isLocked) {
    return <Lock className="size-3.5 text-muted-foreground/50" aria-hidden />;
  }
  return (
    <span
      aria-hidden
      className="font-mono text-[12px] tabular-nums text-muted-foreground/70"
    >
      {String(order).padStart(2, "0")}
    </span>
  );
}
