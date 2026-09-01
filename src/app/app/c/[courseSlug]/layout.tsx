import { AppShell } from "@/components/layout/app-shell";
import { getRoadmapUnits } from "@/features/roadmap/queries";
import { loadAppShellBase } from "@/lib/app-shell";

/**
 * Shell de `/app/c/[courseSlug]/...`.
 *
 * Este layout vive DENTRO del segmento dinámico `[courseSlug]`: cuando el
 * alumno cambia de curso con el switcher (un `<Link>`, navegación de
 * cliente), el segmento cambia de `csharp-poo-1` a `cpp-desde-cero` y React
 * vuelve a montar este layout con el `courseSlug` nuevo — a diferencia de un
 * layout compartido más arriba en el árbol (como el de `/app`), que Next
 * PRESERVA entre navegaciones de cliente si el segmento que lo contiene no
 * cambió. Ese layout compartido era justo el bug: mostraba el curso viejo
 * hasta un hard refresh, porque nunca se volvía a ejecutar.
 *
 * Por eso el curso activo sale del parámetro de ruta, sin pasar por cookie
 * ni por ningún header del middleware: la URL ya es la fuente de verdad en
 * cuanto React reconcilia este segmento.
 */
export default async function CourseAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const { user, courses, courseOptions, stats, pendingFriendsCount, isAdmin } =
    await loadAppShellBase();

  const course = courses.find((c) => c.slug === courseSlug) ?? null;
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
