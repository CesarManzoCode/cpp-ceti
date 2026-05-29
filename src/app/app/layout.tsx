import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TopbarSlot } from "@/components/layout/topbar-slot";
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

  // Paralelizar: course y stats son independientes; units depende de course.
  const [course, stats] = await Promise.all([
    getDefaultCourse(),
    getUserStats(session.user.id),
  ]);
  const units = course
    ? await getRoadmapUnits(course.id, session.user.id)
    : [];

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar units={units} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarSlot>
          <Topbar
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            }}
            totalXp={stats.totalXp}
            streak={stats.currentStreak}
            units={units}
          />
        </TopbarSlot>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
