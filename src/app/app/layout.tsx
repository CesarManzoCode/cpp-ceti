import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TopbarSlot } from "@/components/layout/topbar-slot";
import { getPendingIncomingCount } from "@/features/friends/queries";
import { getDefaultCourse, getRoadmapUnits } from "@/features/roadmap/queries";
import { getUserStats } from "@/lib/streak";
import { getSession } from "@/lib/get-session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?redirectTo=/app");
  }

  // Paralelizar: course/stats/pending son independientes; units depende de course.
  const [course, stats, pendingFriendsCount] = await Promise.all([
    getDefaultCourse(),
    getUserStats(session.user.id),
    getPendingIncomingCount(session.user.id),
  ]);
  const units = course
    ? await getRoadmapUnits(course.id, session.user.id)
    : [];

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar units={units} pendingFriendsCount={pendingFriendsCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarSlot>
          <Topbar
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
              username: session.user.username,
            }}
            totalXp={stats.totalXp}
            streak={stats.currentStreak}
            units={units}
            pendingFriendsCount={pendingFriendsCount}
          />
        </TopbarSlot>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
