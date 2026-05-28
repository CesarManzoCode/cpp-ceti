import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Check, Clock, Lock, Play, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

export type RoadmapLessonStatus = "completed" | "in_progress" | "not_started";

export interface RoadmapLessonItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  xpReward: number;
  estimatedMinutes: number;
  stepCount: number;
  status: RoadmapLessonStatus;
  order: number;
}

export interface RoadmapLessonsProps {
  unitSlug: string;
  unitOrder: number;
  lessons: RoadmapLessonItem[];
}

/**
 * Lista de lecciones de la unidad: cada lección es una fila clara
 * con número, estado, título y metadata mínima. Sin metáfora de git —
 * editorial, sobrio, fácil de escanear.
 */
export function RoadmapLessons({
  unitSlug,
  lessons,
}: RoadmapLessonsProps) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Esta unidad aún no tiene lecciones publicadas.
        </p>
      </div>
    );
  }

  const headIndex = findHeadIndex(lessons);

  return (
    <ol
      data-stagger
      style={{ "--stagger": "40ms" } as CSSProperties}
      className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
    >
      {lessons.map((lesson, idx) => {
        const isCurrent = idx === headIndex;
        const isLocked = headIndex !== -1 && idx > headIndex;

        return (
          <li
            key={lesson.id}
            style={{ "--i": idx } as CSSProperties}
            className="animate-fade-up border-t border-border/70 first:border-t-0"
          >
            <LessonRow
              href={`/app/u/${unitSlug}/${lesson.slug}`}
              order={lesson.order}
              title={lesson.title}
              description={lesson.description}
              xpReward={lesson.xpReward}
              estimatedMinutes={lesson.estimatedMinutes}
              stepCount={lesson.stepCount}
              status={lesson.status}
              isCurrent={isCurrent}
              isLocked={isLocked}
            />
          </li>
        );
      })}
    </ol>
  );
}

function findHeadIndex(lessons: RoadmapLessonItem[]): number {
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

interface RowProps {
  href: string;
  order: number;
  title: string;
  description: string | null;
  xpReward: number;
  estimatedMinutes: number;
  stepCount: number;
  status: RoadmapLessonStatus;
  isCurrent: boolean;
  isLocked: boolean;
}

function LessonRow({
  href,
  order,
  title,
  description,
  xpReward,
  estimatedMinutes,
  stepCount,
  status,
  isCurrent,
  isLocked,
}: RowProps) {
  const inner = (
    <div
      className={cn(
        "group flex items-center gap-4 p-5 transition-colors sm:gap-5",
        !isLocked && "hover:bg-surface-2/60",
        isLocked && "opacity-70",
      )}
    >
      <LessonBadge status={status} isLocked={isLocked} order={order} />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3
            className={cn(
              "text-[15px] font-semibold tracking-tight sm:text-base",
              status === "in_progress" && "text-primary",
            )}
          >
            {title}
          </h3>
          {isCurrent && status === "not_started" ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              · Siguiente
            </span>
          ) : null}
          {status === "completed" ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-success">
              · Completada
            </span>
          ) : null}
          {status === "in_progress" ? (
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              · En curso
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-0.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
            <Zap className="size-3 text-primary/70" aria-hidden />
            +{xpReward} XP
          </span>
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
            <Clock className="size-3" aria-hidden />
            {estimatedMinutes} min
          </span>
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span className="font-mono tabular-nums">
            {stepCount} {stepCount === 1 ? "paso" : "pasos"}
          </span>
        </div>
      </div>

      {!isLocked ? (
        <ArrowRight
          className="hidden size-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-foreground sm:block"
          aria-hidden
        />
      ) : null}
    </div>
  );

  if (isLocked) {
    return (
      <div
        className="cursor-not-allowed"
        aria-disabled="true"
        aria-label={`Lección ${order}: ${title} (bloqueada — termina la anterior)`}
        title="Termina la lección anterior para desbloquear"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      aria-label={`Lección ${order}: ${title}`}
    >
      {inner}
    </Link>
  );
}

function LessonBadge({
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
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
        <Check className="size-4" strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="relative grid size-9 shrink-0 place-items-center rounded-full border-2 border-primary bg-card text-primary">
        <Play className="size-3.5 fill-primary" aria-hidden />
      </span>
    );
  }
  if (isLocked) {
    return (
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-dashed border-border bg-surface-2 text-muted-foreground/70">
        <Lock className="size-3.5" aria-hidden />
      </span>
    );
  }
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface-2 font-mono text-xs font-bold tabular-nums text-foreground/80">
      {String(order).padStart(2, "0")}
    </span>
  );
}
