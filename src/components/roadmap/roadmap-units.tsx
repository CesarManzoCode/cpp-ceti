import type { CSSProperties } from "react";
import { Check, GitBranch, Lock, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LoadingLink } from "@/components/ui/loading-link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface RoadmapUnitItem {
  slug: string;
  title: string;
  order: number;
  published: boolean;
  lessonCount: number;
  completedCount: number;
}

export interface RoadmapUnitsProps {
  courseSlug: string;
  units: RoadmapUnitItem[];
}

/**
 * Roadmap del curso completo: cada unidad es un commit principal en
 * `main`. Reutiliza el lenguaje visual del RoadmapLessons pero a una
 * escala superior, con barra de progreso por unidad.
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
    <div className="rounded-[var(--radius-lg)] border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-xs">
          <GitBranch
            className="size-3.5 shrink-0 text-primary"
            aria-hidden
            strokeWidth={2.25}
          />
          <span className="font-mono truncate text-muted-foreground">
            main · cpp-desde-cero
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          {units.length} {units.length === 1 ? "unidad" : "unidades"}
        </span>
      </div>

      <ol
        data-stagger
        style={{ "--stagger": "65ms" } as CSSProperties}
        className="px-5 py-2 sm:px-6"
      >
        {units.map((unit, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === units.length - 1;
          const isHead = idx === headIndex;
          const completed =
            unit.lessonCount > 0 && unit.completedCount === unit.lessonCount;
          const inProgress =
            !completed && unit.completedCount > 0 && unit.published;
          const status: UnitNodeStatus = completed
            ? "completed"
            : inProgress
              ? "in_progress"
              : "not_started";
          const isBlocked = !unit.published || (headIndex !== -1 && idx > headIndex && status === "not_started");
          const percent =
            unit.lessonCount === 0
              ? 0
              : Math.round((unit.completedCount / unit.lessonCount) * 100);
          const hash = mockHash(`unit/${unit.slug}`);
          return (
            <li
              key={unit.slug}
              style={{ "--i": idx } as CSSProperties}
              className="animate-fade-up"
            >
              <UnitNode
                href={unit.published ? `/app/u/${unit.slug}` : undefined}
                hash={hash}
                order={unit.order}
                title={unit.title}
                completedCount={unit.completedCount}
                lessonCount={unit.lessonCount}
                percent={percent}
                status={status}
                isHead={isHead}
                isBlocked={isBlocked}
                published={unit.published}
                showLeadingLine={!isFirst}
                showTrailingLine={!isLast}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type UnitNodeStatus = "completed" | "in_progress" | "not_started";

function findHeadIndex(units: RoadmapUnitItem[]): number {
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const completed = u.lessonCount > 0 && u.completedCount === u.lessonCount;
    if (!completed && u.published) {
      return i;
    }
  }
  return -1;
}

interface UnitNodeProps {
  href: string | undefined;
  hash: string;
  order: number;
  title: string;
  completedCount: number;
  lessonCount: number;
  percent: number;
  status: UnitNodeStatus;
  isHead: boolean;
  isBlocked: boolean;
  published: boolean;
  showLeadingLine: boolean;
  showTrailingLine: boolean;
}

function UnitNode({
  href,
  hash,
  order,
  title,
  completedCount,
  lessonCount,
  percent,
  status,
  isHead,
  isBlocked,
  published,
  showLeadingLine,
  showTrailingLine,
}: UnitNodeProps) {
  const commitLine = unitCommitMessage(status, published, title);
  const body = (
    <div
      className={cn(
        "grid grid-cols-[64px_24px_1fr] items-stretch gap-x-4 rounded-[var(--radius-md)] py-3.5 transition-colors sm:gap-x-5 sm:py-4",
        href && "group hover:bg-surface-2/60",
        isBlocked && "opacity-70",
      )}
    >
      {/* Hash mock + HEAD ribbon */}
      <div className="flex flex-col justify-center pl-1 text-right">
        <span
          className={cn(
            "font-mono text-[11px] tabular-nums leading-tight",
            status === "completed"
              ? "text-success"
              : status === "in_progress"
                ? "text-primary"
                : "text-muted-foreground/70",
          )}
        >
          {hash}
        </span>
        {isHead ? (
          <span className="mt-0.5 inline-block self-end rounded-[3px] bg-primary px-1.5 text-[9px] font-bold uppercase leading-[14px] tracking-wider text-primary-foreground">
            HEAD
          </span>
        ) : null}
      </div>

      {/* Gutter del grafo */}
      <div className="relative flex justify-center">
        {showLeadingLine ? (
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-border"
          />
        ) : null}
        {showTrailingLine ? (
          <span
            aria-hidden
            className="absolute left-1/2 bottom-0 h-1/2 w-px -translate-x-1/2 bg-border"
          />
        ) : null}
        <span
          aria-hidden
          className={cn(
            "relative z-10 mt-2.5 grid size-6 shrink-0 place-items-center rounded-full transition-colors",
            status === "completed" && "bg-success text-success-foreground",
            status === "in_progress" &&
              "border-2 border-primary bg-card text-primary",
            status === "not_started" &&
              "border border-border bg-card text-muted-foreground/60",
            !published && "border-dashed",
          )}
        >
          {status === "completed" ? (
            <Check className="size-3.5" strokeWidth={3} />
          ) : status === "in_progress" ? (
            <>
              <span
                aria-hidden
                className="absolute inset-0 -m-0.5 rounded-full bg-primary/20 animate-pulse-soft"
              />
              <Play
                className="relative size-3 fill-primary text-primary"
                aria-hidden
              />
            </>
          ) : !published ? (
            <Lock className="size-3" aria-hidden />
          ) : (
            <span className="block size-1.5 rounded-full bg-current" />
          )}
        </span>
      </div>

      {/* Contenido */}
      <div className="min-w-0 py-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            unidad {String(order).padStart(2, "0")}
          </p>
          {status === "in_progress" ? (
            <Badge variant="default" size="sm">
              En curso
            </Badge>
          ) : status === "completed" ? (
            <Badge variant="success" size="sm">
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Completa
            </Badge>
          ) : !published ? (
            <Badge variant="secondary" size="sm">
              Próximamente
            </Badge>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-1 text-base font-semibold tracking-tight sm:text-[17px]",
            status === "in_progress" && "text-primary",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1 font-mono text-xs leading-relaxed",
            status === "completed"
              ? "text-success/85"
              : status === "in_progress"
                ? "text-primary/85"
                : "text-muted-foreground/85",
          )}
        >
          {commitLine}
        </p>
        {published ? (
          <div className="mt-3 flex items-center gap-3">
            <Progress
              value={percent}
              size="sm"
              tone={status === "completed" ? "success" : "primary"}
              className="max-w-xs flex-1"
            />
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {completedCount}/{lessonCount}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (!href) {
    return body;
  }

  return (
    <LoadingLink
      href={href}
      showHint={false}
      className="block"
      aria-label={`Unidad ${order}: ${title}`}
    >
      {body}
    </LoadingLink>
  );
}

function mockHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16);
  return hex.padStart(8, "0").slice(0, 7);
}

function unitCommitMessage(
  status: UnitNodeStatus,
  published: boolean,
  title: string,
): string {
  const slugish = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  if (!published) {
    return `pending: ${slugish} — en preparación`;
  }
  if (status === "completed") {
    return `release: ${slugish} ✓ merged`;
  }
  if (status === "in_progress") {
    return `wip: ${slugish} — branch activa`;
  }
  return `todo: ${slugish}`;
}
