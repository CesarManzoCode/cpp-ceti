"use server";

import { revalidatePath } from "next/cache";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { claimExerciseCompletion } from "@/lib/completions";
import { db } from "@/lib/db";
import { resolveExecutionTarget } from "@/lib/execution-target";
import { buildFeedback, getExecutorForProfile } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { checkUnitAndCourseCompletion } from "@/lib/social/social-events";
import { buildStructureFeedback, checkStructure } from "@/lib/structure";
import { awardXpAndUpdateStreak, incrementUserXp } from "@/lib/streak";
import {
  codeSubmissionSchema,
  parseOrThrow,
  stepCompletionSchema,
} from "@/lib/validation";
import { xpDedupeKey } from "@/lib/xp";

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
    options?: { assisted?: boolean },
  ): Promise<{
    lessonCompleted: boolean;
    lessonJustCompleted: boolean;
    xpEarned: number;
  }> => {
    const { stepId: validStepId, assisted } = parseOrThrow(
      stepCompletionSchema,
      { stepId, assisted: options?.assisted ?? false },
    );
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
        assisted,
      );
      if (progression.lessonJustCompleted) {
        await awardXpAndUpdateStreak(tx, userId, progression.lessonXpEarned, {
          reason: "lesson_completed",
          dedupeKey: xpDedupeKey.lesson(step.lessonId),
          lessonId: step.lessonId,
        });
        await checkUnitAndCourseCompletion(tx, userId, step.lesson.unit.id, step.lesson.unit.course.id);
      }
      return progression;
    });

    const courseSlug = step.lesson.unit.course.slug;
    revalidatePath(`/app/c/${courseSlug}/u/${step.lesson.unit.slug}`);
    revalidatePath(`/app/c/${courseSlug}`);

    return {
      lessonCompleted: result.allStepsDone,
      lessonJustCompleted: result.lessonJustCompleted,
      xpEarned: result.lessonXpEarned,
    };
  },
);

/**
 * Registra que el alumno REVELÓ la ayuda de un paso (la respuesta de un
 * quiz, la solución de un reto).
 *
 * Se persiste en el momento del reveal, no al completar: el diálogo promete
 * que el paso "quedará marcado como asistido" y esa promesa tiene que ser
 * verdadera aunque el alumno cierre la pestaña sin terminar. `helpRevealCount`
 * no se reinicia nunca; `assisted` sí lo reescribe cada completado, para que
 * volver a resolverlo sin ayuda vuelva a contar como dominio autónomo.
 */
export const markStepAssisted = withActionErrorHandling(
  "markStepAssisted",
  async (stepId: string): Promise<void> => {
    const { stepId: validStepId } = parseOrThrow(stepCompletionSchema, {
      stepId,
    });
    const session = await requireSession();
    const userId = session.user.id;

    // Valida publicación igual que completar: no se registra ayuda de
    // contenido inaccesible.
    await requireAccessibleStep(validStepId);

    await db.userStepProgress.upsert({
      where: { userId_stepId: { userId, stepId: validStepId } },
      update: { assisted: true, helpRevealCount: { increment: 1 } },
      // El paso todavía no está completado; la fila existe para no perder
      // el registro de la ayuda. `completionCount` arranca en 0 justo por
      // eso: sin esto, revelar contaría como completar.
      create: {
        userId,
        stepId: validStepId,
        assisted: true,
        helpRevealCount: 1,
        completionCount: 0,
      },
    });
  },
);

/**
 * Envía un intento de un ejercicio de lección. Compila, corre tests,
 * guarda intento, y otorga XP **sólo en el primer pase**. La detección
 * de "primer pase" es atómica vía `UserExerciseCompletion` con UNIQUE
 * (userId, exerciseId) + `INSERT ... ON CONFLICT DO NOTHING`: bajo race,
 * sólo un envío inserta la fila y gana el XP; los demás obtienen count 0
 * sin abortar la transacción.
 */
