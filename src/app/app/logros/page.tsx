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
  Zap,
  type LucideIcon,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { Readout, ReadoutBar } from "@/components/ui/readout";
import { SectionRule } from "@/components/ui/section-rule";
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

const TONE_MARK: Record<BadgeTone, string> = {
  primary: "border-primary text-primary",
  warning: "border-warning text-warning",
  success: "border-success text-success",
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
      className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9"
    >
      <header className="border-b border-border pb-6">
        <p className="label-micro text-muted-foreground">Tu colección</p>
        <h1 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.028em] sm:text-[34px]">
          Logros
        </h1>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
          {unlocked.length === 0
            ? "Cada lección y cada reto que completes desbloquea un logro. La colección empieza con un solo paso."
            : `Llevas ${unlocked.length} de ${BADGES.length} ${pluralize(
                BADGES.length,
                "logro",
                "logros",
              )}.`}
        </p>

        <div className="mt-5 flex max-w-xs items-center gap-3">
          <span aria-hidden className="h-[3px] flex-1 overflow-hidden bg-surface-3">
            <span
              className="block h-full bg-warning transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {percent}%
          </span>
        </div>
      </header>

      <ReadoutBar className="mt-8 border-t-0 pt-0">
        <Readout
          label="XP totales"
          value={<AnimatedNumber value={stats.totalXp} />}
        />
        <Readout
          label="Mejor racha"
          mark={<StreakFlame streak={stats.longestStreak} className="size-3.5" />}
          value={
            <>
              <AnimatedNumber value={stats.longestStreak} />
              <span className="ml-1 text-base text-muted-foreground">
                {pluralize(stats.longestStreak, "día", "días")}
              </span>
            </>
          }
        />
        <Readout
          className="col-span-2 sm:col-span-1"
          label="Retos resueltos"
          value={<AnimatedNumber value={exercisesPassed} />}
        />
      </ReadoutBar>

      {unlocked.length === 0 ? (
        <div className="mt-8 border-l-2 border-primary py-1 pl-4">
          <h2 className="text-[17px] font-semibold leading-snug">
            Tu primer logro está a una lección de distancia
          </h2>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
            Completa cualquier lección para desbloquear “Primer paso” y echar a
            andar tu racha.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/app">
              Empezar una lección
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

      {unlocked.length > 0 ? (
        <section className="mt-10">
          <SectionRule trailing={`${unlocked.length}`}>
            Desbloqueados
          </SectionRule>
          <BadgeList badges={unlocked} unlocked />
        </section>
      ) : null}

      {locked.length > 0 ? (
        <section className="mt-10">
          <SectionRule trailing={`${locked.length}`}>
            Por desbloquear
          </SectionRule>
          <BadgeList badges={locked} unlocked={false} />
        </section>
      ) : null}
    </div>
  );
}

/**
 * Logros como lista con canaleta: la marca de estado ocupa el mismo sitio
 * que los ordinales del temario, así que "desbloqueado" se lee igual aquí
 * que en el resto del producto.
 */
function BadgeList({
  badges,
  unlocked,
}: {
  badges: BadgeDef[];
  unlocked: boolean;
}) {
  return (
    <ul
      data-stagger
      style={{ "--stagger": "30ms" } as CSSProperties}
      className="gutter-list mt-4 border-y border-border"
    >
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <li
            key={badge.id}
            style={{ "--i": idx } as CSSProperties}
            className="animate-fade-up gutter-row border-t border-border first:border-t-0"
          >
            <span className="flex items-start justify-center pr-3 pt-4">
              <span
                aria-hidden
                className={cn(
                  "grid size-7 place-items-center rounded-[var(--radius-xs)] border",
                  unlocked
                    ? TONE_MARK[badge.tone]
                    : "border-dashed border-border text-muted-foreground/50",
                )}
              >
                {unlocked ? (
                  <Icon className="size-3.5" />
                ) : (
                  <Lock className="size-3" />
                )}
              </span>
            </span>

            <span className="min-w-0 py-4 pl-4">
              <span
                className={cn(
                  "block text-[15px] font-semibold leading-snug",
                  unlocked ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {badge.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {unlocked ? badge.description : badge.hint}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
