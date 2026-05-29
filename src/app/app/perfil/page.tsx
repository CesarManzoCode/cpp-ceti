import {
  Send,
  Sparkles,
  Trophy,
  User as UserIcon,
  Zap,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/stat-tile";
import { StreakFlame } from "@/components/ui/streak-flame";
import { db } from "@/lib/db";
import { getUserStats } from "@/lib/courses";
import { requireSession } from "@/lib/get-session";
import { pluralize } from "@/lib/utils";

import { SignOutButton } from "./sign-out-button";

export const metadata = {
  title: "Mi perfil",
};

export default async function PerfilPage() {
  const session = await requireSession();
  const user = session.user;

  const [stats, lessonsCompleted, attempts] = await Promise.all([
    getUserStats(user.id),
    db.userLessonProgress.count({
      where: { userId: user.id, status: "completed" },
    }),
    db.userExerciseAttempt.count({
      where: { userId: user.id },
    }),
  ]);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      data-page-enter
      className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <header className="rounded-[var(--radius-xl)] border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar className="size-20 ring-1 ring-border ring-inset">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-2xl font-semibold text-primary-soft-foreground">
              {initials || <UserIcon className="size-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <h1 className="text-[26px] font-bold tracking-[-0.025em] sm:text-[32px]">
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <Sparkles className="size-3" aria-hidden />
              Miembro desde {memberSince}
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Tu actividad</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile
            icon={<Zap />}
            label="XP totales"
            value={<AnimatedNumber value={stats.totalXp} />}
            tone="primary"
          />
          <StatTile
            icon={<StreakFlame streak={stats.currentStreak} className="size-5" />}
            label="Racha actual"
            value={
              <>
                <AnimatedNumber value={stats.currentStreak} />{" "}
                <span className="text-base font-medium text-muted-foreground">
                  {pluralize(stats.currentStreak, "día", "días")}
                </span>
              </>
            }
            sub={`Mejor: ${stats.longestStreak} ${pluralize(stats.longestStreak, "día", "días")}`}
            tone="warning"
          />
          <StatTile
            icon={<Trophy />}
            label="Lecciones / retos"
            value={<AnimatedNumber value={lessonsCompleted} />}
            sub={`${attempts} ${pluralize(attempts, "intento", "intentos")} en retos`}
            tone="success"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Cuenta</h2>
          <Badge variant="secondary" size="sm">
            Beta
          </Badge>
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <li className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">Cerrar sesión</p>
              <p className="text-xs text-muted-foreground">
                Tu progreso queda guardado. Puedes volver cuando quieras.
              </p>
            </div>
            <SignOutButton />
          </li>
          <li className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cambiar contraseña
              </p>
              <p className="text-xs text-muted-foreground/80">
                Actualiza tu contraseña desde aquí.
              </p>
            </div>
            <Badge variant="secondary" size="sm">
              Pronto
            </Badge>
          </li>
          <li className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Eliminar cuenta
              </p>
              <p className="text-xs text-muted-foreground/80">
                Borra tu cuenta y todos tus datos de forma permanente.
              </p>
            </div>
            <Badge variant="secondary" size="sm">
              Pronto
            </Badge>
          </li>
        </ul>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        ¿Encontraste un bug?{" "}
        <a
          href="https://github.com/CesarManzoCode/cpp-ceti/issues"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          <Send className="size-3" aria-hidden /> Reporta en GitHub
        </a>
      </p>
    </div>
  );
}
