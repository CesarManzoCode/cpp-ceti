import { cache } from "react";

import { db } from "@/lib/db";

import type { NextLesson, RoadmapUnit } from "./types";

/**
 * Curso "principal" — solo hay uno (C++ desde cero). Si en el futuro
 * hay más, esta función elige el primero.
 *
 * Envuelto en `cache()` para que el layout y la page del dashboard NO
 * dupliquen la query en el mismo request.
 */
export const getDefaultCourse = cache(async () => {
  return db.course.findFirst({
    where: { published: true },
    orderBy: { order: "asc" },
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
    },
  });

  return units.map((u) => ({
    slug: u.slug,
    title: u.title,
    order: u.order,
    published: u.published,
    lessonCount: u.lessons.length,
    completedCount: u.lessons.filter((l) => l.progress.length > 0).length,
  }));
});

/**
 * Próxima lección a estudiar — la que el usuario tiene en curso si
 * existe, o la primera lección publicada que aún no ha completado.
 * `null` si el curso entero está al día.
 */
export async function findNextLesson(userId: string): Promise<NextLesson | null> {
  const [inProgress, completedProgress] = await Promise.all([
    db.userLessonProgress.findFirst({
      where: { userId, status: "in_progress" },
      orderBy: { startedAt: "desc" },
      include: { lesson: { include: { unit: true } } },
    }),
    db.userLessonProgress.findMany({
      where: { userId, status: "completed" },
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
      unit: { published: true },
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
