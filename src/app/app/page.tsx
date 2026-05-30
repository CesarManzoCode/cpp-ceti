import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Sparkles, UserPlus, Users, Zap } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { SectionRule } from "@/components/ui/section-rule";
import { StatTile } from "@/components/ui/stat-tile";
import { StreakFlame } from "@/components/ui/streak-flame";
import { ActivityFeed } from "@/features/friends/components/activity-feed";
import {
  getActivityFeed,
  getFriends,
} from "@/features/friends/queries";
import { RoadmapUnits } from "@/features/roadmap/components/roadmap-units";
import {
  findNextLesson,
  getDefaultCourse,
  getRoadmapUnits,
} from "@/features/roadmap/queries";
import { getUserStats } from "@/lib/streak";
import { getSession } from "@/lib/get-session";
import type { NextLesson } from "@/features/roadmap/types";

export const metadata = {
  title: "Mi panel",
};

export default async function AppHomePage() {
  const session = await getSession();
  if (!session?.user) return null;

  const [course, stats, nextLesson, friends, feed] = await Promise.all([
    getDefaultCourse(),
    getUserStats(session.user.id),
    findNextLesson(session.user.id),
    getFriends(session.user.id),
    getActivityFeed(session.user.id, 5),
  ]);
  const units = course
    ? await getRoadmapUnits(course.id, session.user.id)
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
      <header className="space-y-1.5">
        <p className="text-sm text-muted-foreground">
          {greeting}, {firstName}.
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-[36px]">
          Vamos a{" "}
          <span className="text-gradient-primary">programar un rato.</span>
        </h1>
      </header>

      {nextLesson ? (
        <ContinueHero next={nextLesson} />
      ) : totalLessons > 0 ? (
        <AllDoneHero />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-10 text-center">
          <BookOpen
            className="mx-auto size-8 text-muted-foreground/50"
            aria-hidden
          />
          <h2 className="mt-3 text-base font-semibold">
            Sin lecciones publicadas aún
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Estamos preparando más contenido. Mientras tanto, puedes practicar
            con los ejercicios.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/app/ejercicios">
              Ver ejercicios
              <ArrowRight />
            </Link>
          </Button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={<Zap aria-hidden />}
          label="XP totales"
          value={<AnimatedNumber value={stats.totalXp} />}
          sub={
            stats.totalXp === 0
              ? "Completa tu primera lección"
              : "Cada lección vale 20–30 XP"
          }
          tone="primary"
        />
        <StatTile
          icon={<StreakFlame streak={stats.currentStreak} className="size-5" />}
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
            stats.currentStreak === 0
              ? "Empieza tu racha hoy"
              : stats.longestStreak > stats.currentStreak
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

      <section className="space-y-4">
        <SectionRule trailing={`${overallPercent}% completado`}>
          Tu camino
        </SectionRule>

        <RoadmapUnits courseSlug={course?.slug ?? ""} units={units} />
      </section>

      <section className="space-y-4">
        <SectionRule
          trailing={
            friends.length > 0 ? (
              <Link
                href="/app/amigos"
                className="font-medium text-foreground hover:underline"
              >
                Ver todos →
              </Link>
            ) : undefined
          }
        >
          Actividad de tus amigos
        </SectionRule>
        {friends.length === 0 ? (
          <FriendsEmptyHero />
        ) : (
          <ActivityFeed events={feed} emptyHint="friends" />
        )}
      </section>
    </div>
  );
}

function FriendsEmptyHero() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-2/40 p-6 text-center sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/8 to-transparent"
      />
      <div className="relative">
        <div className="mx-auto inline-grid size-11 place-items-center rounded-[var(--radius-md)] bg-[linear-gradient(135deg,var(--primary),var(--brand-2))] text-primary-foreground shadow-[0_6px_18px_-6px_var(--brand-glow)]">
          <Users className="size-5" aria-hidden />
        </div>
        <p className="mt-3 text-sm font-semibold tracking-tight">
          Agrega compañeros del CETI
        </p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
          Cuando aceptes solicitudes verás aquí su progreso en tiempo real.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/app/amigos?tab=buscar">
            <UserPlus />
            Buscar amigos
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ContinueHero({ next }: { next: NextLesson }) {
  const resume = next.status === "in_progress";
  const href = `/app/u/${next.unitSlug}/${next.lessonSlug}`;

  return (
    <Link
      href={href}
      className="group gradient-border relative block overflow-hidden rounded-[var(--radius-xl)] bg-card p-6 shadow-[var(--shadow-md)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-8"
    >
      {/* Aurora corner — sólo en el card, no en toda la página */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gradient-to-br from-primary/25 to-[color:var(--brand-2)]/20 opacity-70 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Shine top */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="eyebrow inline-flex items-center gap-1.5 text-primary">
            <Sparkles className="size-3" aria-hidden />
            {resume ? "Continúa donde te quedaste" : "Tu próxima lección"}
          </p>
          <h2 className="text-balance text-[22px] font-bold leading-tight tracking-[-0.025em] sm:text-[28px]">
            {next.lessonTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="truncate">
              Unidad {next.unitOrder} · {next.unitTitle}
            </span>
            <span aria-hidden className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {next.estimatedMinutes} min
            </span>
          </div>
        </div>
        <span className="glow-primary inline-flex rounded-[var(--radius-md)]">
          <Button
            size="lg"
            variant="glow"
            className="w-full group-hover:translate-x-0.5 sm:w-auto"
            tabIndex={-1}
            aria-hidden
          >
            {resume ? "Continuar" : "Empezar"}
            <ArrowRight />
          </Button>
        </span>
      </div>
    </Link>
  );
}

function AllDoneHero() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-success/20 bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-success/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="eyebrow inline-flex items-center gap-1.5 text-success">
            <Sparkles className="size-3.5" aria-hidden />
            Curso al día
          </p>
          <h2 className="text-balance text-[22px] font-bold leading-tight tracking-[-0.02em] sm:text-[26px]">
            Completaste todas las lecciones disponibles.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Sigue afilando lo aprendido con ejercicios de práctica mientras
            llega contenido nuevo.
          </p>
        </div>
        <Button asChild size="lg" className="self-start sm:self-auto">
          <Link href="/app/ejercicios">
            Practicar
            <ArrowRight />
          </Link>
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
