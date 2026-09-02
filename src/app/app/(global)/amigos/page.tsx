import { SectionRule } from "@/components/ui/section-rule";
import { getDiscoveryCandidates } from "@/features/discovery/queries";
import { FriendRankingList } from "@/features/league/components/friend-ranking-list";
import { getFriendWeeklyRanking } from "@/features/league/queries";
import { emptyPropsSchema } from "@/lib/analytics/social-props";
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

  const [friends, incoming, outgoing, discovery, feed, streaks, reminders, ranking, params] = await Promise.all([
    getFriends(userId),
    getPendingIncoming(userId),
    getPendingOutgoing(userId),
    getDiscoveryCandidates(userId, { courseId: course?.id ?? null }),
    getSocialFeed(userId),
    getMyFriendStreaks(userId),
    getMyStreakReminders(userId),
    getFriendWeeklyRanking(userId),
    searchParams,
  ]);

  if (ranking.length > 1) {
    await recordProductEventSafely(db, {
      userId,
      name: "friends_ranking_view",
      surface: "social",
      props: emptyPropsSchema.parse({}),
    });
  }

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

      {ranking.length > 1 ? (
        <section className="mt-8">
          <SectionRule trailing="XP de esta semana">Ranking semanal</SectionRule>
          <div className="mt-4">
            <FriendRankingList rows={ranking} />
          </div>
        </section>
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
