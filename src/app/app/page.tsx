import { redirect } from "next/navigation";

import { CoursePicker } from "@/features/courses/components/course-picker";
import { getCourseChoices } from "@/features/courses/queries";
import { LANGUAGE_PROFILES, isLanguageId } from "@/lib/code-languages";
import { pickCourse, readSelectedCourseSlug } from "@/lib/course-selection";
import { getSession } from "@/lib/get-session";

export const metadata = {
  title: "Tus cursos",
};

/**
 * Entrada de la app.
 *
 * Con un curso, entra directo. Con varios, pregunta — y sólo salta la
 * pregunta si el alumno ya eligió antes. Elegir por él "el primero" es
 * exactamente el error que separa a un alumno de POO I de su curso.
 */
export default async function AppEntryPage() {
  const session = await getSession();
  if (!session?.user) return null;

  const [courses, selectedSlug] = await Promise.all([
    getCourseChoices(),
    readSelectedCourseSlug(),
  ]);

  const decision = pickCourse(courses, selectedSlug);
  if (decision.kind === "course") {
    redirect(`/app/c/${decision.course.slug}`);
  }

  return (
    <div
      data-page-enter
      className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          {decision.kind === "empty" ? "Todavía no hay cursos" : "Elige tu curso"}
        </h1>
        <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          {decision.kind === "empty"
            ? "Cuando se publique un curso lo verás aquí."
            : "Cada curso tiene su propio camino, su propia práctica y su propio progreso. Puedes cambiar de curso cuando quieras."}
        </p>
      </header>

      {decision.kind === "choose" ? (
        <CoursePicker
          courses={courses.map((course) => ({
            slug: course.slug,
            title: course.title,
            description: course.description,
            subjectName: course.subjectName,
            academicContext: course.academicContext,
            languageLabel: isLanguageId(course.language)
              ? LANGUAGE_PROFILES[course.language].label
              : course.language,
            unitCount: course.unitCount,
            lessonCount: course.lessonCount,
          }))}
        />
      ) : null}
    </div>
  );
}
