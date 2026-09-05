import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { BrickRow } from "@/components/ui/bricks";
import { Button } from "@/components/ui/button";
import { ReportDiscrepancyButton } from "@/features/feedback/components/report-discrepancy-button";
import { RoadmapLessons } from "@/features/roadmap/components/roadmap-lessons";
import { getCourseBySlug } from "@/features/roadmap/queries";
import { getUnitBySlug } from "@/features/lessons/queries";
import { requireSession } from "@/lib/get-session";

interface PageProps {
  params: Promise<{ courseSlug: string; unitSlug: string }>;
}

export default async function UnitPage({ params }: PageProps) {
  const { courseSlug, unitSlug } = await params;
  const session = await requireSession();

  // El curso viene de la URL. Un slug que no existe es 404, nunca "el
  // primer curso publicado".
  const course = await getCourseBySlug(courseSlug);
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
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={
              "grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] text-[18px] font-extrabold tabular-nums " +
              (unitComplete
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground")
            }
          >
            {unitComplete ? <Check className="size-6" strokeWidth={3.2} /> : unit.order}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
              Unidad {unit.order}
            </p>
            {unitComplete ? (
              <p className="text-[14px] font-bold text-success">Completada</p>
            ) : (
              <p className="text-[14px] font-semibold text-muted-foreground">
                {completedCount} de {totalLessons}{" "}
                {totalLessons === 1 ? "lección" : "lecciones"}
              </p>
            )}
          </div>
          <ReportDiscrepancyButton />
        </div>

        <h1 className="mt-5 text-balance text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          {unit.title}
        </h1>

        {unit.description ? (
          <p className="mt-3 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
            {unit.description}
          </p>
        ) : null}

        {totalLessons > 0 ? (
          <div className="mt-6 flex items-center gap-4">
            <BrickRow
              className="max-w-sm flex-1"
              total={totalLessons}
              done={completedCount}
              current={unitComplete ? -1 : completedCount}
              size="lg"
              tone={unitComplete ? "success" : "primary"}
              srLabel={`${completedCount} de ${totalLessons} lecciones completadas`}
            />
            <span className="shrink-0 text-[14px] font-bold tabular-nums text-muted-foreground">
              {percent}%
            </span>
          </div>
        ) : null}
      </header>

      {unitComplete ? (
        <div className="mt-8 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-success/25 bg-success-soft/55 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[16px] font-bold text-success">
              Unidad terminada
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
              Dominaste esta unidad. Sigue con lo que viene en tu camino.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0 max-sm:w-full">
            <Link href={`/app/c/${course.slug}`}>
              Ver mi camino
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="sr-only">Lecciones de la unidad</h2>
        <RoadmapLessons
          courseSlug={course.slug}
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
