import { cache } from "react";

import { db } from "@/lib/db";

import type { NextLesson, RoadmapUnit } from "./types";

/**
 * Curso por slug — la única forma correcta de obtener un curso.
 *
 * Envuelto en `cache()` para que el layout y la page del dashboard NO
 * dupliquen la query en el mismo request.
 */
export const getCourseBySlug = cache(async (slug: string) => {
  return db.course.findFirst({
    where: { slug, published: true },
  });
});

/** Cursos publicados, en orden de presentación. */
export const getPublishedCourses = cache(async () => {
  return db.course.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { slug: "asc" }],
  });
});

/**
 * Unidades del curso con el conteo de lecciones completadas por el
 * usuario indicado. Diseñado para la sidebar y el dashboard.
 */
export const getRoadmapUnits = cache(async (
  courseId: string,
  userId: string,
): Promise<RoadmapUnit[]> => {
  const units = await db.unit.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      order: true,
      published: true,
      lessons: {
        where: { published: true },
        select: {
          id: true,
          progress: {
            where: { userId, status: "completed" },
            select: { id: true },
          },
        },
      },
      curriculumSection: {
        select: { key: true, semester: true, subjectName: true, order: true },
      },
    },
  });

  return units.map((u) => ({
    slug: u.slug,
    title: u.title,
    order: u.order,
    published: u.published,
    lessonCount: u.lessons.length,
    completedCount: u.lessons.filter((l) => l.progress.length > 0).length,
    curriculumSection: u.curriculumSection,
  }));
});

/**
 * Próxima lección a estudiar DENTRO de un curso — la que el usuario tiene
 * en curso si existe, o la primera lección publicada que aún no ha
 * completado. `null` si ese curso está al día.
 *
 * El `courseId` no es opcional: sin él, un alumno que dejó una lección a
 * medias en C++ vería ese "continuar" desde el curso de C#.
 */
export async function findNextLesson(
  userId: string,
  courseId: string,
): Promise<NextLesson | null> {
  const [inProgress, completedProgress] = await Promise.all([
    db.userLessonProgress.findFirst({
      where: {
        userId,
        status: "in_progress",
        lesson: { unit: { courseId } },
      },
      orderBy: { startedAt: "desc" },
      include: { lesson: { include: { unit: true } } },
    }),
    db.userLessonProgress.findMany({
      where: { userId, status: "completed", lesson: { unit: { courseId } } },
      select: { lessonId: true },
    }),
  ]);

  if (inProgress) {
    return {
      lessonSlug: inProgress.lesson.slug,
      lessonTitle: inProgress.lesson.title,
      unitSlug: inProgress.lesson.unit.slug,
      unitTitle: inProgress.lesson.unit.title,
      unitOrder: inProgress.lesson.unit.order,
      estimatedMinutes: inProgress.lesson.estimatedMinutes,
      status: "in_progress",
    };
  }

  const completedIds = completedProgress.map((p) => p.lessonId);
  const next = await db.lesson.findFirst({
    where: {
      published: true,
      unit: { published: true, courseId },
      id: { notIn: completedIds.length ? completedIds : undefined },
    },
    orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    include: { unit: true },
  });

  if (!next) return null;

  return {
    lessonSlug: next.slug,
    lessonTitle: next.title,
    unitSlug: next.unit.slug,
    unitTitle: next.unit.title,
    unitOrder: next.unit.order,
    estimatedMinutes: next.estimatedMinutes,
    status: "not_started",
  };
}