export const submitExercise = withActionErrorHandling(
  "submitExercise",
  async (input: {
    exerciseId: string;
    sourceCode: string;
    /** El envío se hizo con la solución revelada a la vista. */
    assisted?: boolean;
  }): Promise<{
    passed: boolean;
    results: TestCaseResult[];
    feedback: string;
    xpEarned: number;
    structureFailures: string[];
  }> => {
    const { exerciseId, sourceCode, assisted } = parseOrThrow(
      codeSubmissionSchema,
      input,
    );
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "submit-lesson-exercise");

    const exercise = await requireAccessibleExercise(exerciseId);
    if (exercise.testCases.length === 0) {
      throw new ActionError("El ejercicio no tiene tests configurados");
    }

    // El compilador se deriva del curso al que pertenece el ejercicio
    // GUARDADO, no de nada que venga en el envío. Un envío calificado y un
    // run sin calificar resuelven por el mismo camino y con la misma
    // semántica.
    const target = await resolveExecutionTarget({ exerciseId: exercise.id });

    // Ejecutar FUERA de la transacción: es lento + externo (Wandbox/Judge0).
    // No queremos tener una conexión de Postgres abierta esperando 5–30s.
    const executor = getExecutorForProfile(target.profileId);
    const startedAt = Date.now();
    const results = await executor.runTests(
      { profileId: target.profileId, sourceCode },
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
    const testsPassed = passedCount === results.length;

    // Los retos con objetivo estructural (POO) exigen las dos cosas: la
    // salida correcta Y el diseño que pide el enunciado. Sin contrato,
    // esto no cambia nada — es el caso de todo C++.
    const structure = checkStructure(
      exercise.structureContract,
      sourceCode,
      target.language,
    );
    const allPassed = testsPassed && structure.satisfied;
    const feedback = structure.satisfied
      ? buildFeedback(results)
      : buildStructureFeedback(structure, testsPassed);

    const lesson = exercise.step.lesson;
    const stepIdsForProgression = lesson.steps.map((s) => s.id);

    const xpEarned = await db.$transaction(async (tx) => {
      // OJO: nada de create() + catch(P2002) aquí. Un UNIQUE violado aborta
      // la transacción de Postgres y todo lo que sigue (el attempt, la
      // progresión, el XP) moriría con 25P02. Ver `@/lib/completions`.
      const firstPass = allPassed
        ? await claimExerciseCompletion(tx, userId, exercise.id)
        : false;

      await tx.userExerciseAttempt.create({
        data: {
          userId,
          exerciseId: exercise.id,
          code: sourceCode,
          passed: allPassed,
          feedback,
          testsPassed: passedCount,
          testsTotal: results.length,
          // Latencia del ejecutor, NO tiempo de resolución del alumno.
          durationMs,
          // Revisión del contenido con la que se resolvió: sin esto no se
          // pueden comparar intentos de antes y después de un cambio.
          contentRevision: exercise.contentRevision,
          awardedXp: firstPass,
          assisted,
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
        assisted,
      );

      let xp = 0;
      if (firstPass) {
        await incrementUserXp(tx, userId, exercise.xpReward, {
          reason: "lesson_exercise_first_pass",
          dedupeKey: xpDedupeKey.exercise(exercise.id),
          exerciseId: exercise.id,
        });
        xp += exercise.xpReward;
      }
      if (progression.lessonJustCompleted) {
        await awardXpAndUpdateStreak(tx, userId, progression.lessonXpEarned, {
          reason: "lesson_completed",
          dedupeKey: xpDedupeKey.lesson(lesson.id),
          lessonId: lesson.id,
        });
        await checkUnitAndCourseCompletion(tx, userId, lesson.unit.id, lesson.unit.course.id);
        xp += progression.lessonXpEarned;
      }
      return xp;
    });

    if (allPassed) {
      const courseSlug = lesson.unit.course.slug;
      revalidatePath(`/app/c/${courseSlug}/u/${lesson.unit.slug}`);
      revalidatePath(`/app/c/${courseSlug}`);
    }

    return {
      passed: allPassed,
      results,
      feedback,
      xpEarned,
      structureFailures: structure.failures,
    };
  },
);
