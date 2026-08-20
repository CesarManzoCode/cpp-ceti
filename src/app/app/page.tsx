import Link from "next/link";
import { ArrowRight, Clock, Sparkles, UserPlus, Zap } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { BrickColumn, BrickRow } from "@/components/ui/bricks";
import { Button } from "@/components/ui/button";
import { LevelBar } from "@/components/ui/level-bar";
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
import type { NextLesson, RoadmapUnit } from "@/features/roadmap/types";

export const metadata = {
  title: "Inicio",
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
  const currentUnit = nextLesson
    ? (units.find((u) => u.slug === nextLesson.unitSlug) ?? null)
    : null;

  return (
    <div
      data-page-enter
      className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <p className="text-[15px] font-medium text-muted-foreground">
        {greetingFor(new Date())}, {firstName}.
      </p>

      <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-10">
        <div className="min-w-0">
          {nextLesson ? (
            <ContinuePanel next={nextLesson} unit={currentUnit} />
          ) : totalLessons > 0 ? (
            <AllDonePanel />
          ) : (
            <EmptyCoursePanel />
          )}

          <section className="mt-10">
            <SectionRule
              trailing={`${totalCompleted}/${totalLessons} lecciones · ${overallPercent}%`}
            >
              Tu camino
            </SectionRule>
            <p className="mt-1.5 max-w-[58ch] text-[14px] leading-relaxed text-muted-foreground">
              Cada bloque de la columna es una lección. Los sólidos ya los
              colocaste.
            </p>
            <div className="mt-6">
              <RoadmapUnits courseSlug={course?.slug ?? ""} units={units} />
            </div>
          </section>
        </div>

        {/* Columna de contexto: apoya la acción principal, no compite. */}
        <aside className="flex min-w-0 flex-col gap-8">
          <section>
            <SectionRule>Tu progreso</SectionRule>
            <div className="mt-4 flex flex-col gap-3">
              <LevelBar totalXp={stats.totalXp} />

              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  icon={
                    <StreakFlame
                      streak={stats.currentStreak}
                      className="size-5"
                    />
                  }
                  label="Racha"
                  value={
                    <>
                      <AnimatedNumber value={stats.currentStreak} />
                      <span className="ml-1 text-[15px] font-semibold text-muted-foreground">
                        {pluralize(stats.currentStreak, "día", "días")}
                      </span>
                    </>
                  }
                  hint={
                    stats.currentStreak === 0
                      ? "Empieza hoy"
                      : stats.longestStreak > stats.currentStreak
                        ? `Récord: ${stats.longestStreak}`
                        : "Tu mejor racha"
                  }
                />
                <StatTile
                  icon={<Zap className="size-5 text-warning" aria-hidden />}
                  label="XP"
                  value={<AnimatedNumber value={stats.totalXp} />}
                  hint={
                    stats.totalXp === 0
                      ? "Tu primera lección"
                      : "20–30 por lección"
                  }
                />
              </div>
            </div>
          </section>

          <section>
            <SectionRule
              trailing={
                friends.length > 0 ? (
                  <Link
                    href="/app/amigos"
                    className="font-semibold text-primary hover:underline"
                  >
                    Ver todos
                  </Link>
                ) : undefined
              }
            >
              Tus amigos
            </SectionRule>
            <div className="mt-4">
              {friends.length === 0 ? (
                <FriendsEmpty />
              ) : (
                <ActivityFeed events={feed} emptyHint="friends" />
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/**
 * La acción principal de toda la aplicación. Es la pieza más grande,
 * la única con el azul del producto de fondo y la única con un botón
 * sólido de tamaño XL. Nada más en la portada compite con ella.
 */
function ContinuePanel({
  next,
  unit,
}: {
  next: NextLesson;
  unit: RoadmapUnit | null;
}) {
  const resume = next.status === "in_progress";
  const href = `/app/u/${next.unitSlug}/${next.lessonSlug}`;
  const lessonNumber = unit ? unit.completedCount + 1 : null;

  return (
    <section
      aria-labelledby="continuar-titulo"
      className="overflow-hidden rounded-[var(--radius-xl)] border border-primary/25 bg-primary-tint shadow-[var(--shadow-md)]"
    >
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.07em] text-primary-soft-foreground">
            <Sparkles className="size-4" aria-hidden />
            {resume ? "Continúa donde te quedaste" : "Tu próxima lección"}
          </p>

          <p className="mt-4 text-[14px] font-bold text-primary-soft-foreground">
            Unidad {next.unitOrder} · {next.unitTitle}
          </p>

          <h1
            id="continuar-titulo"
            className="mt-1.5 text-balance text-[26px] font-extrabold leading-[1.12] tracking-[-0.032em] text-foreground sm:text-[34px]"
          >
            <InlineCodeText>{next.lessonTitle}</InlineCodeText>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              {next.estimatedMinutes} min aprox.
            </span>
            {unit && unit.lessonCount > 0 && lessonNumber ? (
              <span>
                Lección {Math.min(lessonNumber, unit.lessonCount)} de{" "}
                {unit.lessonCount}
              </span>
            ) : null}
          </div>

          <Button asChild size="xl" className="mt-6 w-full sm:w-auto">
            <Link href={href}>
              {resume ? "Continuar lección" : "Empezar lección"}
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {/* El módulo en construcción: los bloques de esta unidad a
            tamaño grande. Es el mismo objeto de la ruta, aquí como
            retrato de dónde estás exactamente. */}
        {unit && unit.lessonCount > 0 ? (
          <div className="hidden shrink-0 flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-primary/15 bg-card/70 px-6 py-5 lg:flex">
            <BrickColumn
              className="h-[168px] w-4"
              total={unit.lessonCount}
              done={unit.completedCount}
              current={unit.completedCount}
            />
            <p className="text-center text-[13px] font-bold text-muted-foreground">
              {unit.completedCount}/{unit.lessonCount}
              <span className="block font-semibold text-subtle-foreground">
                de esta unidad
              </span>
            </p>
          </div>
        ) : null}
      </div>

      {unit && unit.lessonCount > 0 ? (
        <div className="border-t border-primary/15 px-5 py-4 sm:px-7 lg:hidden">
          <BrickRow
            total={unit.lessonCount}
            done={unit.completedCount}
            current={unit.completedCount}
            size="lg"
            srLabel={`${unit.completedCount} de ${unit.lessonCount} lecciones de la unidad`}
          />
          <p className="mt-2.5 text-[13px] font-semibold text-muted-foreground">
            {unit.completedCount} de {unit.lessonCount} lecciones de esta unidad
          </p>
        </div>
      ) : null}
    </section>
  );
}

function AllDonePanel() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-success/25 bg-success-soft/50 p-6 shadow-[var(--shadow-xs)] sm:p-7">
      <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-success">
        Curso al día
      </p>
      <h1 className="mt-3 text-balance text-[26px] font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-[32px]">
        Completaste todas las lecciones disponibles.
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
        Sigue afilando lo aprendido con ejercicios de práctica mientras llega
        contenido nuevo.
      </p>
      <Button asChild size="xl" className="mt-6 w-full sm:w-auto">
        <Link href="/app/ejercicios">
          Practicar ejercicios
          <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}

function EmptyCoursePanel() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-dashed border-border-strong bg-card p-6 sm:p-7">
      <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
        Sin contenido todavía
      </p>
      <h1 className="mt-3 text-[24px] font-extrabold leading-[1.14] tracking-[-0.03em] sm:text-[28px]">
        Aún no hay lecciones publicadas.
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
        Estamos preparando más contenido. Mientras tanto, puedes practicar con
        los ejercicios sueltos.
      </p>
      <Button asChild variant="outline" size="lg" className="mt-6 w-full sm:w-auto">
        <Link href="/app/ejercicios">
          Ver ejercicios
          <ArrowRight />
        </Link>
      </Button>
    </section>
  );
}

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-xs)]">
      <p className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-[24px] font-extrabold leading-none tabular-nums tracking-[-0.03em] text-foreground">
        {value}
      </p>
      <p className="mt-2 text-[12px] font-medium leading-snug text-subtle-foreground">
        {hint}
      </p>
    </div>
  );
}

function FriendsEmpty() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card p-5">
      <p className="text-[15px] font-bold">Estudien juntos</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
        Agrega compañeros del CETI y verás aquí en qué van.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4 w-full">
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
