import { cache } from "react";

import { formatSemesterSummary } from "@/lib/curriculum";
import { db } from "@/lib/db";

export interface CourseChoice {
  id: string;
  slug: string;
  title: string;
  description: string;
  subjectName: string;
  academicContext: string;
  language: string;
  unitCount: number;
  lessonCount: number;
  /** `null` si el curso no declara `curriculum` (ver `prisma/content/types.ts`). */
  curriculumSummary: string | null;
}

/**
 * Cursos publicados con lo justo para elegir entre ellos. Los conteos son
 * por curso — nunca globales: un total que mezclara dos cursos no le diría
 * nada al alumno sobre el que va a abrir.
 */
export const getCourseChoices = cache(async (): Promise<CourseChoice[]> => {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { slug: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      subjectName: true,
      academicContext: true,
      language: true,
      units: {
        where: { published: true },
        // Sólo lecciones publicadas: el conteo describe lo que el alumno
        // puede abrir hoy, no lo que existe en la base.
        select: { _count: { select: { lessons: { where: { published: true } } } } },
      },
      curriculumSections: {
        orderBy: { order: "asc" },
        select: { semester: true },
      },
    },
  });

  return courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    subjectName: course.subjectName,
    academicContext: course.academicContext,
    language: course.language,
    unitCount: course.units.length,
    lessonCount: course.units.reduce((n, u) => n + u._count.lessons, 0),
    curriculumSummary: formatSemesterSummary(
      course.curriculumSections.map((s) => s.semester),
    ),
  }));
});

export interface CourseOverview extends CourseChoice {
  /** Lecciones completadas por el alumno DENTRO de este curso. */
  completedLessonCount: number;
}

/**
 * Cursos publicados con el avance del alumno en cada uno — lo que necesita
 * la pantalla "Tus cursos" para decidir a cuál entrar.
 *
 * El avance se cuenta por curso, nunca sumado: "12 de 67" en C++ y "3 de 23"
 * en C# son dos hechos distintos y mezclarlos no describiría ninguno.
 */
export const getCourseOverviews = cache(
  async (userId: string): Promise<CourseOverview[]> => {
    const [courses, completed] = await Promise.all([
      getCourseChoices(),
      db.userLessonProgress.findMany({
        where: {
          userId,
          status: "completed",
          lesson: { published: true, unit: { published: true } },
        },
        select: { lesson: { select: { unit: { select: { courseId: true } } } } },
      }),
    ]);

    const doneByCourse = new Map<string, number>();
    for (const row of completed) {
      const courseId = row.lesson.unit.courseId;
      doneByCourse.set(courseId, (doneByCourse.get(courseId) ?? 0) + 1);
    }

    return courses.map((course) => ({
      ...course,
      completedLessonCount: doneByCourse.get(course.id) ?? 0,
    }));
  },
);
