import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { ProfileActions } from "@/features/friends/components/profile-actions";
import { getPublicProfile, type PublicProfile } from "@/features/friends/queries";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { levelFromXp } from "@/lib/level";
import { PRODUCT_NAME, UNOFFICIAL_NOTICE } from "@/lib/branding";
import {
  USERNAME_MAX,
  USERNAME_MIN,
  USERNAME_PATTERN,
} from "@/lib/validation";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const normalized = username.toLowerCase();
  return {
    title: `Únete a @${normalized} en ${PRODUCT_NAME}`,
    description: `Aprende a programar con lecciones interactivas. @${normalized} te está invitando.`,
  };
}

export default async function InvitarPage({ params }: PageProps) {
  const { username } = await params;
  const normalized = username.toLowerCase();

  if (username !== normalized) {
    redirect(`/invitar/${normalized}`);
  }
  if (
    normalized.length < USERNAME_MIN ||
    normalized.length > USERNAME_MAX ||
    !USERNAME_PATTERN.test(normalized)
  ) {
    notFound();
  }

  const session = await getSession();

  const profile = session?.user
    ? await getPublicProfile(normalized, session.user.id)
    : await fetchMinimalProfile(normalized);

  if (!profile) notFound();

  // Si es el propio user invitándose, lo mandamos a la página de amigos.
  if (hasState(profile) && profile.state === "self") {
    redirect("/app/amigos");
  }

  const lvl = levelFromXp(profile.totalXp);
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border px-5 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/"
            className="-m-2 rounded-[var(--radius-xs)] p-2 transition-opacity hover:opacity-70"
          >
            <Logo />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href={session ? "/app" : "/login"}>
              {session ? "Ir a mi app" : "Iniciar sesión"}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-lg px-5 py-10 sm:px-6 sm:py-14">
          <p className="label-micro text-primary">Invitación</p>
          <h1 className="font-display mt-4 text-balance text-[clamp(1.625rem,5vw,2.25rem)]">
            {profile.name} te invita a aprender a programar
          </h1>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
            Una plataforma de práctica para alumnos del CETI Guadalajara —
            90% código, 10% teoría, todo en español. {UNOFFICIAL_NOTICE}
          </p>

          <section className="mt-8 border-y border-border py-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 shrink-0 ring-1 ring-inset ring-border">
                {profile.image ? (
                  <AvatarImage src={profile.image} alt={profile.name} />
                ) : null}
                <AvatarFallback className="bg-primary-soft text-lg text-primary-soft-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-[17px] font-semibold leading-tight">
                  {profile.name}
                </p>
                <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              </div>
            </div>

            {profile.bio ? (
              <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-foreground/90">
                {profile.bio}
              </p>
            ) : null}

            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              <Stat label="nivel" value={String(lvl.level)} />
              <Stat label="xp" value={profile.totalXp.toLocaleString("es-MX")} />
              <Stat label="racha" value={`${profile.currentStreak}d`} />
            </dl>
          </section>

          <div className="mt-6">
            {hasState(profile) ? (
              <ProfileActions
                userId={profile.id}
                username={profile.username}
                state={profile.state}
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                <Button asChild size="xl">
                  <Link
                    href={`/registro?redirectTo=${encodeURIComponent(
                      `/invitar/${normalized}`,
                    )}`}
                  >
                    <UserPlus />
                    Crear cuenta y agregar
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={`/login?redirectTo=${encodeURIComponent(
                      `/invitar/${normalized}`,
                    )}`}
                  >
                    Ya tengo cuenta
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {session ? (
            <p className="mt-6 text-sm">
              <Link
                href={`/app/perfil/${profile.username}`}
                className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
              >
                Ver perfil completo
              </Link>
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function hasState(
  p: PublicProfile | Awaited<ReturnType<typeof fetchMinimalProfile>>,
): p is PublicProfile {
  return p !== null && "state" in p;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-micro text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-[19px] font-medium leading-none tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}

/**
 * Cuando no hay sesión usamos esta query mínima — no podemos calcular el
 * estado de relación porque no hay viewer. Mantiene la firma compatible con
 * el render (los stats son los mismos), pero omite el campo `state`.
 */
async function fetchMinimalProfile(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      streak: { select: { totalXp: true, currentStreak: true, longestStreak: true } },
    },
  });
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    bio: user.bio,
    joinedAt: user.createdAt,
    totalXp: user.streak?.totalXp ?? 0,
    currentStreak: user.streak?.currentStreak ?? 0,
    longestStreak: user.streak?.longestStreak ?? 0,
    completedLessons: 0,
    completedExercises: 0,
  };
}
