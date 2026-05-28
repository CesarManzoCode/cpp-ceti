import { type PrismaClient } from "@prisma/client";

import { allPracticeSets } from "./content/exercises";

/**
 * Carga los ejercicios de práctica a la DB. Idempotente:
 * - Upsert por slug.
 * - Para cada ejercicio, borra y recrea sus test cases (más simple
 *   que diff-update; los attempts del usuario NO se ven afectados
 *   porque referencian al ejercicio, no a los test cases).
 */
export async function seedPracticeExercises(db: PrismaClient) {
  console.log("🎯 Seeding ejercicios de práctica...");

  for (const set of allPracticeSets) {
    console.log(`  📦 ${set.unitTitle} — ${set.exercises.length} ejercicios`);

    for (let i = 0; i < set.exercises.length; i++) {
      const ex = set.exercises[i];

      const dbExercise = await db.practiceExercise.upsert({
        where: { slug: ex.slug },
        update: {
          unitSlug: set.unitSlug,
          title: ex.title,
          description: ex.description,
          prompt: ex.prompt,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          hints: ex.hints ?? [],
          difficulty: ex.difficulty,
          xpReward: ex.xpReward ?? 15,
          position: i + 1,
          published: true,
        },
        create: {
          unitSlug: set.unitSlug,
          slug: ex.slug,
          title: ex.title,
          description: ex.description,
          prompt: ex.prompt,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          hints: ex.hints ?? [],
          difficulty: ex.difficulty,
          xpReward: ex.xpReward ?? 15,
          position: i + 1,
          published: true,
        },
      });

      // Reemplaza los test cases (no afecta a los attempts del usuario).
      await db.practiceTestCase.deleteMany({
        where: { exerciseId: dbExercise.id },
      });
      for (let j = 0; j < ex.testCases.length; j++) {
        const tc = ex.testCases[j];
        await db.practiceTestCase.create({
          data: {
            exerciseId: dbExercise.id,
            stdin: tc.stdin ?? "",
            expectedStdout: tc.expectedStdout,
            visible: tc.visible ?? true,
            description: tc.description ?? null,
            order: j + 1,
          },
        });
      }
    }
  }
}
