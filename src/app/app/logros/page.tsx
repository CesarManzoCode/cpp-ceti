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
import { BrickRow } from "@/components/ui/bricks";
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
  primary: "bg-primary text-primary-foreground",
  warning: "bg-warning-vivid text-warning-ink",
  success: "bg-success text-success-foreground",
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
      className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          Logros
        </h1>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          {unlocked.length === 0
            ? "Cada lección y cada reto que completes desbloquea un logro. La colección empieza con un solo paso."
            : `Llevas ${unlocked.length} de ${BADGES.length} ${pluralize(
                BADGES.length,
                "logro",
                "logros",
              )}.`}
        </p>

        <div className="mt-6 flex max-w-md items-center gap-4">
          <BrickRow
            className="min-w-0 flex-1"
            total={BADGES.length}
            done={unlocked.length}
            size="lg"
            tone="success"
            srLabel={`${unlocked.length} de ${BADGES.length} logros desbloqueados`}
          />
          <span className="shrink-0 text-[14px] font-bold tabular-nums text-muted-foreground">
            {percent}%
          </span>
        </div>
      </header>

      <ReadoutBar className="mt-8">
        <Readout
          label="XP totales"
          value={<AnimatedNumber value={stats.totalXp} />}
        />
        <Readout
          label="Mejor racha"
          mark={<StreakFlame streak={stats.longestStreak} className="size-4" />}
          value={
            <>
              <AnimatedNumber value={stats.longestStreak} />
              <span className="ml-1 text-[17px] font-semibold text-muted-foreground">
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
        <div className="mt-8 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-5 sm:p-6">
          <h2 className="text-[19px] font-bold leading-snug">
            Tu primer logro está a una lección de distancia
          </h2>
          <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
            Completa cualquier lección para desbloquear “Primer paso” y echar a
            andar tu racha.
          </p>
          <Button asChild size="lg" className="mt-5 max-sm:w-full">
            <Link href="/app">
              Empezar una lección
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

      {unlocked.length > 0 ? (
        <section className="mt-10">
          <SectionRule
            trailing={`${unlocked.length} de ${BADGES.length}`}
          >
            Desbloqueados
          </SectionRule>
          <BadgeList badges={unlocked} unlocked />
        </section>
      ) : null}

      {locked.length > 0 ? (
        <section className="mt-10">
          <SectionRule trailing={`Faltan ${locked.length}`}>
            Por desbloquear
          </SectionRule>
          <BadgeList badges={locked} unlocked={false} />
        </section>
      ) : null}
    </div>
  );
}

/**
 * Los logros son piezas de colección: la marca lleva el icono y el
 * color del tipo de logro; los bloqueados quedan en borde punteado con
 * la condición para conseguirlos, que es más útil que esconderlos.
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
      style={{ "--stagger": "35ms" } as CSSProperties}
      className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <li
            key={badge.id}
            style={{ "--i": idx } as CSSProperties}
            className={cn(
              "animate-fade-up flex h-full items-start gap-4 rounded-[var(--radius-lg)] border p-4 sm:p-5",
              unlocked
                ? "border-border bg-card shadow-[var(--shadow-xs)]"
                : "border-dashed border-border-strong bg-transparent",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)]",
                unlocked
                  ? TONE_MARK[badge.tone]
                  : "bg-surface-2 text-subtle-foreground",
              )}
            >
              {unlocked ? (
                <Icon className="size-5" />
              ) : (
                <Lock className="size-[18px]" />
              )}
            </span>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-[16px] font-bold leading-snug",
                  unlocked ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {badge.title}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                {unlocked ? badge.description : badge.hint}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
