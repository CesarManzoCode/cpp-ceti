import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Flame, Sparkles, UserPlus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { ProfileActions } from "@/features/friends/components/profile-actions";
import { getPublicProfile, type PublicProfile } from "@/features/friends/queries";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { levelFromXp } from "@/lib/level";
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
    title: `Únete a @${normalized} en C++ CETI`,
    description: `Aprende C++ con lecciones interactivas. @${normalized} te está invitando.`,
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
      <header className="border-b border-border/70 bg-background/80 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="-m-2 rounded-[var(--radius-sm)] p-2 transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          {session ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/app">Ir a mi app</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-xl space-y-8 px-5 py-10 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className="eyebrow text-primary">Invitación</p>
            <h1 className="mt-2 text-balance text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
              {profile.name} te invita a aprender C++
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              C++ CETI es una plataforma de práctica para alumnos del CETI
              Guadalajara — 90% código, 10% teoría, todo en español.
            </p>
          </div>

          <section className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="size-20 ring-1 ring-border ring-inset">
                {profile.image ? (
                  <AvatarImage src={profile.image} alt={profile.name} />
                ) : null}
                <AvatarFallback className="bg-primary-soft text-2xl font-semibold text-primary-soft-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-lg font-bold tracking-tight">{profile.name}</p>
                <p className="font-mono text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              </div>

              {profile.bio ? (
                <p className="max-w-sm text-sm text-foreground/90">{profile.bio}</p>
              ) : null}

              <div className="mt-2 grid w-full grid-cols-3 gap-2">
                <Stat icon={<Zap className="size-4" />} label="Nivel" value={`Nv ${lvl.level}`} />
                <Stat icon={<Sparkles className="size-4" />} label="XP" value={profile.totalXp.toLocaleString("es-MX")} />
                <Stat icon={<Flame className="size-4" />} label="Racha" value={`${profile.currentStreak}d`} />
              </div>

              {hasState(profile) ? (
                <div className="mt-4">
                  <ProfileActions
                    userId={profile.id}
                    username={profile.username}
                    state={profile.state}
                  />
                </div>
              ) : (
                <div className="mt-4 flex w-full flex-col gap-2">
                  <Button asChild size="lg" className="w-full">
                    <Link
                      href={`/registro?redirectTo=${encodeURIComponent(
                        `/invitar/${normalized}`,
                      )}`}
                    >
                      <UserPlus />
                      Crear cuenta y agregar
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full">
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
          </section>

          {session ? (
            <p className="text-center text-xs text-muted-foreground">
              <Link
                href={`/app/perfil/${profile.username}`}
                className="font-medium text-foreground hover:underline"
              >
                Ver perfil completo →
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

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface-2/40 px-3 py-2">
      <p className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
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
