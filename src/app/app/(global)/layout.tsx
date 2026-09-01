import { AppShell } from "@/components/layout/app-shell";
import { getRoadmapUnits } from "@/features/roadmap/queries";
import { loadAppShellBase } from "@/lib/app-shell";
import { pickCourse, readSelectedCourseSlug } from "@/lib/course-selection";

/**
 * Shell de las rutas GLOBALES: `/app`, `/app/cursos`, `/app/logros`,
 * `/app/amigos`, `/app/perfil`, `/app/admin` y los redirects legacy. Ninguna
 * lleva el curso en la URL, así que aquí SÍ decide la cookie — es
 * exactamente la memoria para la que existe (ver `readSelectedCourseSlug`).
 *
 * El shell de `/app/c/[courseSlug]/...` vive en su propio layout
 * (`src/app/app/c/[courseSlug]/layout.tsx`) y no pasa por aquí.
 */
export default async function GlobalAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    { user, courses, courseOptions, stats, pendingFriendsCount, isAdmin },
    cookieSlug,
  ] = await Promise.all([loadAppShellBase(), readSelectedCourseSlug()]);

  // El rail muestra el curso recordado. Sin selección válida, se queda sin
  // unidades: es preferible un rail vacío a uno que muestre el curso
  // equivocado.
  const decision = pickCourse(courses, cookieSlug);
  const course = decision.kind === "course" ? decision.course : null;
  const units = course ? await getRoadmapUnits(course.id, user.id) : [];

  return (
    <AppShell
      courseSlug={course?.slug ?? null}
      courses={courseOptions}
      units={units}
      user={user}
      totalXp={stats.totalXp}
      streak={stats.currentStreak}
      pendingFriendsCount={pendingFriendsCount}
      isAdmin={isAdmin}
    >
      {children}
    </AppShell>
  );
}
