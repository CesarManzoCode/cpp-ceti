import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrickRow } from "@/components/ui/bricks";
import { Button } from "@/components/ui/button";
import { CoursePicker } from "@/features/courses/components/course-picker";
import { getCourseOverviews } from "@/features/courses/queries";
import { LANGUAGE_PROFILES, isLanguageId } from "@/lib/code-languages";
import { readSelectedCourseSlug } from "@/lib/course-selection";
import { getSession } from "@/lib/get-session";

export const metadata = {
  title: "Tus cursos",
};

/**
 * "Tus cursos": la superficie ESTABLE del modelo multicurso.
 *
 * `/app` sigue llevando al curso recordado —entrar rápido es lo correcto
 * para quien sólo lleva una materia—, pero esta URL nunca redirige. Es el
 * lugar al que apunta el selector desde escritorio y móvil, y el que
 * responde a "¿dónde quedó mi otro curso?".
 */
export default async function TusCursosPage() {
  const session = await getSession();
  if (!session?.user) return null;

  const [courses, selectedSlug] = await Promise.all([
    getCourseOverviews(session.user.id),
    readSelectedCourseSlug(),
  ]);

  const active = courses.find((c) => c.slug === selectedSlug) ?? null;

  return (
    <div
      data-page-enter
      className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          {courses.length === 0 ? "Todavía no hay cursos" : "Tus cursos"}
        </h1>
        <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          {courses.length === 0
            ? "Cuando se publique un curso lo verás aquí."
            : "Cada curso tiene su propio camino, su propia práctica y su propio progreso. Puedes cambiar de curso cuando quieras. Tu XP, tu racha, tus logros y tus amigos son de tu cuenta y no cambian al cambiar de curso."}
        </p>
      </header>

      {courses.length > 0 && active === null ? (
        // Sin curso recordado esto ES la pantalla de selección: entrar a uno
        // lo deja como curso actual.
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

      {courses.length > 0 && active !== null ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const isActive = course.slug === active.slug;
            const languageLabel = isLanguageId(course.language)
              ? LANGUAGE_PROFILES[course.language].label
              : course.language;

            return (
              <li key={course.slug}>
                <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-tint px-2.5 py-1 text-[12px] font-bold text-primary">
                      {languageLabel}
                    </span>
                    {isActive ? (
                      <span className="rounded-full bg-success-soft px-2.5 py-1 text-[12px] font-bold text-success">
                        Curso actual
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-3 text-[20px] font-extrabold leading-snug tracking-[-0.02em]">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-[13px] font-semibold text-muted-foreground">
                    {course.subjectName}
                  </p>

                  <div className="mt-5 flex flex-1 items-end">
                    <div className="w-full">
                      <p className="text-[13px] font-semibold tabular-nums text-muted-foreground">
                        Progreso en este curso: {course.completedLessonCount}/
                        {course.lessonCount} lecciones
                      </p>
                      {course.lessonCount > 0 ? (
                        <BrickRow
                          className="mt-2"
                          size="sm"
                          total={course.lessonCount}
                          done={course.completedLessonCount}
                          tone={
                            course.completedLessonCount === course.lessonCount
                              ? "success"
                              : "primary"
                          }
                          srLabel={`${course.completedLessonCount} de ${course.lessonCount} lecciones`}
                        />
                      ) : null}
                    </div>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant={isActive ? "default" : "secondary"}
                    className="mt-5 w-full"
                  >
                    {/* Entrar por la ruta del curso: el layout recuerda la
                        selección al abrirlo. */}
                    <Link href={`/app/c/${course.slug}`}>
                      {course.completedLessonCount > 0 ? "Continuar" : "Empezar"}
                      <ArrowRight />
                    </Link>
                  </Button>
                </article>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
