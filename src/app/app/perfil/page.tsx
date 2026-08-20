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
      className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header className="flex items-center gap-4">
        <Avatar className="size-16 shrink-0 ring-1 ring-inset ring-border sm:size-20">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-primary-soft text-xl font-bold text-primary-soft-foreground">
            {initials || <UserIcon className="size-7" />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-[24px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[30px]">
            {user.name}
          </h1>
          <p className="mt-1 truncate text-[15px] text-muted-foreground">
            {user.email}
          </p>
          <p className="mt-1 text-[13px] font-medium text-subtle-foreground">
            Miembro desde {memberSince}
          </p>
        </div>
      </header>

      <LevelBar totalXp={stats.totalXp} className="mt-7" />

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
              <StreakFlame streak={stats.currentStreak} className="size-4" />
            }
            value={
              <>
                <AnimatedNumber value={stats.currentStreak} />
                <span className="ml-1 text-[17px] font-semibold text-muted-foreground">
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

        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-xs)]">
          <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div className="min-w-0">
              <p className="text-[15px] font-bold">Cerrar sesión</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                Tu progreso queda guardado. Puedes volver cuando quieras.
              </p>
            </div>
            <div className="shrink-0">
              <SignOutButton />
            </div>
          </li>
          <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div className="min-w-0">
              <p className="text-[15px] font-bold">Cambiar contraseña</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                Actualiza tu contraseña. Cerramos las sesiones en otros
                dispositivos por seguridad.
              </p>
            </div>
            <div className="shrink-0">
              <ChangePasswordDialog />
            </div>
          </li>
          <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div className="min-w-0">
              <p className="text-[15px] font-bold">Eliminar cuenta</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                Borra tu cuenta y todos tus datos de forma permanente.
              </p>
            </div>
            <div className="shrink-0">
              <DeleteAccountDialog userEmail={user.email} />
            </div>
          </li>
        </ul>
      </section>

      <p className="mt-8 text-[14px] text-muted-foreground">
        ¿Encontraste un bug?{" "}
        <a
          href="https://github.com/CesarManzoCode/cpp-ceti/issues"
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-primary underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary"
        >
          Repórtalo en GitHub
        </a>
        .
      </p>
    </div>
  );
}
