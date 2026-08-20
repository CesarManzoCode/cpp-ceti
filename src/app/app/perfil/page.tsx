import { User as UserIcon } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LevelBar } from "@/components/ui/level-bar";
import { Readout, ReadoutBar } from "@/components/ui/readout";
import { SectionRule } from "@/components/ui/section-rule";
import { StreakFlame } from "@/components/ui/streak-flame";
import {
  getCompletedLessonsCount,
  getExerciseAttemptsCount,
} from "@/features/lessons/queries";
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

  return (
    <div
      data-page-enter
      className="mx-auto max-w-2xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9"
    >
      <header className="flex items-center gap-4 border-b border-border pb-6">
        <Avatar className="size-14 shrink-0 ring-1 ring-inset ring-border sm:size-16">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-primary-soft text-lg text-primary-soft-foreground">
            {initials || <UserIcon className="size-6" />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-semibold leading-tight tracking-[-0.02em] sm:text-[28px]">
            {user.name}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.email}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground/80">
            Miembro desde {memberSince}
          </p>
        </div>
      </header>

      <LevelBar totalXp={stats.totalXp} className="mt-7 border-t-0" />

      <section className="mt-9">
        <SectionRule>Tu actividad</SectionRule>
        <ReadoutBar className="mt-4">
          <Readout
            label="XP totales"
            value={<AnimatedNumber value={stats.totalXp} />}
          />
          <Readout
            label="Racha"
            mark={
              <StreakFlame streak={stats.currentStreak} className="size-3.5" />
            }
            value={
              <>
                <AnimatedNumber value={stats.currentStreak} />
                <span className="ml-1 text-base text-muted-foreground">
                  {pluralize(stats.currentStreak, "día", "días")}
                </span>
              </>
            }
            sub={`Mejor: ${stats.longestStreak} ${pluralize(stats.longestStreak, "día", "días")}`}
          />
          <Readout
            className="col-span-2 sm:col-span-1"
            label="Lecciones"
            value={<AnimatedNumber value={lessonsCompleted} />}
            sub={`${attempts} ${pluralize(attempts, "intento", "intentos")} en retos`}
          />
        </ReadoutBar>
      </section>

      <section className="mt-10">
        <SectionRule trailing="Beta">Cuenta</SectionRule>

        <ul className="mt-4 border-y border-border">
          <li className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="text-sm font-medium">Cerrar sesión</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Tu progreso queda guardado. Puedes volver cuando quieras.
              </p>
            </div>
            <div className="shrink-0">
              <SignOutButton />
            </div>
          </li>
          <li className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="text-sm font-medium">Cambiar contraseña</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Actualiza tu contraseña. Cerramos las sesiones en otros
                dispositivos por seguridad.
              </p>
            </div>
            <div className="shrink-0">
              <ChangePasswordDialog />
            </div>
          </li>
          <li className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="text-sm font-medium">Eliminar cuenta</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Borra tu cuenta y todos tus datos de forma permanente.
              </p>
            </div>
            <div className="shrink-0">
              <DeleteAccountDialog userEmail={user.email} />
            </div>
          </li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        ¿Encontraste un bug?{" "}
        <a
          href="https://github.com/CesarManzoCode/cpp-ceti/issues"
          target="_blank"
          rel="noreferrer noopener"
          className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
        >
          Repórtalo en GitHub
        </a>
        .
      </p>
    </div>
  );
}
