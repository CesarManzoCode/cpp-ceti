import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9"
    >
      <header>
        <p className="label-micro flex items-center gap-2.5 text-muted-foreground">
          <span className="text-primary">
            Unidad {unit.order.toString().padStart(2, "0")}
          </span>
          {unitComplete ? (
            <>
              <span aria-hidden className="h-px w-4 bg-border" />
              <span className="text-success">Completada</span>
            </>
          ) : null}
        </p>

        <h1 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.028em] sm:text-[36px]">
          {unit.title}
        </h1>

        {unit.description ? (
          <p className="mt-3 max-w-[56ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
            {unit.description}
          </p>
        ) : null}

        {totalLessons > 0 ? (
          <div className="mt-5 flex max-w-xs items-center gap-3">
            <span aria-hidden className="h-[3px] flex-1 overflow-hidden bg-surface-3">
              <span
                className={
                  "block h-full transition-[width] duration-500 " +
                  (unitComplete ? "bg-success" : "bg-primary")
                }
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {completedCount}/{totalLessons} lecciones
            </span>
          </div>
        ) : null}
      </header>

      {unitComplete ? (
        <div className="mt-7 flex flex-col gap-4 border-l-2 border-success bg-success-soft/50 py-4 pl-4 pr-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-micro text-success">Unidad completada</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Dominaste esta unidad. Sigue con lo que viene en tu camino.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 max-sm:w-full">
            <Link href="/app">
              Volver al inicio
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-8">
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
    </div>
  );
}
