import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Flame,
  GraduationCap,
  Lock,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { Progress } from "@/components/ui/progress";
import { StatTile } from "@/components/ui/stat-tile";
import { StreakFlame } from "@/components/ui/streak-flame";
import {
  getCompletedLessonsCount,
  getDistinctExercisesPassedCount,
} from "@/features/lessons/queries";
import { getUserStats } from "@/lib/streak";
import { requireSession } from "@/lib/get-session";
import { cn, pluralize } from "@/lib/utils";

type BadgeTone = "primary" | "warning" | "success";

interface BadgeDef {
  id: string;
  title: string;
  description: string;
  unlockedWhen: (s: AchievementStats) => boolean;
  hint: string;
  icon: LucideIcon;
  tone: BadgeTone;
}

const TONE_TILE: Record<BadgeTone, string> = {
  primary: "bg-primary-soft text-primary",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
};

export const metadata = {
  title: "Logros",
};

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
    icon: BookOpen,
    tone: "primary",
  },
  {
    id: "explorer",
    title: "Explorador",
    description: "Completaste 5 lecciones.",
    unlockedWhen: (s) => s.lessonsCompleted >= 5,
    hint: "Sigue avanzando — vas a la mitad de la primera unidad.",
    icon: BookOpen,
    tone: "primary",
  },
  {
    id: "unit-complete",
    title: "Unidad dominada",
    description: "Terminaste una unidad completa.",
    unlockedWhen: (s) => s.lessonsCompleted >= 6,
    hint: "Completa todas las lecciones de una unidad.",
    icon: GraduationCap,
    tone: "success",
  },
  {
    id: "challenger",
    title: "Resuelvo retos",
    description: "Aprobaste tu primer reto de código.",
    unlockedWhen: (s) => s.exercisesPassed >= 1,
    hint: "Envía la solución a un reto y pasa todos sus tests.",
    icon: Sparkles,
    tone: "success",
  },
  {
    id: "challenger-5",
    title: "Coder ágil",
    description: "Aprobaste 5 retos de código.",
    unlockedWhen: (s) => s.exercisesPassed >= 5,
    hint: "Completa 5 retos para desbloquearlo.",
    icon: Code2,
    tone: "success",
  },
  {
    id: "streak-3",
    title: "Constancia",
    description: "Racha de 3 días.",
    unlockedWhen: (s) => s.longestStreak >= 3,
    hint: "Vuelve 3 días seguidos.",
    icon: Flame,
    tone: "warning",
  },
  {
    id: "streak-7",
    title: "Una semana entera",
    description: "Racha de 7 días.",
    unlockedWhen: (s) => s.longestStreak >= 7,
    hint: "Vuelve cada día durante 7 días.",
    icon: Flame,
    tone: "warning",
  },
  {
    id: "xp-100",
    title: "Centenario",
    description: "Acumulaste 100 XP.",
    unlockedWhen: (s) => s.totalXp >= 100,
    hint: "Cada lección te da entre 20 y 30 XP.",
    icon: Zap,
    tone: "primary",
  },
  {
    id: "xp-500",
    title: "Quinientos",
    description: "Acumulaste 500 XP.",
    unlockedWhen: (s) => s.totalXp >= 500,
    hint: "Sigue completando lecciones y retos.",
    icon: Star,
    tone: "warning",
  },
];

export default async function LogrosPage() {
  const session = await requireSession();

  const [stats, lessonsCompleted, exercisesPassed] = await Promise.all([
    getUserStats(session.user.id),
    getCompletedLessonsCount(session.user.id),
    getDistinctExercisesPassedCount(session.user.id),
  ]);

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
      <header className="space-y-3">
        <ConsoleEyebrow tone="primary">Logros</ConsoleEyebrow>
        <h1 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-[40px]">
          Tu colección
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {unlocked.length === 0
            ? "Cada lección y cada reto que completes desbloquea un trofeo. Tu colección empieza con un solo paso."
            : `Llevas ${unlocked.length} de ${BADGES.length} ${pluralize(
                BADGES.length,
                "logro",
                "logros",
              )}.`}
        </p>
        {unlocked.length > 0 ? (
          <div className="flex items-center gap-3 pt-2">
            <Progress value={percent} tone="warning" className="max-w-xs" />
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {percent}%
            </span>
          </div>
        ) : null}
      </header>

      {unlocked.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-border bg-surface-2/40 p-10 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-warning-soft text-warning">
            <Trophy className="size-6" aria-hidden />
          </span>
          <div className="space-y-1">
            <h2 className="text-base font-semibold">
              Tu primer trofeo está a una lección de distancia
            </h2>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Completa cualquier lección para desbloquear “Primer paso” y echar
              a andar tu racha.
            </p>
          </div>
          <Button asChild size="sm" className="mt-1">
            <Link href="/app">
              Empezar una lección
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

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
  const Icon = badge.icon;
  return (
    <article
      className={cn(
        "flex items-start gap-4 rounded-[var(--radius-lg)] border bg-card p-5 transition-colors",
        unlocked
          ? "border-border hover:border-border-strong"
          : "border-dashed border-border/80",
      )}
    >
      <div
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)]",
          unlocked
            ? TONE_TILE[badge.tone]
            : "bg-surface-2 text-muted-foreground/70 ring-1 ring-inset ring-border/50",
        )}
      >
        {unlocked ? (
          <Icon className="size-5" aria-hidden />
        ) : (
          <Lock className="size-4" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <h3
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            unlocked ? "text-foreground" : "text-foreground/80",
          )}
        >
          {badge.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {unlocked ? badge.description : badge.hint}
        </p>
      </div>
    </article>
  );
}
