import Link from "next/link";
import {
  ChevronLeft,
  Flame,
  Mail,
  Send,
  Sparkles,
  Trophy,
  User as UserIcon,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";
import { db } from "@/lib/db";
import { getUserStats } from "@/lib/courses";
import { requireSession } from "@/lib/get-session";
import { formatNumber, pluralize } from "@/lib/utils";

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
    <div className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div>
        <Button asChild size="sm" variant="ghost" className="-ml-2.5">
          <Link href="/app">
            <ChevronLeft />
            Inicio
          </Link>
        </Button>
      </div>

      {/* Hero del perfil */}
      <header className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar className="size-24 ring-4 ring-background">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-3xl font-semibold text-primary-soft-foreground">
              {initials || <UserIcon className="size-9" />}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {user.name}
            </h1>
            <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:items-start">
              <p className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" aria-hidden />
                {user.email}
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs">
                <Sparkles className="size-3" aria-hidden />
                Miembro desde {memberSince}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Tu actividad
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile
            icon={<Zap />}
            label="XP totales"
            value={formatNumber(stats.totalXp)}
            tone="primary"
            size="sm"
          />
          <StatTile
            icon={<Flame />}
            label="Racha actual"
            value={`${stats.currentStreak} ${pluralize(stats.currentStreak, "día", "días")}`}
            sub={`Mejor: ${stats.longestStreak} ${pluralize(stats.longestStreak, "día", "días")}`}
            tone="warning"
            size="sm"
          />
          <StatTile
            icon={<Trophy />}
            label="Lecciones / retos"
            value={`${lessonsCompleted}`}
            sub={`${attempts} ${pluralize(attempts, "intento", "intentos")} en retos`}
            tone="success"
            size="sm"
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

        <ul className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <li className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">Cerrar sesión</p>
              <p className="text-xs text-muted-foreground">
                Tu progreso queda guardado. Puedes volver cuando quieras.
              </p>
            </div>
            <SignOutButton />
          </li>
          <li className="flex items-center justify-between gap-4 border-t border-border/70 p-5 opacity-70">
            <div>
              <p className="text-sm font-medium">Cambiar contraseña</p>
              <p className="text-xs text-muted-foreground">
                Disponible próximamente.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </li>
          <li className="flex items-center justify-between gap-4 border-t border-border/70 p-5 opacity-70">
            <div>
              <p className="text-sm font-medium">Eliminar cuenta</p>
              <p className="text-xs text-muted-foreground">
                Disponible próximamente.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </li>
        </ul>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        ¿Encontraste un bug?{" "}
        <a
          href="https://github.com"
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
