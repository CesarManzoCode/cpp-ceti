import { ChromeSlot } from "@/components/layout/chrome-slot";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { CourseSwitcherItem } from "@/features/courses/components/course-switcher";
import type { RoadmapUnit } from "@/features/roadmap/types";

/**
 * Cáscara de toda ruta autenticada: rail + barra superior + nav móvil
 * alrededor del contenido de la página.
 *
 * Deliberadamente NO decide cuál es el curso activo ni sus unidades — eso
 * lo hace quien la use (el layout de rutas globales o el de
 * `/app/c/[courseSlug]`), cada uno con su propia fuente de verdad. Aquí
 * sólo se pintan los props que ya llegan resueltos.
 */
export function AppShell({
  courseSlug,
  courses,
  units,
  user,
  totalXp,
  streak,
  pendingFriendsCount,
  isAdmin,
  children,
}: {
  courseSlug: string | null;
  courses: CourseSwitcherItem[];
  units: RoadmapUnit[];
  user: { name: string; email: string; image?: string | null; username: string };
  totalXp: number;
  streak: number;
  pendingFriendsCount: number;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar
        courseSlug={courseSlug}
        courses={courses}
        units={units}
        pendingFriendsCount={pendingFriendsCount}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChromeSlot>
          <Topbar
            courseSlug={courseSlug}
            courses={courses}
            user={user}
            totalXp={totalXp}
            streak={streak}
            units={units}
            pendingFriendsCount={pendingFriendsCount}
            isAdmin={isAdmin}
          />
        </ChromeSlot>

        {/* El colchón inferior deja libre la barra de navegación móvil. */}
        <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>

        <ChromeSlot>
          <MobileNav courseSlug={courseSlug} pendingFriendsCount={pendingFriendsCount} />
        </ChromeSlot>
      </div>
    </div>
  );
}
