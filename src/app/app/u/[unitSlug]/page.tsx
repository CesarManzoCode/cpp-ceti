import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Progress } from "@/components/ui/progress";
import { RoadmapLessons } from "@/components/roadmap/roadmap-lessons";
import { getDefaultCourse } from "@/lib/courses";
import { getUnitBySlug } from "@/lib/lessons";
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
      className="mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <Button asChild size="sm" variant="ghost" className="-ml-2.5 self-start">
        <Link href="/app">
          <ChevronLeft />
          Inicio
        </Link>
      </Button>

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <ConsoleEyebrow tone="primary">
            Unidad {unit.order.toString().padStart(2, "0")}
          </ConsoleEyebrow>
          {unitComplete ? (
            <Badge variant="success" size="sm">
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Completa
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
