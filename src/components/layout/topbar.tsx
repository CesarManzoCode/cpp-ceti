import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { TopbarLocation } from "@/components/layout/topbar-location";
import {
  CourseSwitcher,
  type CourseSwitcherItem,
} from "@/features/courses/components/course-switcher";
import type { RoadmapUnit } from "@/features/roadmap/types";

export interface TopbarProps {
  /** Curso seleccionado; `null` mientras no haya selección válida. */
  courseSlug: string | null;
  /** Cursos publicados: alimentan el selector visible en móvil. */
  courses?: CourseSwitcherItem[];
  user: { name: string; email: string; image?: string | null; username: string };
  units: RoadmapUnit[];
  pendingFriendsCount?: number;
  /** Muestra el acceso al panel interno (la autorización es server-side). */
  isAdmin?: boolean;
}

/**
 * Barra superior. Sólo dónde estoy, el tema y mi cuenta (blueprint
 * UX/UI, D2): XP y racha son evidencia de aprendizaje, no navegación —
 * viven en Inicio y en el perfil, nunca aquí, para que no compitan con
 * la tarea en curso.
 */
export function Topbar({
  courseSlug,
  courses = [],
  user,
  units,
  pendingFriendsCount = 0,
  isAdmin = false,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-1.5 border-b border-border bg-background/90 px-3 backdrop-blur-md sm:gap-2 sm:px-6">
      <TopbarLocation units={units} />

      {/* En móvil no hay rail: el curso actual —y su cambio— viven aquí.
          En escritorio el control está en el rail y no se duplica. */}
      {courses.length > 0 ? (
        <CourseSwitcher
          courses={courses}
          activeSlug={courseSlug}
          variant="compact"
          className="lg:hidden"
        />
      ) : null}

      <div className="min-w-2 flex-1" />

      <div className="flex items-center gap-0.5 sm:gap-1">
        <ThemeToggle />
        <UserMenu
          courseSlug={courseSlug}
          user={user}
          pendingFriendsCount={pendingFriendsCount}
          isAdmin={isAdmin}
        />
      </div>
    </header>
  );
}
