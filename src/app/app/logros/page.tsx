import Link from "next/link";
import { ChevronLeft, Flame, Lock, Sparkles, Trophy, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getUserStats } from "@/lib/courses";
import { requireSession } from "@/lib/get-session";
import { cn, formatNumber, pluralize } from "@/lib/utils";

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

  const [stats, lessonsCompleted, exercisesPassed] = await Promise.all([
    getUserStats(session.user.id),
    db.userLessonProgress.count({
      where: { userId: session.user.id, status: "completed" },
    }),
    db.userExerciseAttempt.count({
      where: { userId: session.user.id, passed: true },
    }),
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

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6 lg:p-8">
      <div>
        <Button asChild size="sm" variant="ghost" className="-ml-2">
          <Link href="/app">
            <ChevronLeft className="size-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Logros
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tu colección
        </h1>
        <p className="text-muted-foreground">
          {unlocked.length === 0
            ? "Aún no has desbloqueado logros. ¡Empieza una lección!"
            : `Tienes ${unlocked.length} ${pluralize(unlocked.length, "logro", "logros")} de ${BADGES.length}.`}
        </p>
      </header>

      {/* Resumen */}
      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={<Zap className="size-4 text-primary" />}
          label="XP totales"
          value={formatNumber(stats.totalXp)}
        />
        <SummaryCard
          icon={<Flame className="size-4 text-warning" />}
          label="Racha más larga"
          value={`${stats.longestStreak} ${pluralize(stats.longestStreak, "día", "días")}`}
        />
        <SummaryCard
          icon={<Sparkles className="size-4 text-success" />}
          label="Retos resueltos"
          value={String(exercisesPassed)}
        />
      </section>

      {/* Desbloqueados */}
      {unlocked.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Desbloqueados
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {unlocked.map((b) => (
              <BadgeCard key={b.id} badge={b} unlocked />
            ))}
          </div>
        </section>
      ) : null}

      {/* Bloqueados */}
      {locked.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Por desbloquear
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {locked.map((b) => (
              <BadgeCard key={b.id} badge={b} unlocked={false} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid size-9 place-items-center rounded-lg bg-muted">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-base font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
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
    <Card
      className={cn(
        "transition-all",
        unlocked
          ? "border-warning/40 bg-gradient-to-br from-warning/15 via-card to-card"
          : "opacity-70",
      )}
    >
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-xl",
            unlocked
              ? "bg-gradient-to-br from-warning to-amber-600 text-white shadow-md"
              : "bg-muted text-muted-foreground",
          )}
        >
          {unlocked ? <Trophy className="size-5" /> : <Lock className="size-4" />}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{badge.title}</h3>
            {unlocked ? (
              <Badge variant="warning" className="text-[10px]">
                Desbloqueado
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {unlocked ? badge.description : badge.hint}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
