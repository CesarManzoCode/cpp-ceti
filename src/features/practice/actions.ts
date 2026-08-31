"use server";

import { revalidatePath } from "next/cache";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { claimPracticeCompletion } from "@/lib/completions";
import { db } from "@/lib/db";
import { resolveExecutionTarget } from "@/lib/execution-target";
import { buildFeedback, getExecutorForProfile } from "@/lib/executor";
import type { TestCaseResult } from "@/lib/executor";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { buildStructureFeedback, checkStructure } from "@/lib/structure";
import { awardXpAndUpdateStreak } from "@/lib/streak";
import { codeSubmissionSchema, parseOrThrow } from "@/lib/validation";

/**
 * Envía un intento de un ejercicio de PRÁCTICA (standalone).
 * Diferencias vs el reto dentro de lección:
 *   - No actualiza progreso de lección/paso.
 *   - XP solo se otorga la PRIMERA vez que se aprueba (detección atómica
 *     vía `UserPracticeCompletion` con UNIQUE (userId, exerciseId)).
 *   - La racha SÍ se actualiza (cuenta como actividad diaria).
 */
export const submitPracticeExercise = withActionErrorHandling(
  "submitPracticeExercise",
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
    firstPass: boolean;
    structureFailures: string[];
  }> => {
    const { exerciseId, sourceCode, assisted } = parseOrThrow(
      codeSubmissionSchema,
      input,
    );
    const session = await requireSession();
    const userId = session.user.id;
    await enforceRateLimit(userId, "submit-practice");

    const exercise = await db.practiceExercise.findUnique({
      where: { id: exerciseId },
      include: {
        testCases: { orderBy: { order: "asc" } },
        course: { select: { slug: true } },
      },
    });
    if (!exercise || !exercise.published) {
      throw new ActionError("Ejercicio no encontrado");
    }
    if (exercise.testCases.length === 0) {
      throw new ActionError("El ejercicio no tiene tests configurados");
    }

    // El compilador se deriva del curso dueño del ejercicio GUARDADO. Una
    // práctica de C# jamás se compila con el toolchain de C++, aunque el
    // slug del ejercicio se parezca al de otro curso.
    const target = await resolveExecutionTarget({
      practiceExerciseId: exercise.id,
    });

    // Ejecutar FUERA de la transacción (es lento + externo).
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

    // Mismo contrato que en el reto de lección: cuando el objetivo es
    // estructural, la salida correcta no basta.
    const structure = checkStructure(
      exercise.structureContract,
      sourceCode,
      target.language,
    );
    const allPassed = testsPassed && structure.satisfied;
    const feedback = structure.satisfied
      ? buildFeedback(results)
      : buildStructureFeedback(structure, testsPassed);

    const { xpEarned, firstPass } = await db.$transaction(async (tx) => {
      // OJO: nada de create() + catch(P2002) aquí. Un UNIQUE violado aborta
      // la transacción de Postgres y el `userPracticeAttempt.create` de abajo
      // moriría con 25P02. Ver `@/lib/completions`.
      const isFirstPass = allPassed
        ? await claimPracticeCompletion(tx, userId, exercise.id)
        : false;

      await tx.userPracticeAttempt.create({
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
          contentRevision: exercise.contentRevision,
          awardedXp: isFirstPass,
          assisted,
        },
      });

      if (isFirstPass) {
        await awardXpAndUpdateStreak(tx, userId, exercise.xpReward);
        return { xpEarned: exercise.xpReward, firstPass: true };
      }
      return { xpEarned: 0, firstPass: false };
    });

    const courseSlug = exercise.course.slug;
    revalidatePath(`/app/c/${courseSlug}/ejercicios`);
    revalidatePath(`/app/c/${courseSlug}/ejercicios/${exercise.slug}`);
    revalidatePath(`/app/c/${courseSlug}`);

    return {
      passed: allPassed,
      results,
      feedback,
      xpEarned,
      firstPass,
      structureFailures: structure.failures,
    };
  },
);
