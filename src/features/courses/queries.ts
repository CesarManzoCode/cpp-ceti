import { cache } from "react";

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
        select: { _count: { select: { lessons: true } } },
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
  }));
});
