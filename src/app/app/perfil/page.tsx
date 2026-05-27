import Link from "next/link";
import { ChevronLeft, Flame, Mail, User as UserIcon, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-8">
      <div>
        <Button asChild size="sm" variant="ghost" className="-ml-2">
          <Link href="/app">
            <ChevronLeft className="size-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <Avatar className="size-20">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-primary/15 text-2xl text-primary">
            {initials || <UserIcon className="size-8" />}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {user.name}
          </h1>
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
            <Mail className="size-3.5" />
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground">
            Miembro desde {memberSince}
          </p>
        </div>
      </header>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Tu actividad</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatBlock
            icon={<Zap className="size-4 text-primary" />}
            label="XP totales"
            value={formatNumber(stats.totalXp)}
          />
          <StatBlock
            icon={<Flame className="size-4 text-warning" />}
            label="Racha actual"
            value={`${stats.currentStreak} ${pluralize(stats.currentStreak, "día", "días")}`}
            sub={`Más larga: ${stats.longestStreak}`}
          />
          <StatBlock
            icon={<UserIcon className="size-4 text-success" />}
            label="Lecciones / intentos"
            value={`${lessonsCompleted}`}
            sub={`${attempts} ${pluralize(attempts, "intento", "intentos")} en retos`}
          />
        </div>
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Cuenta</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cerrar sesión</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Tu progreso queda guardado y puedes regresar cuando quieras.
            </p>
            <SignOutButton />
          </CardContent>
        </Card>
      </section>

      <p className="pt-4 text-center text-xs text-muted-foreground">
        <Badge variant="secondary" className="mr-2">
          Beta
        </Badge>
        Más opciones (cambiar contraseña, eliminar cuenta, idioma) llegarán pronto.
      </p>
    </div>
  );
}

function StatBlock({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
        {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}
