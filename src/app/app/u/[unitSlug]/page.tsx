import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  Check,
  Circle,
  Clock,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDefaultCourse } from "@/lib/courses";
import { getUnitBySlug } from "@/lib/lessons";
import { requireSession } from "@/lib/get-session";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ unitSlug: string }>;
}

export default async function UnitPage({ params }: PageProps) {
  const { unitSlug } = await params;
  const session = await requireSession();

  const course = await getDefaultCourse();
  if (!course) notFound();

  const unit = await getUnitBySlug(course.slug, unitSlug, session.user.id);
  if (!unit) notFound();

  const completedCount = unit.lessons.filter(
    (l) => l.status === "completed",
  ).length;
  const totalLessons = unit.lessons.length;
  const percent =
    totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
  const unitComplete = totalLessons > 0 && percent === 100;

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div>
        <Button asChild size="sm" variant="ghost" className="-ml-2.5">
          <Link href="/app">
            <ChevronLeft />
            Inicio
          </Link>
        </Button>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Unidad {unit.order.toString().padStart(2, "0")}
          </span>
          {unitComplete ? (
            <Badge variant="success" size="sm">
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Completa
            </Badge>
          ) : null}
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {unit.title}
        </h1>
        {unit.description ? (
          <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {unit.description}
          </p>
        ) : null}
        <div className="flex items-center gap-3 pt-2">
          <Progress
            value={percent}
            tone={unitComplete ? "success" : "primary"}
            className="max-w-xs"
          />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {completedCount}/{totalLessons}
          </span>
        </div>
      </header>

      <ol className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
        {unit.lessons.map((lesson, idx) => {
          const isCompleted = lesson.status === "completed";
          const isInProgress = lesson.status === "in_progress";
          return (
            <li
              key={lesson.id}
              className={cn(
                idx > 0 && "border-t border-border/70",
              )}
            >
              <Link
                href={`/app/u/${unit.slug}/${lesson.slug}`}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface-2/60 sm:gap-5 sm:p-5"
              >
                <LessonStatusBadge
                  index={idx + 1}
                  completed={isCompleted}
                  inProgress={isInProgress}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-semibold tracking-tight sm:text-base">
                      {lesson.title}
                    </h3>
                    {isInProgress ? (
                      <Badge variant="default" size="sm">
                        En progreso
                      </Badge>
                    ) : null}
                  </div>
                  {lesson.description ? (
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {lesson.description}
                    </p>
                  ) : null}
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" aria-hidden />
                      {lesson.estimatedMinutes} min
                    </span>
                    <span aria-hidden className="text-muted-foreground/50">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Zap className="size-3 text-primary" aria-hidden />
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </div>
                <ArrowRight
                  className="hidden size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:block"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
        {unit.lessons.length === 0 ? (
          <li className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Esta unidad aún no tiene lecciones publicadas.
            </p>
          </li>
        ) : null}
      </ol>
    </div>
  );
}

function LessonStatusBadge({
  index,
  completed,
  inProgress,
}: {
  index: number;
  completed: boolean;
  inProgress: boolean;
}) {
  if (completed) {
    return (
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
        <Check className="size-4" strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (inProgress) {
    return (
      <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-primary text-primary font-mono text-xs font-bold">
        {index.toString().padStart(2, "0")}
      </span>
    );
  }
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface-2 text-muted-foreground font-mono text-xs font-medium tabular-nums">
      {index.toString().padStart(2, "0")}
      <Circle className="hidden" aria-hidden />
    </span>
  );
}
