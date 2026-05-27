import type { CSSProperties } from "react";
import { Check, GitBranch, Lock, Play, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LoadingLink } from "@/components/ui/loading-link";
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
 * Roadmap estilo "git commit graph" para las lecciones de una unidad.
 * Lineal vertical: cada lección es un commit. El primer not_started
 * (después del último completado/in_progress) queda como HEAD, los
 * posteriores quedan visualmente bloqueados.
 */
export function RoadmapLessons({
  unitSlug,
  unitOrder,
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

  // El primer not_started después del último completado/in_progress es HEAD.
  // Los siguientes quedan "bloqueados" visualmente (siguen siendo clickables,
  // pero el estilo invita a respetar el orden).
  const headIndex = findHeadIndex(lessons);
  const branchLabel = `unidad-${String(unitOrder).padStart(2, "0")}/${unitSlug}`;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card">
      {/* Branch header — anclaje del grafo */}
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-xs">
          <GitBranch
            className="size-3.5 shrink-0 text-primary"
            aria-hidden
            strokeWidth={2.25}
          />
          <span className="font-mono truncate text-muted-foreground">
            {branchLabel}
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          {lessons.length} {lessons.length === 1 ? "commit" : "commits"}
        </span>
      </div>

      <ol
        data-stagger
        style={{ "--stagger": "55ms" } as CSSProperties}
        className="relative px-5 py-2 sm:px-6"
      >
        {lessons.map((lesson, idx) => {
          const isLast = idx === lessons.length - 1;
          const isFirst = idx === 0;
          const isHead = idx === headIndex;
          const isBlocked = headIndex !== -1 && idx > headIndex;
          const hash = mockHash(`${unitSlug}/${lesson.slug}`);
          return (
            <li
              key={lesson.id}
              style={{ "--i": idx } as CSSProperties}
              className="animate-fade-up"
            >
              <RoadmapNode
                href={`/app/u/${unitSlug}/${lesson.slug}`}
                hash={hash}
                index={lesson.order}
                title={lesson.title}
                description={lesson.description}
                xpReward={lesson.xpReward}
                estimatedMinutes={lesson.estimatedMinutes}
                stepCount={lesson.stepCount}
                status={lesson.status}
                isHead={isHead}
                isBlocked={isBlocked}
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

function findHeadIndex(lessons: RoadmapLessonItem[]): number {
  for (let i = 0; i < lessons.length; i++) {
    if (lessons[i].status !== "completed" && lessons[i].status !== "in_progress") {
      return i;
    }
  }
  return -1;
}

interface NodeProps {
  href: string;
  hash: string;
  index: number;
  title: string;
  description: string | null;
  xpReward: number;
  estimatedMinutes: number;
  stepCount: number;
  status: RoadmapLessonStatus;
  isHead: boolean;
  isBlocked: boolean;
  showLeadingLine: boolean;
  showTrailingLine: boolean;
}

function RoadmapNode({
  href,
  hash,
  index,
  title,
  description,
  xpReward,
  estimatedMinutes,
  stepCount,
  status,
  isHead,
  isBlocked,
  showLeadingLine,
  showTrailingLine,
}: NodeProps) {
  void index;
  const commitLine = commitMessageFor(status, isHead, isBlocked, title);

  return (
    <LoadingLink
      href={href}
      showHint={false}
      className={cn(
        "group relative grid grid-cols-[64px_24px_1fr] items-stretch gap-x-4 rounded-[var(--radius-md)] py-3 transition-colors sm:gap-x-5 sm:py-3.5",
        "hover:bg-surface-2/60",
        isBlocked && "opacity-70 hover:opacity-100",
      )}
      aria-label={`Lección ${index}: ${title}`}
    >
      {/* Columna 1: hash mock (font-mono, tono muted) */}
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

      {/* Columna 2: gutter del grafo (línea vertical + nodo) */}
      <div className="relative flex justify-center">
        {/* Línea vertical superior */}
        {showLeadingLine ? (
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-border"
          />
        ) : null}
        {/* Línea vertical inferior */}
        {showTrailingLine ? (
          <span
            aria-hidden
            className="absolute left-1/2 bottom-0 h-1/2 w-px -translate-x-1/2 bg-border"
          />
        ) : null}
        {/* Nodo del commit (círculo) */}
        <span
          aria-hidden
          className={cn(
            "relative z-10 mt-2 grid size-5 shrink-0 place-items-center rounded-full transition-colors",
            status === "completed" && "bg-success text-success-foreground",
            status === "in_progress" &&
              "border-2 border-primary bg-card text-primary",
            status === "not_started" &&
              "border border-border bg-card text-muted-foreground/60",
            isBlocked && "border-dashed",
          )}
        >
          {status === "completed" ? (
            <Check className="size-3" strokeWidth={3} />
          ) : status === "in_progress" ? (
            <>
              <span
                aria-hidden
                className="absolute inset-0 -m-0.5 rounded-full bg-primary/20 animate-pulse-soft"
              />
              <Play
                className="relative size-2.5 fill-primary text-primary"
                aria-hidden
              />
            </>
          ) : isBlocked ? (
            <Lock className="size-2.5" aria-hidden />
          ) : (
            <span className="block size-1.5 rounded-full bg-current" />
          )}
        </span>
      </div>

      {/* Columna 3: título + commit message + meta */}
      <div className="min-w-0 py-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3
            className={cn(
              "text-[15px] font-semibold tracking-tight sm:text-base",
              status === "in_progress" && "text-primary",
              isBlocked && "text-foreground/80",
            )}
          >
            {title}
          </h3>
          {status === "in_progress" ? (
            <Badge variant="default" size="sm">
              En curso
            </Badge>
          ) : status === "completed" ? (
            <Badge variant="success" size="sm">
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Resuelta
            </Badge>
          ) : null}
        </div>
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
        {description ? (
          <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
            <Zap className="size-3 text-primary/80" aria-hidden />
            +{xpReward} XP
          </span>
          <span aria-hidden className="text-muted-foreground/40">
            ·
          </span>
          <span className="font-mono tabular-nums">
            {estimatedMinutes} min
          </span>
          <span aria-hidden className="text-muted-foreground/40">
            ·
          </span>
          <span className="font-mono tabular-nums">
            {stepCount} {stepCount === 1 ? "paso" : "pasos"}
          </span>
        </div>
      </div>
    </LoadingLink>
  );
}

/**
 * Genera un hash hex determinístico de 7 caracteres a partir de un input.
 * Mock de un hash de git — no es criptográfico, solo estético.
 */
function mockHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Forzamos positivo y truncamos a 7 hex
  const hex = (h >>> 0).toString(16);
  return hex.padStart(8, "0").slice(0, 7);
}

function commitMessageFor(
  status: RoadmapLessonStatus,
  isHead: boolean,
  isBlocked: boolean,
  title: string,
): string {
  const slugish = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  if (status === "completed") {
    return `feat: ${slugish} ✓ merged`;
  }
  if (status === "in_progress") {
    return `wip: ${slugish} — sigue donde te quedaste`;
  }
  if (isHead) {
    return `todo: ${slugish} — tu próximo commit`;
  }
  if (isBlocked) {
    return `pending: ${slugish}`;
  }
  return `todo: ${slugish}`;
}
