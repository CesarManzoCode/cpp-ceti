import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { BracketLabel } from "@/components/ui/bracket-label";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Progress } from "@/components/ui/progress";
import { SectionRule } from "@/components/ui/section-rule";
import { StatTile } from "@/components/ui/stat-tile";
import { StreakFlame } from "@/components/ui/streak-flame";
import { db } from "@/lib/db";
import {
  getDefaultCourse,
  getSidebarUnits,
  getUserStats,
} from "@/lib/courses";
import { getSession } from "@/lib/get-session";
import { formatNumber } from "@/lib/utils";

export const metadata = {
  title: "Mi panel",
};

export default async function AppHomePage() {
  const session = await getSession();
  if (!session?.user) return null;

  const [course, stats, nextLesson] = await Promise.all([
    getDefaultCourse(),
    getUserStats(session.user.id),
    findNextLesson(session.user.id),
  ]);
  const units = course
    ? await getSidebarUnits(course.id, session.user.id)
    : [];

  const totalLessons = units.reduce((sum, u) => sum + u.lessonCount, 0);
  const totalCompleted = units.reduce((sum, u) => sum + u.completedCount, 0);
  const overallPercent =
    totalLessons === 0
      ? 0
      : Math.round((totalCompleted / totalLessons) * 100);

  const firstName = session.user.name.split(" ")[0] ?? session.user.name;
  const greeting = greetingFor(new Date());

  return (
    <div
      data-page-enter
      className="mx-auto max-w-5xl space-y-12 px-5 py-8 sm:px-6 lg:px-8 lg:py-12"
    >
      {/* ───── Greeting block ───── */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <ConsoleEyebrow>
            {greeting.toLowerCase().replace(" ", "_")}
          </ConsoleEyebrow>
          <span aria-hidden className="h-px flex-1 bg-border" />
          <BracketLabel>{firstName.toLowerCase()}</BracketLabel>
        </div>
        <h1 className="font-display text-[40px] leading-[1.02] sm:text-[56px]">
          Hola, {firstName}<span className="text-primary">.</span>
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Hagamos avanzar tu C++ un poco más hoy.
        </p>
      </header>

      {/* ───── Now playing ───── */}
      {nextLesson ? (
        <section className="space-y-5">
          <SectionRule trailing={isResume(nextLesson) ? "resuming" : "ready"}>
            ahora mismo
          </SectionRule>
          <ContinueBlock xp={stats.totalXp} next={nextLesson} />
        </section>
      ) : (
        <section className="space-y-5">
          <SectionRule>ahora mismo</SectionRule>
          <p className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface-2/40 p-6 text-center text-sm text-muted-foreground">
            Sin lecciones publicadas todavía. Vuelve pronto.
          </p>
        </section>
      )}

      {/* ───── Stats report ───── */}
      <section className="space-y-5">
        <SectionRule trailing="day_summary">tu progreso</SectionRule>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
          <StatTile
            label="xp totales"
            value={<AnimatedNumber value={stats.totalXp} />}
            sub={`Acumulados desde día 1`}
            tone="primary"
            icon={<Zap className="size-4" aria-hidden />}
          />
          <StatTile
            label="racha"
            value={
              <>
                <AnimatedNumber value={stats.currentStreak} />
                <span className="ml-1 text-[0.5em] align-top text-muted-foreground">
                  d
                </span>
              </>
            }
            sub={
              stats.longestStreak > stats.currentStreak
                ? `Mejor: ${stats.longestStreak} días`
                : "Mantén el ritmo"
            }
            tone="warning"
            icon={
              <StreakFlame
                streak={stats.currentStreak}
                className="size-4"
              />
            }
          />
          <StatTile
            label="lecciones"
            value={
              <span>
                <AnimatedNumber value={totalCompleted} />
                <span className="text-muted-foreground/50">/{totalLessons}</span>
              </span>
            }
            sub={`${overallPercent}% completado`}
            tone="success"
            icon={<BookOpen className="size-4" aria-hidden />}
          />
        </div>
      </section>

      {/* ───── Path ───── */}
      <section className="space-y-5">
        <SectionRule trailing={`${overallPercent}%`}>tu camino</SectionRule>

        <ul
          data-stagger
          style={{ "--stagger": "45ms" } as CSSProperties}
          className="divide-y divide-border border-y border-border"
        >
          {units.map((u, idx) => {
            const percent =
              u.lessonCount === 0
                ? 0
                : Math.round((u.completedCount / u.lessonCount) * 100);
            const completed = percent === 100;
            return (
              <li
                key={u.slug}
                style={{ "--i": idx } as CSSProperties}
                className="animate-fade-up"
              >
                {u.published ? (
                  <Link
                    href={`/app/u/${u.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-surface-2/40 sm:gap-6 sm:py-5"
                  >
                    <UnitRow
                      order={u.order}
                      title={u.title}
                      percent={percent}
                      completed={completed}
                      completedCount={u.completedCount}
                      lessonCount={u.lessonCount}
                      published
                    />
                  </Link>
                ) : (
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 opacity-50 sm:gap-6 sm:py-5">
                    <UnitRow
                      order={u.order}
                      title={u.title}
                      percent={0}
                      completed={false}
                      completedCount={0}
                      lessonCount={u.lessonCount}
                      published={false}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function UnitRow({
  order,
  title,
  percent,
  completed,
  completedCount,
  lessonCount,
  published,
}: {
  order: number;
  title: string;
  percent: number;
  completed: boolean;
  completedCount: number;
  lessonCount: number;
  published: boolean;
}) {
  return (
    <>
      <span className="font-mono text-[15px] font-bold tabular-nums text-muted-foreground/70 group-hover:text-foreground sm:text-[17px]">
        {order.toString().padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold tracking-tight sm:text-base">
          <span className="text-primary mr-1.5 font-mono">::</span>
          {title}
        </h3>
        {published ? (
          <div className="mt-1.5 flex items-center gap-3">
            <Progress
              value={percent}
              size="xs"
              tone={completed ? "success" : "primary"}
              className="max-w-[140px]"
            />
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {completedCount}/{lessonCount}
            </span>
          </div>
        ) : (
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
            próximo
          </p>
        )}
      </div>

      {published ? (
        completed ? (
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-success">
            ✓ done
          </span>
        ) : (
          <ArrowUpRight className="size-4 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        )
      ) : (
        <span aria-hidden className="text-muted-foreground/40">
          ⏿
        </span>
      )}
    </>
  );
}

function ContinueBlock({
  next,
  xp,
}: {
  next: NonNullable<Awaited<ReturnType<typeof findNextLesson>>>;
  xp: number;
}) {
  const resume = isResume(next);
  return (
    <div className="group animate-scale-in relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/12 blur-3xl transition-transform duration-700 group-hover:scale-110"
      />
      <div className="relative flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <BracketLabel tone="primary">
              {resume ? "resuming" : "next"} :: unidad_
              {next.unitOrder.toString().padStart(2, "0")}
            </BracketLabel>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {next.unitTitle}
            </span>
          </div>
          <h2 className="font-display text-balance text-[26px] leading-[1.05] sm:text-[34px]">
            {next.lessonTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3 text-primary" aria-hidden />
              acumulas {formatNumber(xp)} xp
            </span>
            <span aria-hidden>·</span>
            <span>{next.estimatedMinutes} min</span>
          </div>
        </div>
        <Button asChild size="xl" className="self-start lg:self-auto">
          <Link href={`/app/u/${next.unitSlug}/${next.lessonSlug}`}>
            {resume ? "Continuar" : "Empezar"}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function isResume(
  next: NonNullable<Awaited<ReturnType<typeof findNextLesson>>>,
): boolean {
  return next.status === "in_progress";
}

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

async function findNextLesson(userId: string) {
  const [inProgress, completedProgress] = await Promise.all([
    db.userLessonProgress.findFirst({
      where: { userId, status: "in_progress" },
      orderBy: { startedAt: "desc" },
      include: { lesson: { include: { unit: true } } },
    }),
    db.userLessonProgress.findMany({
      where: { userId, status: "completed" },
      select: { lessonId: true },
    }),
  ]);

  if (inProgress) {
    return {
      lessonSlug: inProgress.lesson.slug,
      lessonTitle: inProgress.lesson.title,
      unitSlug: inProgress.lesson.unit.slug,
      unitTitle: inProgress.lesson.unit.title,
      unitOrder: inProgress.lesson.unit.order,
      estimatedMinutes: inProgress.lesson.estimatedMinutes,
      status: "in_progress" as const,
    };
  }

  const completedIds = completedProgress.map((p) => p.lessonId);
  const next = await db.lesson.findFirst({
    where: {
      published: true,
      unit: { published: true },
      id: { notIn: completedIds.length ? completedIds : undefined },
    },
    orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    include: { unit: true },
  });

  if (!next) return null;

  return {
    lessonSlug: next.slug,
    lessonTitle: next.title,
    unitSlug: next.unit.slug,
    unitTitle: next.unit.title,
    unitOrder: next.unit.order,
    estimatedMinutes: next.estimatedMinutes,
    status: "not_started" as const,
  };
}
