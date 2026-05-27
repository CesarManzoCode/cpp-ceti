"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getCodeExecutor } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";

const MAX_CODE_LENGTH = 50_000;

/**
 * Marca un paso como completado y actualiza el progreso de la lección.
 * Idempotente: re-llamarla con un paso ya completado NO duplica XP ni racha.
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

  // Leemos el estado PREVIO de la lección para detectar la transición
  // a "completed" (y evitar duplicar XP/racha en reentradas).
  const previousLessonProgress = await db.userLessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: step.lessonId } },
    select: { status: true },
  });
  const wasAlreadyCompleted = previousLessonProgress?.status === "completed";

  // Upsert del progreso del paso
  await db.userStepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    update: { attempts: { increment: 1 } },
    create: { userId, stepId },
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
    await updateStreakOnCompletion(userId, step.lesson.xpReward);
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
 * Envía un intento de un ejercicio. Compila, corre tests, guarda intento.
 * Solo cuenta XP la PRIMERA vez que se aprueba.
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

  // Validaciones de input (defensa en runtime, no solo TS).
  if (!input.exerciseId || typeof input.exerciseId !== "string") {
    throw new Error("exerciseId es obligatorio");
  }
  if (!input.sourceCode || typeof input.sourceCode !== "string" || !input.sourceCode.trim()) {
    throw new Error("El código no puede estar vacío");
  }
  if (input.sourceCode.length > MAX_CODE_LENGTH) {
    throw new Error(`El código excede ${MAX_CODE_LENGTH.toLocaleString()} caracteres`);
  }

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

  // ¿Es la primera vez que el usuario lo aprueba? (para evitar XP duplicado).
  const previousPass = await db.userExerciseAttempt.findFirst({
    where: { userId, exerciseId: exercise.id, passed: true },
    select: { id: true },
  });
  const isFirstPass = !previousPass;

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
 * Suma XP al usuario, creando el `UserStreak` si no existe.
 * Usado para XP que no se asocia a completar una lección (ej. XP de ejercicio).
 */
async function incrementUserXp(userId: string, xp: number) {
  await db.userStreak.upsert({
    where: { userId },
    update: { totalXp: { increment: xp } },
    create: {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalXp: xp,
    },
  });
}

/**
 * Actualiza la racha del usuario cuando completa una lección POR PRIMERA VEZ.
 * Si completó algo ayer, +1 a la racha. Si fue hace más, reinicia a 1.
 * También suma el XP de la lección al total.
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
    // Ya activo hoy — no cambia la racha, solo suma XP.
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
