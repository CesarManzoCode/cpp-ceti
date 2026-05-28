"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getCodeExecutor } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";

const MAX_CODE_LENGTH = 50_000;

/**
 * Envía un intento de un ejercicio de PRÁCTICA (standalone).
 * Diferencias vs el reto dentro de lección:
 *   - No actualiza progreso de lección/paso.
 *   - XP solo se otorga la PRIMERA vez que se aprueba.
 *   - La racha SÍ se actualiza (cuenta como actividad diaria).
 */
export async function submitPracticeExercise(input: {
  exerciseId: string;
  sourceCode: string;
}): Promise<{
  passed: boolean;
  results: TestCaseResult[];
  feedback: string;
  xpEarned: number;
  firstPass: boolean;
}> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!input.exerciseId || typeof input.exerciseId !== "string") {
    throw new Error("exerciseId es obligatorio");
  }
  if (
    !input.sourceCode ||
    typeof input.sourceCode !== "string" ||
    !input.sourceCode.trim()
  ) {
    throw new Error("El código no puede estar vacío");
  }
  if (input.sourceCode.length > MAX_CODE_LENGTH) {
    throw new Error(`El código excede ${MAX_CODE_LENGTH.toLocaleString()} caracteres`);
  }

  const exercise = await db.practiceExercise.findUnique({
    where: { id: input.exerciseId },
    include: {
      testCases: { orderBy: { order: "asc" } },
    },
  });
  if (!exercise || !exercise.published) {
    throw new Error("Ejercicio no encontrado");
  }
  if (exercise.testCases.length === 0) {
    throw new Error("El ejercicio no tiene test cases configurados");
  }

  const previousPass = await db.userPracticeAttempt.findFirst({
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

  await db.userPracticeAttempt.create({
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
  if (allPassed && isFirstPass) {
    xpEarned = exercise.xpReward;
    await rewardPracticeXp(userId, xpEarned);
  }

  revalidatePath("/app/ejercicios");
  revalidatePath(`/app/ejercicios/${exercise.slug}`);
  revalidatePath("/app");

  return {
    passed: allPassed,
    results,
    feedback,
    xpEarned,
    firstPass: isFirstPass && allPassed,
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
    return "Tu programa se cayó en tiempo de ejecución.";
  }
  return `${passed} de ${results.length} tests aprobados. Revisa la salida esperada vs la tuya.`;
}

/**
 * Suma XP por aprobar un ejercicio de práctica y actualiza la racha.
 * Comparte la idea de "actividad de hoy" con las lecciones — si el
 * usuario solo resuelve práctica un día, también mantiene la racha.
 */
async function rewardPracticeXp(userId: string, xpEarned: number) {
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
    // Ya activo hoy — solo suma XP.
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
