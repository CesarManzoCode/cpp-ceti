import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Progress } from "@/components/ui/progress";
import { RoadmapLessons } from "@/features/roadmap/components/roadmap-lessons";
import { getDefaultCourse } from "@/features/roadmap/queries";
import { getUnitBySlug } from "@/features/lessons/queries";
import { requireSession } from "@/lib/get-session";

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
    <div
      data-page-enter
      className="mx-auto max-w-4xl space-y-8 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <ConsoleEyebrow tone="primary">
            Unidad {unit.order.toString().padStart(2, "0")}
          </ConsoleEyebrow>
          {unitComplete ? (
            <Badge variant="success" size="sm">
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Completada
            </Badge>
          ) : null}
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-[40px]">
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

      {unitComplete ? (
        <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-success/25 bg-success-soft/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
              <Check className="size-5" strokeWidth={3} aria-hidden />
            </span>
            <div>
              <p className="eyebrow text-success">Unidad completada</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Dominaste esta unidad. Sigue con lo que viene en tu camino.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="self-start sm:self-auto"
          >
            <Link href="/app">
              Volver al inicio
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

      <RoadmapLessons
        unitSlug={unit.slug}
        unitOrder={unit.order}
        lessons={unit.lessons.map((l) => ({
          id: l.id,
          slug: l.slug,
          title: l.title,
          description: l.description,
          order: l.order,
          xpReward: l.xpReward,
          estimatedMinutes: l.estimatedMinutes,
          stepCount: l.stepCount,
          status: l.status,
        }))}
      />
    </div>
  );
}
