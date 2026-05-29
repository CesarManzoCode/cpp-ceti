import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { RoadmapUnit } from "@/features/roadmap/types";

export interface RoadmapUnitsProps {
  courseSlug: string;
  units: RoadmapUnit[];
}

/**
 * Roadmap del curso: cada unidad es una fila clara con número,
 * título, progreso y estado. Sin metáfora de git — sobrio, editorial.
 */
export function RoadmapUnits({ courseSlug, units }: RoadmapUnitsProps) {
  void courseSlug;

  if (units.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Aún no hay unidades publicadas en el curso.
        </p>
      </div>
    );
  }

  const headIndex = findHeadIndex(units);

  return (
    <ol className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      {units.map((unit, idx) => {
        const completed =
          unit.lessonCount > 0 && unit.completedCount === unit.lessonCount;
        const inProgress =
          !completed && unit.completedCount > 0 && unit.published;
        const isCurrent = idx === headIndex && unit.published;
        const status: UnitStatus = completed
          ? "completed"
          : inProgress
            ? "in_progress"
            : "not_started";
        const percent =
          unit.lessonCount === 0
            ? 0
            : Math.round((unit.completedCount / unit.lessonCount) * 100);

        return (
          <li
            key={unit.slug}
            className="border-t border-border/70 first:border-t-0"
          >
            <UnitRow
              href={unit.published ? `/app/u/${unit.slug}` : undefined}
              order={unit.order}
              title={unit.title}
              completedCount={unit.completedCount}
              lessonCount={unit.lessonCount}
              percent={percent}
              status={status}
              isCurrent={isCurrent}
              published={unit.published}
            />
          </li>
        );
      })}
    </ol>
  );
}

type UnitStatus = "completed" | "in_progress" | "not_started";

function findHeadIndex(units: RoadmapUnit[]): number {
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const completed = u.lessonCount > 0 && u.completedCount === u.lessonCount;
    if (!completed && u.published) {
      return i;
    }
  }
  return -1;
}

interface UnitRowProps {
  href?: string;
  order: number;
  title: string;
  completedCount: number;
  lessonCount: number;
  percent: number;
  status: UnitStatus;
  isCurrent: boolean;
  published: boolean;
}

function UnitRow({
  href,
  order,
  title,
  completedCount,
  lessonCount,
  percent,
  status,
  isCurrent,
  published,
}: UnitRowProps) {
  const inner = (
    <div
      className={cn(
        "group flex items-center gap-5 p-5 transition-colors sm:p-6",
        href && "hover:bg-surface-2/60",
        !published && "opacity-70",
      )}
    >
      <UnitBadge
        order={order}
        status={status}
        published={published}
        isCurrent={isCurrent}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="eyebrow text-muted-foreground">
            Unidad {String(order).padStart(2, "0")}
          </p>
          {status === "in_progress" ? (
            <span className="eyebrow text-primary">· En curso</span>
          ) : isCurrent ? (
            <span className="eyebrow text-primary">· Siguiente</span>
          ) : null}
          {status === "completed" ? (
            <span className="eyebrow text-success">· Completada</span>
          ) : null}
          {!published ? (
            <span className="eyebrow text-muted-foreground/80">
              · Próximamente
            </span>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-1 text-[17px] font-semibold tracking-tight sm:text-lg",
            (isCurrent || status === "in_progress") && "text-primary",
          )}
        >
          {title}
        </h3>
        {published ? (
          <div className="mt-3 flex items-center gap-3">
            <Progress
              value={percent}
              size="sm"
              tone={status === "completed" ? "success" : "primary"}
              className="max-w-[220px] flex-1"
            />
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {completedCount}/{lessonCount}
            </span>
          </div>
        ) : null}
      </div>

      {href ? (
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-foreground sm:text-muted-foreground/60"
          aria-hidden
        />
      ) : null}
    </div>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      aria-label={`Unidad ${order}: ${title}`}
    >
      {inner}
    </Link>
  );
}

function UnitBadge({
  order,
  status,
  published,
  isCurrent,
}: {
  order: number;
  status: UnitStatus;
  published: boolean;
  isCurrent: boolean;
}) {
  if (!published) {
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] border border-dashed border-border bg-surface-2 text-muted-foreground/70">
        <Lock className="size-4" aria-hidden />
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-success text-success-foreground">
        <Check className="size-5" strokeWidth={3} aria-hidden />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] font-mono text-[13px] font-bold tabular-nums",
        status === "in_progress"
          ? "bg-primary text-primary-foreground"
          : isCurrent
            ? "bg-primary-soft text-primary-soft-foreground ring-1 ring-inset ring-primary/30"
            : "bg-surface-2 text-foreground/70",
      )}
    >
      {String(order).padStart(2, "0")}
    </span>
  );
}
