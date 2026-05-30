import { cache } from "react";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";

export const getUnitBySlug = cache(async (
  courseSlug: string,
  unitSlug: string,
  userId: string,
) => {
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
  });
  if (!course) return null;

  const unit = await db.unit.findUnique({
    where: { courseId_slug: { courseId: course.id, slug: unitSlug } },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          steps: { select: { id: true } },
          progress: {
            where: { userId },
            select: {
              status: true,
              xpEarned: true,
              completedAt: true,
            },
          },
        },
      },
    },
  });
  if (!unit || !unit.published) return null;

  return {
    ...unit,
    lessons: unit.lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      description: l.description,
      order: l.order,
      xpReward: l.xpReward,
      estimatedMinutes: l.estimatedMinutes,
      stepCount: l.steps.length,
      status: l.progress[0]?.status ?? "not_started",
    })),
  };
});

export const getLessonBySlug = cache(async (
  courseSlug: string,
  unitSlug: string,
  lessonSlug: string,
  userId: string,
) => {
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
  });
  if (!course) notFound();

  const unit = await db.unit.findUnique({
    where: { courseId_slug: { courseId: course.id, slug: unitSlug } },
  });
  if (!unit || !unit.published) notFound();

  const lesson = await db.lesson.findUnique({
    where: { unitId_slug: { unitId: unit.id, slug: lessonSlug } },
    include: {
      steps: {
        orderBy: { order: "asc" },
        include: {
          exercise: {
            include: {
              testCases: {
                orderBy: { order: "asc" },
                where: { visible: true },
                select: {
                  id: true,
                  stdin: true,
                  expectedStdout: true,
                  description: true,
                  visible: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!lesson || !lesson.published) notFound();

  // Pasos ya completados por el usuario
  const completedStepIds = new Set(
    (
      await db.userStepProgress.findMany({
        where: {
          userId,
          stepId: { in: lesson.steps.map((s) => s.id) },
        },
        select: { stepId: true },
      })
    ).map((s) => s.stepId),
  );

  // Último intento por ejercicio (para hidratar el editor al volver).
  const exerciseIds = lesson.steps
    .map((s) => s.exercise?.id)
    .filter((id): id is string => Boolean(id));
  const latestAttempts = exerciseIds.length
    ? await db.userExerciseAttempt.findMany({
        where: { userId, exerciseId: { in: exerciseIds } },
        orderBy: { createdAt: "desc" },
        distinct: ["exerciseId"],
        select: { exerciseId: true, code: true },
      })
    : [];
  const latestCodeByExercise = new Map(
    latestAttempts.map((a) => [a.exerciseId, a.code]),
  );

  // Lección siguiente para navegación
  const nextInUnit = await db.lesson.findFirst({
    where: {
      unitId: unit.id,
      published: true,
      order: { gt: lesson.order },
    },
    orderBy: { order: "asc" },
    select: { slug: true, title: true },
  });

  let nextLessonLink: { href: string; title: string } | null = null;
  if (nextInUnit) {
    nextLessonLink = {
      href: `/app/u/${unit.slug}/${nextInUnit.slug}`,
      title: nextInUnit.title,
    };
  } else {
    const nextUnit = await db.unit.findFirst({
      where: {
        courseId: course.id,
        published: true,
        order: { gt: unit.order },
      },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          where: { published: true },
          orderBy: { order: "asc" },
          take: 1,
          select: { slug: true, title: true },
        },
      },
    });
    if (nextUnit && nextUnit.lessons[0]) {
      nextLessonLink = {
        href: `/app/u/${nextUnit.slug}/${nextUnit.lessons[0].slug}`,
        title: nextUnit.lessons[0].title,
      };
    }
  }

  // Cargar/crear el progreso de la lección
  const progress = await db.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
  });

  return {
    course,
    unit,
    lesson: {
      ...lesson,
      steps: lesson.steps.map((s) => ({
        ...s,
        completed: completedStepIds.has(s.id),
        bestAttemptCode: s.exercise
          ? (latestCodeByExercise.get(s.exercise.id) ?? null)
          : null,
      })),
    },
    progress,
    nextLessonLink,
  };
});

/**
 * Conteo de lecciones que el usuario ya completó. Usado por la página
 * de logros y de perfil.
 */
export const getCompletedLessonsCount = cache((userId: string) =>
  db.userLessonProgress.count({
    where: { userId, status: "completed" },
  }),
);

/**
 * Número de ejercicios DISTINTOS que el usuario ha aprobado al menos
 * una vez (los intentos repetidos no cuentan). Solo cuenta ejercicios
 * de lecciones, no de práctica.
 */
export const getDistinctExercisesPassedCount = cache(async (userId: string) => {
  const rows = await db.userExerciseAttempt.findMany({
    where: { userId, passed: true },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
  });
  return rows.length;
});

/** Intentos totales de ejercicios de lección (incluye repetidos). */
export const getExerciseAttemptsCount = cache((userId: string) =>
  db.userExerciseAttempt.count({ where: { userId } }),
);
