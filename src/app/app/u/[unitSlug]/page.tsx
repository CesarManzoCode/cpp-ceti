import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft, CircleCheck, CircleDashed, Circle } from "lucide-react";

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

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 lg:p-8">
      <div>
        <Button asChild size="sm" variant="ghost" className="-ml-2">
          <Link href="/app">
            <ChevronLeft className="size-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          Unidad {unit.order}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {unit.title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{unit.description}</p>
        <div className="flex items-center gap-3 pt-2">
          <Progress value={percent} className="max-w-xs" />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {completedCount}/{totalLessons}
          </span>
        </div>
      </header>

      <ul className="space-y-2">
        {unit.lessons.map((lesson, idx) => {
          const isCompleted = lesson.status === "completed";
          const isInProgress = lesson.status === "in_progress";
          const Icon = isCompleted
            ? CircleCheck
            : isInProgress
              ? CircleDashed
              : Circle;
          return (
            <li key={lesson.id}>
              <Link
                href={`/app/u/${unit.slug}/${lesson.slug}`}
                className={cn(
                  "group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                  isCompleted && "border-success/30",
                )}
              >
                <Icon
                  className={cn(
                    "size-6 shrink-0",
                    isCompleted && "text-success",
                    isInProgress && "text-primary",
                    !isCompleted && !isInProgress && "text-muted-foreground/40",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">
                      Lección {idx + 1}
                    </p>
                    {isCompleted ? (
                      <Badge variant="success">Completada</Badge>
                    ) : isInProgress ? (
                      <Badge variant="default">En progreso</Badge>
                    ) : null}
                  </div>
                  <h3 className="truncate text-base font-semibold">
                    {lesson.title}
                  </h3>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {lesson.description}
                  </p>
                </div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block">
                  <p className="font-mono">{lesson.estimatedMinutes} min</p>
                  <p className="font-mono">+{lesson.xpReward} XP</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
        {unit.lessons.length === 0 ? (
          <li className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-muted-foreground">
            Esta unidad aún no tiene lecciones publicadas.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
