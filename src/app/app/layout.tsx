import { redirect } from "next/navigation";

import { ChromeSlot } from "@/components/layout/chrome-slot";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCourseChoices } from "@/features/courses/queries";
import { getPendingIncomingCount } from "@/features/friends/queries";
import { getRoadmapUnits } from "@/features/roadmap/queries";
import { getAdminContext } from "@/lib/admin";
import { pickCourse, readSelectedCourseSlug } from "@/lib/course-selection";
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

  // Paralelizar: cursos/stats/pending son independientes; units depende del
  // curso seleccionado.
  const [courses, selectedSlug, stats, pendingFriendsCount, adminContext] =
    await Promise.all([
      getCourseChoices(),
      readSelectedCourseSlug(),
      getUserStats(session.user.id),
      getPendingIncomingCount(session.user.id),
      // Sólo decide si se muestra el acceso al panel; la autorización real la
      // hace cada página/acción de /app/admin.
      getAdminContext(),
    ]);

  // El rail muestra el curso seleccionado. Si no hay selección válida, se
  // queda sin unidades y la navegación lleva a la pantalla de selección: es
  // preferible un rail vacío a un rail que muestre el curso equivocado.
  const decision = pickCourse(courses, selectedSlug);
  const course = decision.kind === "course" ? decision.course : null;
  const units = course
    ? await getRoadmapUnits(course.id, session.user.id)
    : [];

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar
        courseSlug={course?.slug ?? null}
        courseTitle={course?.title ?? null}
        units={units}
        pendingFriendsCount={pendingFriendsCount}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChromeSlot>
          <Topbar
            courseSlug={course?.slug ?? null}
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
            isAdmin={adminContext !== null}
          />
        </ChromeSlot>

        {/* El colchón inferior deja libre la barra de navegación móvil. */}
        <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>

        <ChromeSlot>
          <MobileNav
            courseSlug={course?.slug ?? null}
            pendingFriendsCount={pendingFriendsCount}
          />
        </ChromeSlot>
      </div>
    </div>
  );
}
