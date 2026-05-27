import { cache } from "react";

import { db } from "@/lib/db";
import type { SidebarUnit } from "@/components/app/sidebar-nav";

/**
 * El curso "principal" — por ahora solo hay uno (C++ desde cero).
 * Si en el futuro hay más, esta función elige el primero.
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
 * Devuelve las unidades de un curso con el conteo de lecciones completadas
 * por el usuario indicado. Diseñado para la sidebar.
 */
export const getSidebarUnits = cache(async (
  courseId: string,
  userId: string,
): Promise<SidebarUnit[]> => {
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

/** Streak + XP totales del usuario para el topbar. */
export const getUserStats = cache(async (userId: string) => {
  const streak = await db.userStreak.findUnique({
    where: { userId },
  });
  return {
    totalXp: streak?.totalXp ?? 0,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
  };
});
