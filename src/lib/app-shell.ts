import { redirect } from "next/navigation";

import type { CourseSwitcherItem } from "@/features/courses/components/course-switcher";
import { getCourseChoices } from "@/features/courses/queries";
import { getPendingIncomingCount } from "@/features/friends/queries";
import { getAdminContext } from "@/lib/admin";
import { LANGUAGE_PROFILES, isLanguageId } from "@/lib/code-languages";
import { getSession } from "@/lib/get-session";
import { getUserStats } from "@/lib/streak";

/**
 * Datos del shell (`AppShell`) que NO dependen del curso: sesión, cursos
 * publicados, XP/racha de la cuenta, solicitudes pendientes y si se
 * muestra el acceso al panel interno.
 *
 * Comparte esto entre el layout de rutas globales
 * (`src/app/app/(global)/layout.tsx`) y el de rutas de curso
 * (`src/app/app/c/[courseSlug]/layout.tsx`) para no duplicar las mismas
 * cinco consultas en los dos sitios; lo que SÍ difiere entre ambos —cuál es
 * el curso activo y sus unidades— se decide en cada layout por separado,
 * porque es justo ahí donde estaba el bug: un layout compartido por rutas
 * de distinto curso no se vuelve a montar en navegación de cliente.
 */
export async function loadAppShellBase() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?redirectTo=/app");
  }

  const [courses, stats, pendingFriendsCount, adminContext] =
    await Promise.all([
      getCourseChoices(),
      getUserStats(session.user.id),
      getPendingIncomingCount(session.user.id),
      // Sólo decide si se muestra el acceso al panel; la autorización real la
      // hace cada página/acción de /app/admin.
      getAdminContext(),
    ]);

  const courseOptions: CourseSwitcherItem[] = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    languageLabel: isLanguageId(c.language)
      ? LANGUAGE_PROFILES[c.language].label
      : c.language,
    curriculumSummary: c.curriculumSummary,
  }));

  return {
    user: session.user,
    courses,
    courseOptions,
    stats,
    pendingFriendsCount,
    isAdmin: adminContext !== null,
  };
}
