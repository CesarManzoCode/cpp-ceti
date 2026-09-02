import { randomUUID } from "node:crypto";

import { SectionRule } from "@/components/ui/section-rule";
import { getDiscoveryCandidates } from "@/features/discovery/queries";
import { discoveryImpressionPropsSchema } from "@/lib/analytics/social-props";
import { recordProductEventSafely } from "@/lib/analytics/record";
import { FriendsTabs } from "@/features/friends/components/friends-tabs";
import { InviteLinkCard } from "@/features/friends/components/invite-link-card";
import {
  getFriends,
  getPendingIncoming,
  getPendingOutgoing,
} from "@/features/friends/queries";
import { getSocialFeed } from "@/features/social-feed/queries";
import { getMyFriendStreaks, getMyStreakReminders } from "@/features/streaks/queries";
import { readSelectedCourseSlug } from "@/lib/course-selection";
import { db } from "@/lib/db";
import { requireConfirmedUsername } from "@/lib/get-session";

export const metadata = {
  title: "Amigos",
};

export default async function AmigosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Amigos depende de una identidad pública estable — con username
  // provisional (OAuth sin confirmar) redirige a completarlo primero.
  const session = await requireConfirmedUsername();
  const userId = session.user.id;

  const courseSlug = await readSelectedCourseSlug();
  const course = courseSlug
    ? await db.course.findUnique({ where: { slug: courseSlug, published: true }, select: { id: true } })
    : null;

  const [friends, incoming, outgoing, discovery, feed, streaks, reminders, params] = await Promise.all([
    getFriends(userId),
    getPendingIncoming(userId),
    getPendingOutgoing(userId),
    getDiscoveryCandidates(userId, { courseId: course?.id ?? null }),
    getSocialFeed(userId),
    getMyFriendStreaks(userId),
    getMyStreakReminders(userId),
    searchParams,
  ]);

  const bucketCounts: Record<string, number> = {};
  for (const c of discovery.candidates) bucketCounts[c.bucket] = (bucketCounts[c.bucket] ?? 0) + 1;
  await recordProductEventSafely(db, {
    userId,
    name: "discovery_impression",
    surface: "social",
    props: discoveryImpressionPropsSchema.parse({
      discoverySessionKey: randomUUID(),
      resultCount: discovery.candidates.length,
      bucketCounts,
    }),
  });

  const initialTab =
    params.tab === "solicitudes" ||
    params.tab === "buscar" ||
    params.tab === "descubrir" ||
    params.tab === "actividad" ||
    params.tab === "rachas"
      ? params.tab
      : incoming.length > 0
        ? "solicitudes"
        : "amigos";

  return (
    <div
      data-page-enter
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          Amigos
        </h1>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Agrega compañeros del CETI para ver su progreso y motivarse
          mutuamente.
        </p>
      </header>

      {friends.length === 0 && incoming.length === 0 && outgoing.length === 0 ? (
        <EmptyAmigos username={session.user.username} />
      ) : null}

      <div className="mt-8">
        <FriendsTabs
          initialTab={initialTab}
          friends={friends}
          incoming={incoming}
          outgoing={outgoing}
          meUsername={session.user.username}
          meId={userId}
          discovery={discovery}
          feed={feed.events}
          streaks={streaks}
          reminders={reminders}
        />
      </div>

      <section className="mt-10">
        <SectionRule>Invita a alguien</SectionRule>
        <div className="mt-4">
          <InviteLinkCard username={session.user.username} />
        </div>
      </section>
    </div>
  );
}

function EmptyAmigos({ username }: { username: string }) {
  return (
    <div className="mt-8 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-5 sm:p-6">
      <h2 className="text-balance text-[19px] font-bold leading-snug">
        Aún no tienes amigos aquí.
      </h2>
      <p className="mt-2 max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground">
        Busca a tus compañeros por{" "}
        <span className="font-mono font-semibold text-foreground">@usuario</span>{" "}
        o mándales tu link de invitación. Cuando acepten verás su progreso en
        tu inicio.
      </p>
      <p className="mt-2.5 text-[14px] text-muted-foreground">
        Tu handle es{" "}
        <span className="font-mono font-semibold text-foreground">
          @{username}
        </span>
        .
      </p>
    </div>
  );
}
