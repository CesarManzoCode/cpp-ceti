import { notFound, redirect } from "next/navigation";
import { Sparkles, Trophy, User as UserIcon, Zap } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SectionRule } from "@/components/ui/section-rule";
import { StatTile } from "@/components/ui/stat-tile";
import { StreakFlame } from "@/components/ui/streak-flame";
import {
  getActivityFeed,
  getPublicProfile,
} from "@/features/friends/queries";
import { ProfileActions } from "@/features/friends/components/profile-actions";
import { ActivityFeed } from "@/features/friends/components/activity-feed";
import { BioEditor } from "@/features/profile/components/bio-editor";
import { levelFromXp } from "@/lib/level";
import { requireSession } from "@/lib/get-session";
import { pluralize } from "@/lib/utils";
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
    title: `@${normalized}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const session = await requireSession();
  const { username } = await params;
  const normalized = username.toLowerCase();

  // Si la URL no respeta el shape canónico, redirige al lowercase.
  if (username !== normalized) {
    redirect(`/app/perfil/${normalized}`);
  }
  // Filtro defensivo: si el path no es un username válido, 404.
  if (
    normalized.length < USERNAME_MIN ||
    normalized.length > USERNAME_MAX ||
    !USERNAME_PATTERN.test(normalized)
  ) {
    notFound();
  }

  const profile = await getPublicProfile(normalized, session.user.id);
  if (!profile) notFound();

  const isSelf = profile.state === "self";
  const isFriend = profile.state === "friends";

  const lvl = levelFromXp(profile.totalXp);
  const memberSince = new Date(profile.joinedAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Feed sólo para uno mismo y amigos.
  const feed = isSelf || isFriend ? await getActivityFeed(profile.id, 8) : [];

  return (
    <div
      data-page-enter
      className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <header className="rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-xs)] sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar className="size-16 ring-1 ring-border ring-inset sm:size-20">
            {profile.image ? (
              <AvatarImage src={profile.image} alt={profile.name} />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-xl font-semibold text-primary-soft-foreground sm:text-2xl">
              {initials || <UserIcon className="size-7 sm:size-8" />}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:justify-start">
              <h1 className="truncate text-[24px] font-bold tracking-[-0.025em] sm:text-[32px]">
                {profile.name}
              </h1>
              {isSelf ? (
                <Badge variant="secondary" size="sm">
                  Tú
                </Badge>
              ) : null}
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              @{profile.username}
            </p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <Sparkles className="size-3" aria-hidden />
              Miembro desde {memberSince}
            </p>
          </div>

          <div className="sm:shrink-0">
            <ProfileActions
              userId={profile.id}
              username={profile.username}
              state={profile.state}
            />
          </div>
        </div>

        {(profile.bio || isSelf) ? (
          <div className="mt-5 border-t border-border/60 pt-4">
            {isSelf ? (
              <BioEditor initialBio={profile.bio ?? ""} />
            ) : (
              <p className="text-sm text-foreground/90">{profile.bio}</p>
            )}
          </div>
        ) : null}
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
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Estadísticas</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile
            icon={<Zap />}
            label="XP totales"
            value={<AnimatedNumber value={profile.totalXp} />}
            tone="primary"
          />
          <StatTile
            icon={<StreakFlame streak={profile.currentStreak} className="size-5" />}
            label="Racha"
            value={
              <>
                <AnimatedNumber value={profile.currentStreak} />{" "}
                <span className="text-base font-medium text-muted-foreground">
                  {pluralize(profile.currentStreak, "día", "días")}
                </span>
              </>
            }
            sub={`Mejor: ${profile.longestStreak} ${pluralize(profile.longestStreak, "día", "días")}`}
            tone="warning"
          />
          <StatTile
            icon={<Trophy />}
            label="Lecciones"
            value={<AnimatedNumber value={profile.completedLessons} />}
            sub={`${profile.completedExercises} ${pluralize(profile.completedExercises, "reto resuelto", "retos resueltos")}`}
            tone="success"
          />
        </div>
      </section>

      {isSelf || isFriend ? (
        <section className="space-y-4">
          <SectionRule>Actividad reciente</SectionRule>
          <ActivityFeed events={feed} emptyHint={isSelf ? "self" : "friend"} />
        </section>
      ) : null}
    </div>
  );
}
