import { AppMain, ChromeSlot } from "@/components/layout/chrome-slot";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SkipLink } from "@/components/shared/skip-link";
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
  pendingFriendsCount,
  isAdmin,
  children,
}: {
  courseSlug: string | null;
  courses: CourseSwitcherItem[];
  units: RoadmapUnit[];
  user: { name: string; email: string; image?: string | null; username: string };
  pendingFriendsCount: number;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-background">
      <SkipLink href="#main-content">Saltar al contenido</SkipLink>
      <ChromeSlot>
        <Sidebar
          courseSlug={courseSlug}
          courses={courses}
          units={units}
          pendingFriendsCount={pendingFriendsCount}
        />
      </ChromeSlot>
      <div className="flex min-w-0 flex-1 flex-col">
        <ChromeSlot>
          <Topbar
            courseSlug={courseSlug}
            courses={courses}
            user={user}
            units={units}
            pendingFriendsCount={pendingFriendsCount}
            isAdmin={isAdmin}
          />
        </ChromeSlot>

        <AppMain>{children}</AppMain>

        <ChromeSlot>
          <MobileNav courseSlug={courseSlug} pendingFriendsCount={pendingFriendsCount} />
        </ChromeSlot>
      </div>
    </div>
  );
}
