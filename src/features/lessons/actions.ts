"use server";

import { revalidatePath } from "next/cache";

import { ActionError, isUniqueViolation, withActionErrorHandling } from "@/lib/action-error";
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

import { requireAccessibleExercise, requireAccessibleStep } from "./lib/access";
import { markStepCompletedInTx } from "./lib/progression";

/**
 * Marca un paso como completado y actualiza el progreso de la lección.
 * Idempotente y atómico: re-llamarla con un paso ya completado NO duplica
 * XP ni racha, incluso bajo requests concurrentes.
 */
export const completeStep = withActionErrorHandling(
  "completeStep",
  async (
    stepId: string,
  ): Promise<{
    lessonCompleted: boolean;
    lessonJustCompleted: boolean;
    xpEarned: number;
  }> => {
    const { stepId: validStepId } = parseOrThrow(stepCompletionSchema, {
      stepId,
    });
    const session = await requireSession();
    const userId = session.user.id;

    const step = await requireAccessibleStep(validStepId);
    const lessonStepIds = step.lesson.steps.map((s) => s.id);

    const result = await db.$transaction(async (tx) => {
      const progression = await markStepCompletedInTx(
        tx,
        userId,
        validStepId,
        step.lessonId,
        lessonStepIds,
        step.lesson.xpReward,
      );
      if (progression.lessonJustCompleted) {
        await awardXpAndUpdateStreak(tx, userId, progression.lessonXpEarned);
      }
      return progression;
    });

    revalidatePath(`/app/u/${step.lesson.unit.slug}`);
    revalidatePath("/app");

    return {
      lessonCompleted: result.allStepsDone,
      lessonJustCompleted: result.lessonJustCompleted,
      xpEarned: result.lessonXpEarned,
    };
  },
);

/**
 * Envía un intento de un ejercicio de lección. Compila, corre tests,
 * guarda intento, y otorga XP **sólo en el primer pase**. La detección
 * de "primer pase" es atómica vía `UserExerciseCompletion` con UNIQUE
 * (userId, exerciseId): bajo race, sólo un envío gana, los demás
 * detectan P2002 y no duplican XP.
 */
export const submitExercise = withActionErrorHandling(
  "submitExercise",
  async (input: {
    exerciseId: string;
    sourceCode: string;
  }): Promise<{
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
    xpEarned: number;
  }> => {
    const { exerciseId, sourceCode } = parseOrThrow(codeSubmissionSchema, input);
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "submit-lesson-exercise");

    const exercise = await requireAccessibleExercise(exerciseId);
    if (exercise.testCases.length === 0) {
      throw new ActionError("El ejercicio no tiene tests configurados");
    }

    // Ejecutar FUERA de la transacción: es lento + externo (Wandbox/Judge0).
    // No queremos tener una conexión de Postgres abierta esperando 5–30s.
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

    const lesson = exercise.step.lesson;
    const stepIdsForProgression = lesson.steps.map((s) => s.id);

    const xpEarned = await db.$transaction(async (tx) => {
      let firstPass = false;
      if (allPassed) {
        try {
          await tx.userExerciseCompletion.create({
            data: { userId, exerciseId: exercise.id },
          });
          firstPass = true;
        } catch (err) {
          if (!isUniqueViolation(err)) throw err;
        }
      }

      await tx.userExerciseAttempt.create({
        data: {
          userId,
          exerciseId: exercise.id,
          code: sourceCode,
          passed: allPassed,
          feedback,
          testsPassed: passedCount,
          testsTotal: results.length,
          durationMs,
          awardedXp: firstPass,
        },
      });

      if (!allPassed) return 0;

      const progression = await markStepCompletedInTx(
        tx,
        userId,
        exercise.stepId,
        lesson.id,
        stepIdsForProgression,
        lesson.xpReward,
      );

      let xp = 0;
      if (firstPass) {
        await incrementUserXp(tx, userId, exercise.xpReward);
        xp += exercise.xpReward;
      }
      if (progression.lessonJustCompleted) {
        await awardXpAndUpdateStreak(tx, userId, progression.lessonXpEarned);
        xp += progression.lessonXpEarned;
      }
      return xp;
    });

    if (allPassed) {
      revalidatePath(`/app/u/${lesson.unit.slug}`);
      revalidatePath("/app");
    }

    return { passed: allPassed, results, feedback, xpEarned };
  },
);
