import type { CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { LoadingLink } from "@/components/ui/loading-link";
import { Progress } from "@/components/ui/progress";
import { StatTile } from "@/components/ui/stat-tile";
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

  // Paralelizar: course/stats/nextLesson son independientes entre sí.
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
      {/* Saludo */}
      <header className="space-y-1.5">
        <ConsoleEyebrow tone="muted">{greeting.toLowerCase().replace(" ", "_")}</ConsoleEyebrow>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-[34px]">
          Hola, {firstName}.
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Hagamos avanzar tu C++ un poco más hoy.
        </p>
      </header>

      {/* Continuar — pieza heroica */}
      {nextLesson ? (
        <ContinueCard xp={stats.totalXp} next={nextLesson} />
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-border bg-surface-2/40 p-8 text-center">
          <h2 className="text-base font-semibold">Sin lecciones aún</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            El contenido se está agregando. Vuelve pronto.
          </p>
        </div>
      )}

      {/* Stats */}
      <section
        aria-labelledby="stats-heading"
        data-stagger
        style={{ "--stagger": "60ms" } as CSSProperties}
        className="grid gap-3 sm:grid-cols-3"
      >
        <h2 id="stats-heading" className="sr-only">
          Tus métricas
        </h2>
        <div
          style={{ "--i": 0 } as CSSProperties}
          className="animate-fade-up"
        >
          <StatTile
            icon={<Zap />}
            label="XP totales"
            value={formatNumber(stats.totalXp)}
            tone="primary"
          />
        </div>
        <div
          style={{ "--i": 1 } as CSSProperties}
          className="animate-fade-up"
        >
          <StatTile
            icon={<Flame />}
            label="Racha actual"
            value={`${stats.currentStreak} días`}
            sub={
              stats.longestStreak > stats.currentStreak
                ? `Mejor: ${stats.longestStreak}`
                : undefined
            }
            tone="warning"
          />
        </div>
        <div
          style={{ "--i": 2 } as CSSProperties}
          className="animate-fade-up"
        >
          <StatTile
            icon={<BookOpen />}
            label="Lecciones"
            value={`${totalCompleted} / ${totalLessons}`}
            sub={`${overallPercent}% completado`}
            tone="success"
          />
        </div>
      </section>

      {/* Tu camino */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tu camino</h2>
            <p className="text-sm text-muted-foreground">
              Avanza unidad por unidad, a tu ritmo.
            </p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {overallPercent}%
            </span>
            <Progress value={overallPercent} size="sm" className="w-40" />
          </div>
        </div>

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
                {u.published ? (
                  <LoadingLink
                    href={`/app/u/${u.slug}`}
                    showHint={false}
                    className="group hover-lift block rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[var(--shadow-md)]"
                  >
                    <UnitCardBody
                      order={u.order}
                      title={u.title}
                      percent={percent}
                      completed={completed}
                      completedCount={u.completedCount}
                      lessonCount={u.lessonCount}
                      published
                    />
                  </LoadingLink>
                ) : (
                  <div className="block rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-5 opacity-70">
                    <UnitCardBody
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

function UnitCardBody({
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Unidad {order.toString().padStart(2, "0")}
          </p>
          <h3 className="mt-1 truncate text-[15px] font-semibold tracking-tight">
            {title}
          </h3>
        </div>
        {published ? (
          completed ? (
            <Badge variant="success" size="sm">
              Completa
            </Badge>
          ) : (
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          )
        ) : (
          <Badge variant="secondary" size="sm">
            Próximo
          </Badge>
        )}
      </div>
      {published ? (
        <div className="mt-4 flex items-center gap-3">
          <Progress
            value={percent}
            size="xs"
            tone={completed ? "success" : "primary"}
            className="flex-1"
          />
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {completedCount}/{lessonCount}
          </span>
        </div>
      ) : null}
    </>
  );
}

function ContinueCard({
  next,
  xp,
}: {
  next: NonNullable<Awaited<ReturnType<typeof findNextLesson>>>;
  xp: number;
}) {
  const isResume = next.status === "in_progress";
  return (
    <div className="group animate-scale-in relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl transition-transform duration-700 group-hover:scale-110"
      />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" size="sm">
              <Sparkles className="size-3" aria-hidden />
              {isResume ? "Continúa donde te quedaste" : "Tu próxima lección"}
            </Badge>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Unidad {next.unitOrder} · {next.unitTitle}
            </span>
          </div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-[28px]">
            {next.lessonTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5 text-primary" aria-hidden />
              Acumulas {formatNumber(xp)} XP
            </span>
            <span className="inline-flex items-center gap-1.5">
              ⏱ {next.estimatedMinutes} min
            </span>
          </div>
        </div>
        <Button asChild size="lg" className="self-start lg:self-auto">
          <LoadingLink
            href={`/app/u/${next.unitSlug}/${next.lessonSlug}`}
            hintClassName="bg-primary-foreground"
          >
            {isResume ? "Continuar lección" : "Empezar lección"}
            <ArrowRight />
          </LoadingLink>
        </Button>
      </div>
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
  // Paralelizamos: pedimos en-progreso Y lecciones completadas a la vez.
  // Si hay en-progreso, devolvemos esa (descartamos completedIds).
  // Si no, usamos completedIds para excluir en la query del "siguiente".
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
