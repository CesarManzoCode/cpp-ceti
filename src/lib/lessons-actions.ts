"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getCodeExecutor } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";

/**
 * Marca un paso como completado y actualiza el progreso de la lección.
 * Si todos los pasos están completos, marca la lección como completed y suma XP.
 */
export async function completeStep(stepId: string) {
  const session = await requireSession();
  const userId = session.user.id;

  const step = await db.lessonStep.findUnique({
    where: { id: stepId },
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

  // Upsert del progreso del paso
  await db.userStepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    update: { attempts: { increment: 1 } },
    create: { userId, stepId },
  });

  // ¿Cuántos pasos completados hay ya?
  const completedCount = await db.userStepProgress.count({
    where: {
      userId,
      stepId: { in: step.lesson.steps.map((s) => s.id) },
    },
  });

  const allDone = completedCount >= step.lesson.steps.length;

  // Upsert del progreso de la lección
  const lessonProgress = await db.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: step.lessonId } },
    update: allDone
      ? {
          status: "completed",
          completedAt: new Date(),
          xpEarned: step.lesson.xpReward,
        }
      : { status: "in_progress" },
    create: {
      userId,
      lessonId: step.lessonId,
      status: allDone ? "completed" : "in_progress",
      completedAt: allDone ? new Date() : null,
      xpEarned: allDone ? step.lesson.xpReward : 0,
    },
  });

  // Si recién se completó (transición a completed), sumar al streak
  if (allDone && lessonProgress.completedAt) {
    await updateStreakOnCompletion(userId, step.lesson.xpReward);
  }

  revalidatePath(`/app/u/${step.lesson.unit.slug}`);
  revalidatePath("/app");

  return { lessonCompleted: allDone, xpEarned: allDone ? step.lesson.xpReward : 0 };
}

/**
 * Envía un intento de un ejercicio. Compila, corre tests, guarda intento.
 * Devuelve resultados de cada test (visibles + hidden).
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
  const session = await requireSession();
  const userId = session.user.id;

  const exercise = await db.exercise.findUnique({
    where: { id: input.exerciseId },
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

  const executor = getCodeExecutor();
  const startedAt = Date.now();
  const results = await executor.runTests(
    input.sourceCode,
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
      code: input.sourceCode,
      passed: allPassed,
      feedback,
      testsPassed: passedCount,
      testsTotal: results.length,
      durationMs,
    },
  });

  let xpEarned = 0;
  if (allPassed) {
    // Marcar el paso del ejercicio como completado (esto puede completar también la lección)
    const stepResult = await completeStep(exercise.stepId);
    xpEarned =
      exercise.xpReward + (stepResult.lessonCompleted ? 0 : 0);
    // El XP del paso ya se cuenta en el de la lección al completarla.
    // Aquí solo sumamos el XP del ejercicio al streak (sin duplicar el de la lección).
    await db.userStreak.update({
      where: { userId },
      data: { totalXp: { increment: exercise.xpReward } },
    });
  }

  // Visibles para mostrar al usuario; los hidden se reportan agregados
  return {
    passed: allPassed,
    results,
    feedback,
    xpEarned,
  };
}

function buildFeedback(results: TestCaseResult[]): string {
  const passed = results.filter((r) => r.passed).length;
  if (passed === results.length) {
    return `🎉 ¡Pasaste los ${results.length} tests!`;
  }
  const failures = results.filter((r) => !r.passed);
  const firstFail = failures[0];
  if (!firstFail) {
    return `${passed} de ${results.length} tests aprobados.`;
  }
  if (firstFail.status === "compile_error") {
    return "Tu código no compila. Revisa el panel de errores.";
  }
  if (firstFail.status === "time_limit") {
    return "Tu programa tardó demasiado. ¿Hay un ciclo infinito?";
  }
  if (firstFail.status === "runtime_error") {
    return "Tu programa se cayó en tiempo de ejecución. Revisa accesos a memoria.";
  }
  return `${passed} de ${results.length} tests aprobados. Revisa la salida esperada vs la tuya.`;
}

/**
 * Actualiza la racha del usuario cuando completa una lección.
 * Si completó algo ayer, +1 a la racha. Si fue hace más, reinicia a 1.
 */
async function updateStreakOnCompletion(userId: string, xpEarned: number) {
  const today = startOfDayUTC(new Date());
  const yesterday = startOfDayUTC(new Date(Date.now() - 86_400_000));

  const existing = await db.userStreak.findUnique({ where: { userId } });

  if (!existing) {
    await db.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        totalXp: xpEarned,
      },
    });
    return;
  }

  const lastActive = existing.lastActiveDate
    ? startOfDayUTC(existing.lastActiveDate)
    : null;

  let newStreak = existing.currentStreak;
  if (!lastActive) {
    newStreak = 1;
  } else if (lastActive.getTime() === today.getTime()) {
    // Ya activo hoy — no cambia la racha, solo suma XP
  } else if (lastActive.getTime() === yesterday.getTime()) {
    newStreak = existing.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  await db.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(existing.longestStreak, newStreak),
      lastActiveDate: today,
      totalXp: existing.totalXp + xpEarned,
    },
  });
}

function startOfDayUTC(d: Date): Date {
  const r = new Date(d);
  r.setUTCHours(0, 0, 0, 0);
  return r;
}
