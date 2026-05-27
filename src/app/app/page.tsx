import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
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
      className="mx-auto max-w-5xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      {/* Saludo cálido */}
      <header className="space-y-1.5">
        <p className="text-sm text-muted-foreground">
          {greeting}, {firstName} 👋
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Vamos a programar un rato.
        </h1>
      </header>

      {/* Continuar — hero card */}
      {nextLesson ? (
        <ContinueHero next={nextLesson} />
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-border bg-surface-2/40 p-10 text-center">
          <BookOpen
            className="mx-auto size-8 text-muted-foreground/50"
            aria-hidden
          />
          <h2 className="mt-3 text-base font-semibold">
            Sin lecciones publicadas aún
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estamos preparando más contenido. Vuelve pronto.
          </p>
        </div>
      )}

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={<Zap aria-hidden />}
          label="XP totales"
          value={<AnimatedNumber value={stats.totalXp} />}
          sub="Cada lección vale 20–30 XP"
          tone="primary"
        />
        <StatTile
          icon={<StreakFlame streak={stats.currentStreak} className="size-6" />}
          label="Racha actual"
          value={
            <>
              <AnimatedNumber value={stats.currentStreak} />
              <span className="ml-1 text-base font-medium text-muted-foreground">
                {stats.currentStreak === 1 ? "día" : "días"}
              </span>
            </>
          }
          sub={
            stats.longestStreak > stats.currentStreak
              ? `Tu récord: ${stats.longestStreak} días`
              : "¡Sigue así!"
          }
          tone="warning"
        />
        <StatTile
          icon={<BookOpen aria-hidden />}
          label="Lecciones"
          value={
            <>
              <AnimatedNumber value={totalCompleted} />
              <span className="text-muted-foreground/60">/{totalLessons}</span>
            </>
          }
          sub={`${overallPercent}% del curso`}
          tone="success"
        />
      </section>

      {/* Tu camino */}
      <section className="space-y-4">
        <SectionRule trailing={`${overallPercent}% completado`}>
          Tu camino
        </SectionRule>

        <ul
          data-stagger
          style={{ "--stagger": "55ms" } as CSSProperties}
          className="grid gap-3 sm:grid-cols-2"
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
                <UnitCard
                  href={u.published ? `/app/u/${u.slug}` : undefined}
                  order={u.order}
                  title={u.title}
                  percent={percent}
                  completed={completed}
                  completedCount={u.completedCount}
                  lessonCount={u.lessonCount}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function ContinueHero({
  next,
}: {
  next: NonNullable<Awaited<ReturnType<typeof findNextLesson>>>;
}) {
  const resume = next.status === "in_progress";
  const href = `/app/u/${next.unitSlug}/${next.lessonSlug}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[var(--radius-2xl)] border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-[var(--shadow-md)] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[var(--shadow-lg)] sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl transition-transform duration-700 group-hover:scale-110"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3" aria-hidden />
            {resume ? "Continúa donde te quedaste" : "Tu próxima lección"}
          </div>
          <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {next.lessonTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              Unidad {next.unitOrder} · {next.unitTitle}
            </span>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span>⏱ {next.estimatedMinutes} min</span>
          </div>
        </div>
        <Button size="lg" className="self-start lg:self-auto" tabIndex={-1}>
          {resume ? "Continuar" : "Empezar"}
          <ArrowRight />
        </Button>
      </div>
    </Link>
  );
}

function UnitCard({
  href,
  order,
  title,
  percent,
  completed,
  completedCount,
  lessonCount,
}: {
  href?: string;
  order: number;
  title: string;
  percent: number;
  completed: boolean;
  completedCount: number;
  lessonCount: number;
}) {
  const locked = !href;
  const body = (
    <div className="flex items-start gap-4">
      <div
        className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ${
          completed
            ? "bg-success-soft text-success ring-success/25"
            : locked
              ? "bg-surface-2 text-muted-foreground ring-border"
              : "bg-primary/12 text-primary ring-primary/20"
        }`}
      >
        {locked ? (
          <Lock className="size-5" aria-hidden />
        ) : completed ? (
          <Check className="size-5" strokeWidth={3} aria-hidden />
        ) : (
          <span className="font-mono text-sm font-bold tabular-nums">
            {order.toString().padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Unidad {order}
          </p>
          {!locked ? (
            <ChevronRight
              className="size-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden
            />
          ) : (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              próximo
            </span>
          )}
        </div>
        <h3 className="mt-1 truncate text-base font-semibold leading-snug tracking-tight">
          {title}
        </h3>
        {!locked ? (
          <div className="mt-3 flex items-center gap-3">
            <Progress
              value={percent}
              size="sm"
              tone={completed ? "success" : "primary"}
              className="flex-1"
            />
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {completedCount}/{lessonCount}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-xs)] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-md)]"
      >
        {body}
      </Link>
    );
  }
  return (
    <div className="block rounded-[var(--radius-xl)] border border-dashed border-border bg-surface-2/40 p-5 opacity-65">
      {body}
    </div>
  );
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

