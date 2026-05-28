import { redirect } from "next/navigation";

import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { TopbarSlot } from "@/components/app/topbar-slot";
import {
  getDefaultCourse,
  getSidebarUnits,
  getUserStats,
} from "@/lib/courses";
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
    ? await getSidebarUnits(course.id, session.user.id)
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
