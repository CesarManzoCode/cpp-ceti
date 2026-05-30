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
import {
  getCompletedLessonsCount,
  getExerciseAttemptsCount,
} from "@/features/lessons/queries";
import { levelFromXp } from "@/lib/level";
import { getUserStats } from "@/lib/streak";
import { requireSession } from "@/lib/get-session";
import { pluralize } from "@/lib/utils";
import { ChangePasswordDialog } from "@/features/profile/components/change-password-dialog";
import { DeleteAccountDialog } from "@/features/profile/components/delete-account-dialog";
import { SignOutButton } from "@/features/profile/components/sign-out-button";

export const metadata = {
  title: "Mi perfil",
};

export default async function PerfilPage() {
  const session = await requireSession();
  const user = session.user;

  const [stats, lessonsCompleted, attempts] = await Promise.all([
    getUserStats(user.id),
    getCompletedLessonsCount(user.id),
    getExerciseAttemptsCount(user.id),
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

  const lvl = levelFromXp(stats.totalXp);

  return (
    <div
      data-page-enter
      className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <header className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-xs)] sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar className="size-16 ring-1 ring-border ring-inset sm:size-20">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-xl font-semibold text-primary-soft-foreground sm:text-2xl">
              {initials || <UserIcon className="size-7 sm:size-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1.5">
            <h1 className="truncate text-[24px] font-bold tracking-[-0.025em] sm:text-[32px]">
              {user.name}
            </h1>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <Sparkles className="size-3" aria-hidden />
              Miembro desde {memberSince}
            </p>
          </div>
        </div>
      </header>

      <section
        className="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-xs)] sm:p-6"
        aria-label={`Nivel actual: ${lvl.level}`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-primary/40 bg-primary-soft text-base font-bold text-primary sm:size-16 sm:text-lg">
            Nv {lvl.level}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold tracking-tight">
                Nivel {lvl.level}
              </p>
              <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {lvl.xpInCurrentLevel}/{lvl.xpForNextLevel} XP
              </p>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={lvl.xpForNextLevel}
              aria-valuenow={lvl.xpInCurrentLevel}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${Math.min(100, lvl.progress * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {lvl.xpForNextLevel - lvl.xpInCurrentLevel} XP para el nivel{" "}
              {lvl.level + 1}.
            </p>
          </div>
        </div>
      </section>

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
              <p className="text-sm font-medium">Cambiar contraseña</p>
              <p className="text-xs text-muted-foreground">
                Actualiza tu contraseña. Cerramos las sesiones en otros
                dispositivos por seguridad.
              </p>
            </div>
            <ChangePasswordDialog />
          </li>
          <li className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">Eliminar cuenta</p>
              <p className="text-xs text-muted-foreground">
                Borra tu cuenta y todos tus datos de forma permanente.
              </p>
            </div>
            <DeleteAccountDialog userEmail={user.email} />
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
