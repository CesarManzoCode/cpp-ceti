import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { Readout, ReadoutBar } from "@/components/ui/readout";
import { SectionRule } from "@/components/ui/section-rule";
import { StreakFlame } from "@/components/ui/streak-flame";
import { InlineCodeText } from "@/components/shared/inline-code-text";
import { ActivityFeed } from "@/features/friends/components/activity-feed";
import { getActivityFeed, getFriends } from "@/features/friends/queries";
import { RoadmapUnits } from "@/features/roadmap/components/roadmap-units";
import {
  findNextLesson,
  getDefaultCourse,
  getRoadmapUnits,
} from "@/features/roadmap/queries";
import { getUserStats } from "@/lib/streak";
import { getSession } from "@/lib/get-session";
import { pluralize } from "@/lib/utils";
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
  const units = course ? await getRoadmapUnits(course.id, session.user.id) : [];

  const totalLessons = units.reduce((sum, u) => sum + u.lessonCount, 0);
  const totalCompleted = units.reduce((sum, u) => sum + u.completedCount, 0);
  const overallPercent =
    totalLessons === 0 ? 0 : Math.round((totalCompleted / totalLessons) * 100);

  const firstName = session.user.name.split(" ")[0] ?? session.user.name;

  return (
    <div
      data-page-enter
      className="mx-auto max-w-4xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9"
    >
      <p className="text-sm text-muted-foreground">
        {greetingFor(new Date())}, {firstName}.
      </p>

      {/* Lo único que importa al abrir: retomar el curso donde se quedó.
          Va arriba, sin tarjeta y con la tipografía más grande de la
          página — el resto del panel es contexto de esta acción. */}
      <div className="mt-5">
        {nextLesson ? (
          <ContinuePanel next={nextLesson} />
        ) : totalLessons > 0 ? (
          <AllDonePanel />
        ) : (
          <EmptyCoursePanel />
        )}
      </div>

      <ReadoutBar className="mt-9">
        <Readout
          label="XP totales"
          value={<AnimatedNumber value={stats.totalXp} />}
          sub={
            stats.totalXp === 0
              ? "Completa tu primera lección"
              : "Cada lección vale 20–30 XP"
          }
        />
        <Readout
          label="Racha"
          mark={<StreakFlame streak={stats.currentStreak} className="size-3.5" />}
          value={
            <>
              <AnimatedNumber value={stats.currentStreak} />
              <span className="ml-1 text-base text-muted-foreground">
                {pluralize(stats.currentStreak, "día", "días")}
              </span>
            </>
          }
          sub={
            stats.currentStreak === 0
              ? "Empieza tu racha hoy"
              : stats.longestStreak > stats.currentStreak
                ? `Tu récord: ${stats.longestStreak} días`
                : "Es tu mejor racha"
          }
        />
        <Readout
          className="col-span-2 sm:col-span-1"
          label="Lecciones"
          value={
            <>
              <AnimatedNumber value={totalCompleted} />
              <span className="text-muted-foreground/70">/{totalLessons}</span>
            </>
          }
          sub={`${overallPercent}% del curso`}
        />
      </ReadoutBar>

      <section className="mt-10">
        <SectionRule trailing={`${overallPercent}% completado`}>
          Tu camino
        </SectionRule>
        <div className="mt-4">
          <RoadmapUnits courseSlug={course?.slug ?? ""} units={units} />
        </div>
      </section>

      <section className="mt-10">
        <SectionRule
          trailing={
            friends.length > 0 ? (
              <Link
                href="/app/amigos"
                className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
              >
                Ver todos
              </Link>
            ) : undefined
          }
        >
          Actividad de tus amigos
        </SectionRule>
        <div className="mt-4">
          {friends.length === 0 ? (
            <FriendsEmpty />
          ) : (
            <ActivityFeed events={feed} emptyHint="friends" />
          )}
        </div>
      </section>
    </div>
  );
}

function ContinuePanel({ next }: { next: NextLesson }) {
  const resume = next.status === "in_progress";
  const href = `/app/u/${next.unitSlug}/${next.lessonSlug}`;

  return (
    <section aria-labelledby="continuar-titulo" className="border-y border-border py-6">
      <p className="label-micro text-primary">
        {resume ? "Continúa donde te quedaste" : "Tu próxima lección"}
      </p>

      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h1
            id="continuar-titulo"
            className="text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[36px]"
          >
            <Link
              href={href}
              className="rounded-[var(--radius-xs)] decoration-border-strong decoration-2 underline-offset-[6px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <InlineCodeText>{next.lessonTitle}</InlineCodeText>
            </Link>
          </h1>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            <span>
              Unidad {String(next.unitOrder).padStart(2, "0")} · {next.unitTitle}
            </span>
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span>{next.estimatedMinutes} min</span>
          </p>
        </div>

        <Button asChild size="xl" className="shrink-0 max-sm:w-full">
          <Link href={href}>
            {resume ? "Continuar lección" : "Empezar lección"}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function AllDonePanel() {
  return (
    <section className="border-y border-border py-6">
      <p className="label-micro text-success">Curso al día</p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div>
          <h1 className="text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[32px]">
            Completaste todas las lecciones disponibles.
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Sigue afilando lo aprendido con ejercicios de práctica mientras
            llega contenido nuevo.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0 max-sm:w-full">
          <Link href="/app/ejercicios">
            Practicar ejercicios
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function EmptyCoursePanel() {
  return (
    <section className="border-y border-border py-6">
      <p className="label-micro text-muted-foreground">Sin contenido todavía</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[28px]">
        Aún no hay lecciones publicadas.
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Estamos preparando más contenido. Mientras tanto, puedes practicar con
        los ejercicios sueltos.
      </p>
      <Button asChild variant="outline" size="lg" className="mt-5 max-sm:w-full">
        <Link href="/app/ejercicios">
          Ver ejercicios
          <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}

function FriendsEmpty() {
  return (
    <div className="flex flex-col items-start gap-4 border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">Agrega compañeros del CETI</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Cuando acepten tu solicitud verás aquí en qué van.
        </p>
      </div>
      <Button asChild variant="outline" size="sm" className="shrink-0 max-sm:w-full">
        <Link href="/app/amigos?tab=buscar">
          <UserPlus />
          Buscar amigos
        </Link>
      </Button>
    </div>
  );
}

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}
