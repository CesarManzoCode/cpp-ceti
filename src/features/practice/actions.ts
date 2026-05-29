"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { buildFeedback, getCodeExecutor } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { awardXpAndUpdateStreak } from "@/lib/streak";
import { codeSubmissionSchema, parseOrThrow } from "@/lib/validation";

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
  const { exerciseId, sourceCode } = parseOrThrow(codeSubmissionSchema, input);
  const session = await requireSession();
  const userId = session.user.id;
  await enforceRateLimit(userId, "submit-practice");

  const exercise = await db.practiceExercise.findUnique({
    where: { id: exerciseId },
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

  await db.userPracticeAttempt.create({
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
  if (allPassed && isFirstPass) {
    xpEarned = exercise.xpReward;
    await awardXpAndUpdateStreak(userId, xpEarned);
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
