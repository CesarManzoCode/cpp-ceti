import { redirect } from "next/navigation";

import { ChromeSlot } from "@/components/layout/chrome-slot";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCourseChoices } from "@/features/courses/queries";
import { LANGUAGE_PROFILES, isLanguageId } from "@/lib/code-languages";
import { getPendingIncomingCount } from "@/features/friends/queries";
import { getRoadmapUnits } from "@/features/roadmap/queries";
import { getAdminContext } from "@/lib/admin";
import {
  pickCourse,
  readCourseSlugFromRoute,
  readSelectedCourseSlug,
} from "@/lib/course-selection";
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
  const [
    courses,
    urlSlug,
    cookieSlug,
    stats,
    pendingFriendsCount,
    adminContext,
  ] = await Promise.all([
    getCourseChoices(),
    readCourseSlugFromRoute(),
    readSelectedCourseSlug(),
    getUserStats(session.user.id),
    getPendingIncomingCount(session.user.id),
    // Sólo decide si se muestra el acceso al panel; la autorización real la
    // hace cada página/acción de /app/admin.
    getAdminContext(),
  ]);

  // El rail muestra el curso de la URL en cuanto la ruta es `/app/c/...`
  // (`urlSlug`, puesto por el middleware); la cookie sólo decide en rutas
  // globales como `/app` o `/app/cursos`. Si no hay selección válida, el
  // rail se queda sin unidades y la navegación lleva a la pantalla de
  // selección: es preferible un rail vacío a un rail que muestre el curso
  // equivocado.
  const decision = pickCourse(courses, cookieSlug, urlSlug);
  const course = decision.kind === "course" ? decision.course : null;
  const units = course
    ? await getRoadmapUnits(course.id, session.user.id)
    : [];

  // El selector de curso vive en el shell: rail en escritorio, barra
  // superior en móvil. Así "cambiar de curso" existe en cualquier ruta
  // autenticada y no sólo en la pantalla de selección.
  const courseOptions = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    languageLabel: isLanguageId(c.language)
      ? LANGUAGE_PROFILES[c.language].label
      : c.language,
  }));

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar
        courseSlug={course?.slug ?? null}
        courses={courseOptions}
        units={units}
        pendingFriendsCount={pendingFriendsCount}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChromeSlot>
          <Topbar
            courseSlug={course?.slug ?? null}
            courses={courseOptions}
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
