import { notFound, redirect } from "next/navigation";
import { User as UserIcon } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LevelBar } from "@/components/ui/level-bar";
import { Readout, ReadoutBar } from "@/components/ui/readout";
import { SectionRule } from "@/components/ui/section-rule";
import { StreakFlame } from "@/components/ui/streak-flame";
import { getActivityFeed, getPublicProfile } from "@/features/friends/queries";
import { ProfileActions } from "@/features/friends/components/profile-actions";
import { ActivityFeed } from "@/features/friends/components/activity-feed";
import { BioEditor } from "@/features/profile/components/bio-editor";
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
      className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <div className="flex items-start gap-4">
          <Avatar className="size-16 shrink-0 ring-1 ring-inset ring-border sm:size-20">
            {profile.image ? (
              <AvatarImage src={profile.image} alt={profile.name} />
            ) : null}
            <AvatarFallback className="bg-primary-soft text-xl font-bold text-primary-soft-foreground">
              {initials || <UserIcon className="size-7" />}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h1 className="truncate text-[24px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[30px]">
                {profile.name}
              </h1>
              {isSelf ? (
                <Badge variant="secondary" size="sm">
                  Tú
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 font-mono text-[15px] text-muted-foreground">
              @{profile.username}
            </p>
            <p className="mt-1 text-[13px] font-medium text-subtle-foreground">
              Miembro desde {memberSince}
            </p>
          </div>

          <div className="shrink-0">
            <ProfileActions
              userId={profile.id}
              username={profile.username}
              state={profile.state}
            />
          </div>
        </div>

        {profile.bio || isSelf ? (
          <div className="mt-5">
            {isSelf ? (
              <BioEditor initialBio={profile.bio ?? ""} />
            ) : (
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-foreground">
                {profile.bio}
              </p>
            )}
          </div>
        ) : null}
      </header>

      <LevelBar totalXp={profile.totalXp} className="mt-7" />

      <section className="mt-9">
        <SectionRule>Estadísticas</SectionRule>
        <ReadoutBar className="mt-4">
          <Readout
            label="XP totales"
            value={<AnimatedNumber value={profile.totalXp} />}
          />
          <Readout
            label="Racha"
            mark={
              <StreakFlame streak={profile.currentStreak} className="size-4" />
            }
            value={
              <>
                <AnimatedNumber value={profile.currentStreak} />
                <span className="ml-1 text-[17px] font-semibold text-muted-foreground">
                  {pluralize(profile.currentStreak, "día", "días")}
                </span>
              </>
            }
            sub={`Mejor: ${profile.longestStreak} ${pluralize(profile.longestStreak, "día", "días")}`}
          />
          <Readout
            className="col-span-2 sm:col-span-1"
            label="Lecciones"
            value={<AnimatedNumber value={profile.completedLessons} />}
            sub={`${profile.completedExercises} ${pluralize(
              profile.completedExercises,
              "reto resuelto",
              "retos resueltos",
            )}`}
          />
        </ReadoutBar>
      </section>

      {isSelf || isFriend ? (
        <section className="mt-10">
          <SectionRule>Actividad reciente</SectionRule>
          <div className="mt-4">
            <ActivityFeed events={feed} emptyHint={isSelf ? "self" : "friend"} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
