"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { buildFeedback, getCodeExecutor } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { awardXpAndUpdateStreak, incrementUserXp } from "@/lib/streak";
import {
  codeSubmissionSchema,
  parseOrThrow,
  stepCompletionSchema,
} from "@/lib/validation";

/**
 * Marca un paso como completado y actualiza el progreso de la lección.
 * Idempotente: re-llamarla con un paso ya completado NO duplica XP ni racha.
 */
export async function completeStep(stepId: string) {
  const { stepId: validStepId } = parseOrThrow(stepCompletionSchema, { stepId });
  const session = await requireSession();
  const userId = session.user.id;

  const step = await db.lessonStep.findUnique({
    where: { id: validStepId },
    include: {
      lesson: {
        include: {
          steps: { select: { id: true } },
          unit: { select: { slug: true } },
        },
      },
    },
  });
  if (!step) {
    throw new Error("Paso no encontrado");
  }

  // Estado PREVIO de la lección — sirve para detectar la transición
  // a "completed" y no duplicar XP/racha en reentradas.
  const previousLessonProgress = await db.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: step.lessonId } },
    select: { status: true },
  });
  const wasAlreadyCompleted = previousLessonProgress?.status === "completed";

  await db.userStepProgress.upsert({
    where: { userId_stepId: { userId, stepId: validStepId } },
    update: { attempts: { increment: 1 } },
    create: { userId, stepId: validStepId },
  });

  const completedCount = await db.userStepProgress.count({
    where: {
      userId,
      stepId: { in: step.lesson.steps.map((s) => s.id) },
    },
  });

  const allDone = completedCount >= step.lesson.steps.length;
  const justCompleted = allDone && !wasAlreadyCompleted;

  await db.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: step.lessonId } },
    update: justCompleted
      ? {
          status: "completed",
          completedAt: new Date(),
          xpEarned: step.lesson.xpReward,
        }
      : allDone
        ? {} // ya estaba completed, idempotente
        : { status: "in_progress" },
    create: {
      userId,
      lessonId: step.lessonId,
      status: allDone ? "completed" : "in_progress",
      completedAt: allDone ? new Date() : null,
      xpEarned: allDone ? step.lesson.xpReward : 0,
    },
  });

  if (justCompleted) {
    await awardXpAndUpdateStreak(userId, step.lesson.xpReward);
  }

  revalidatePath(`/app/u/${step.lesson.unit.slug}`);
  revalidatePath("/app");

  return {
    lessonCompleted: allDone,
    lessonJustCompleted: justCompleted,
    xpEarned: justCompleted ? step.lesson.xpReward : 0,
  };
}

/**
 * Envía un intento de un ejercicio de lección. Compila, corre tests,
 * guarda intento. Solo cuenta XP la PRIMERA vez que se aprueba.
 */
export async function submitExercise(input: {
  exerciseId: string;
  sourceCode: string;
}): Promise<{
  passed: boolean;
  results: TestCaseResult[];
  feedback: string;
  xpEarned: number;
}> {
  const { exerciseId, sourceCode } = parseOrThrow(codeSubmissionSchema, input);
  const session = await requireSession();
  const userId = session.user.id;
  await enforceRateLimit(userId, "submit-lesson-exercise");

  const exercise = await db.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      testCases: { orderBy: { order: "asc" } },
      step: {
        include: {
          lesson: { include: { unit: { select: { slug: true } } } },
        },
      },
    },
  });
  if (!exercise) {
    throw new Error("Ejercicio no encontrado");
  }
  if (exercise.testCases.length === 0) {
    throw new Error("El ejercicio no tiene test cases configurados");
  }

  // ¿Es la primera vez que el usuario lo aprueba? (para no duplicar XP).
  const previousPass = await db.userExerciseAttempt.findFirst({
    where: { userId, exerciseId: exercise.id, passed: true },
    select: { id: true },
  });
  const isFirstPass = !previousPass;

  const executor = getCodeExecutor();
  const startedAt = Date.now();
  const results = await executor.runTests(
    sourceCode,
    exercise.testCases.map((tc) => ({
      id: tc.id,
      stdin: tc.stdin,
      expectedStdout: tc.expectedStdout,
      visible: tc.visible,
      description: tc.description ?? null,
    })),
  );
  const durationMs = Date.now() - startedAt;

  const passedCount = results.filter((r) => r.passed).length;
  const allPassed = passedCount === results.length;
  const feedback = buildFeedback(results);

  await db.userExerciseAttempt.create({
    data: {
      userId,
      exerciseId: exercise.id,
      code: sourceCode,
      passed: allPassed,
      feedback,
      testsPassed: passedCount,
      testsTotal: results.length,
      durationMs,
    },
  });

  let xpEarned = 0;
  if (allPassed) {
    // completeStep maneja el XP/racha de la LECCIÓN cuando es la última vez
    // que se completa. Aquí solo añadimos el XP del EJERCICIO si es la
    // primera vez que se aprueba.
    const stepResult = await completeStep(exercise.stepId);

    if (isFirstPass) {
      await incrementUserXp(userId, exercise.xpReward);
      xpEarned = exercise.xpReward + stepResult.xpEarned;
    } else {
      xpEarned = stepResult.xpEarned;
    }
  }

  return {
    passed: allPassed,
    results,
    feedback,
    xpEarned,
  };
}
