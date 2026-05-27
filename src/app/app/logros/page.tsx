import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ChevronLeft,
  Lock,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Progress } from "@/components/ui/progress";
import { StatTile } from "@/components/ui/stat-tile";
import { StreakFlame } from "@/components/ui/streak-flame";
import { db } from "@/lib/db";
import { getUserStats } from "@/lib/courses";
import { requireSession } from "@/lib/get-session";
import { cn, pluralize } from "@/lib/utils";

export const metadata = {
  title: "Logros",
};

interface BadgeDef {
  id: string;
  title: string;
  description: string;
  unlockedWhen: (s: AchievementStats) => boolean;
  hint: string;
}

interface AchievementStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  exercisesPassed: number;
}

const BADGES: BadgeDef[] = [
  {
    id: "first-step",
    title: "Primer paso",
    description: "Completaste tu primera lección.",
    unlockedWhen: (s) => s.lessonsCompleted >= 1,
    hint: "Termina cualquier lección.",
  },
  {
    id: "explorer",
    title: "Explorador",
    description: "Completaste 5 lecciones.",
    unlockedWhen: (s) => s.lessonsCompleted >= 5,
    hint: "Sigue avanzando — vas a la mitad de la primera unidad.",
  },
  {
    id: "unit-complete",
    title: "Unidad dominada",
    description: "Terminaste una unidad completa.",
    unlockedWhen: (s) => s.lessonsCompleted >= 6,
    hint: "Completa todas las lecciones de una unidad.",
  },
  {
    id: "challenger",
    title: "Resuelvo retos",
    description: "Aprobaste tu primer reto de código.",
    unlockedWhen: (s) => s.exercisesPassed >= 1,
    hint: "Envía la solución a un reto y pasa todos sus tests.",
  },
  {
    id: "challenger-5",
    title: "Coder ágil",
    description: "Aprobaste 5 retos de código.",
    unlockedWhen: (s) => s.exercisesPassed >= 5,
    hint: "Completa 5 retos para desbloquearlo.",
  },
  {
    id: "streak-3",
    title: "Constancia",
    description: "Racha de 3 días.",
    unlockedWhen: (s) => s.longestStreak >= 3,
    hint: "Vuelve 3 días seguidos.",
  },
  {
    id: "streak-7",
    title: "Una semana entera",
    description: "Racha de 7 días.",
    unlockedWhen: (s) => s.longestStreak >= 7,
    hint: "Vuelve cada día durante 7 días.",
  },
  {
    id: "xp-100",
    title: "Centenario",
    description: "Acumulaste 100 XP.",
    unlockedWhen: (s) => s.totalXp >= 100,
    hint: "Cada lección te da entre 20 y 30 XP.",
  },
  {
    id: "xp-500",
    title: "Quinientos",
    description: "Acumulaste 500 XP.",
    unlockedWhen: (s) => s.totalXp >= 500,
    hint: "Sigue completando lecciones y retos.",
  },
];

export default async function LogrosPage() {
  const session = await requireSession();

  const [stats, lessonsCompleted, distinctExercisesPassed] = await Promise.all([
    getUserStats(session.user.id),
    db.userLessonProgress.count({
      where: { userId: session.user.id, status: "completed" },
    }),
    db.userExerciseAttempt.findMany({
      where: { userId: session.user.id, passed: true },
      select: { exerciseId: true },
      distinct: ["exerciseId"],
    }),
  ]);
  const exercisesPassed = distinctExercisesPassed.length;

  const achievementStats: AchievementStats = {
    totalXp: stats.totalXp,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    lessonsCompleted,
    exercisesPassed,
  };

  const unlocked = BADGES.filter((b) => b.unlockedWhen(achievementStats));
  const locked = BADGES.filter((b) => !b.unlockedWhen(achievementStats));
  const percent = Math.round((unlocked.length / BADGES.length) * 100);

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
        <ConsoleEyebrow tone="primary">Logros</ConsoleEyebrow>
        <h1 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-[40px]">
          Tu colección
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {unlocked.length === 0
            ? "Aún no has desbloqueado logros. Empieza una lección para conseguir tu primer trofeo."
            : `Llevas ${unlocked.length} de ${BADGES.length} ${pluralize(
                BADGES.length,
                "logro",
                "logros",
              )}.`}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Progress value={percent} tone="warning" className="max-w-xs" />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {percent}%
          </span>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen">
        <StatTile
          icon={<Zap />}
          label="XP totales"
          value={<AnimatedNumber value={stats.totalXp} />}
          tone="primary"
        />
        <StatTile
          icon={<StreakFlame streak={stats.longestStreak} className="size-5" />}
          label="Racha más larga"
          value={
            <>
              <AnimatedNumber value={stats.longestStreak} />{" "}
              <span className="text-base font-medium text-muted-foreground">
                {pluralize(stats.longestStreak, "día", "días")}
              </span>
            </>
          }
          tone="warning"
        />
        <StatTile
          icon={<Sparkles />}
          label="Retos resueltos"
          value={<AnimatedNumber value={exercisesPassed} />}
          tone="success"
        />
      </section>

      {unlocked.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Desbloqueados
            </h2>
            <span className="text-sm font-medium text-muted-foreground">
              {unlocked.length}
            </span>
          </div>
          <div
            data-stagger
            style={{ "--stagger": "40ms" } as CSSProperties}
            className="grid gap-3 sm:grid-cols-2"
          >
            {unlocked.map((b, idx) => (
              <div
                key={b.id}
                style={{ "--i": idx } as CSSProperties}
                className="animate-fade-up"
              >
                <BadgeCard badge={b} unlocked />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {locked.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Por desbloquear
            </h2>
            <span className="text-sm font-medium text-muted-foreground">
              {locked.length}
            </span>
          </div>
          <div
            data-stagger
            style={{ "--stagger": "30ms" } as CSSProperties}
            className="grid gap-3 sm:grid-cols-2"
          >
            {locked.map((b, idx) => (
              <div
                key={b.id}
                style={{ "--i": idx } as CSSProperties}
                className="animate-fade-up"
              >
                <BadgeCard badge={b} unlocked={false} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function BadgeCard({
  badge,
  unlocked,
}: {
  badge: BadgeDef;
  unlocked: boolean;
}) {
  return (
    <article
      className={cn(
        "flex items-start gap-4 rounded-[var(--radius-lg)] border bg-card p-5 transition-colors",
        unlocked
          ? "border-border hover:border-border-strong"
          : "border-dashed border-border opacity-75 hover:opacity-100",
      )}
    >
      <div
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)]",
          unlocked
            ? "bg-warning-soft text-warning"
            : "bg-surface-2 text-muted-foreground",
        )}
      >
        {unlocked ? (
          <Trophy className="size-5" aria-hidden />
        ) : (
          <Lock className="size-4" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-[15px] font-semibold tracking-tight">
          {badge.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {unlocked ? badge.description : badge.hint}
        </p>
      </div>
    </article>
  );
}
