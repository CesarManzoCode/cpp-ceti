import { Prisma, type PrismaClient } from "@prisma/client";

import { allPracticeSets } from "./content/exercises";
import { contentRevision, trackRevision } from "./seed-revisions";
import type { CourseRuntime } from "./seed-content";

/**
 * Carga los ejercicios de práctica a la DB. Idempotente:
 * - Upsert por (curso, slug). El mismo slug puede existir en dos cursos.
 * - Para cada ejercicio, borra y recrea sus test cases (más simple
 *   que diff-update; los attempts del usuario NO se ven afectados
 *   porque referencian al ejercicio, no a los test cases).
 *
 * El curso se resuelve por su slug declarado en el conjunto — NUNCA se
 * infiere de un prefijo del slug del ejercicio ni del "primer curso".
 * Si el curso o la unidad no existen, el seed falla: preferimos un seed
 * roto y visible a una práctica colgada del curso equivocado.
 */
export async function seedPracticeExercises(db: PrismaClient) {
  console.log("🎯 Seeding ejercicios de práctica...");

  for (const set of allPracticeSets) {
    const course = await db.course.findUnique({
      where: { slug: set.courseSlug },
      select: {
        id: true,
        title: true,
        language: true,
        executionProfile: true,
      },
    });
    if (!course) {
      throw new Error(
        `Práctica "${set.unitSlug}": no existe el curso "${set.courseSlug}". ` +
          `¿Corriste seedCourse antes?`,
      );
    }

    // La FK compuesta (courseId, unitSlug) exige que la unidad exista en ESE
    // curso. Comprobarlo aquí da un error legible en vez de un P2003 opaco.
    const unit = await db.unit.findUnique({
      where: { courseId_slug: { courseId: course.id, slug: set.unitSlug } },
      select: { id: true },
    });
    if (!unit) {
      throw new Error(
        `Práctica "${set.unitSlug}": el curso "${set.courseSlug}" no tiene una ` +
          `unidad con ese slug.`,
      );
    }

    const runtime: CourseRuntime = {
      language: course.language,
      executionProfile: course.executionProfile as CourseRuntime["executionProfile"],
    };

    console.log(
      `  📦 ${course.title} · ${set.unitTitle} — ${set.exercises.length} ejercicios`,
    );

    for (let i = 0; i < set.exercises.length; i++) {
      const ex = set.exercises[i];

      const dbExercise = await db.practiceExercise.upsert({
        where: { courseId_slug: { courseId: course.id, slug: ex.slug } },
        update: {
          unitSlug: set.unitSlug,
          title: ex.title,
          description: ex.description,
          prompt: ex.prompt,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          hints: ex.hints ?? [],
          // Ver `seed-content.ts`: quitar el contrato lo borra de la base.
          structureContract: ex.structure ?? Prisma.DbNull,
          difficulty: ex.difficulty,
          xpReward: ex.xpReward ?? 15,
          position: i + 1,
          published: true,
        },
        create: {
          courseId: course.id,
          unitSlug: set.unitSlug,
          slug: ex.slug,
          title: ex.title,
          description: ex.description,
          prompt: ex.prompt,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          hints: ex.hints ?? [],
          structureContract: ex.structure ?? Prisma.DbNull,
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

      // Revisión del ejercicio (runtime + enunciado + starter + solución +
      // pistas + tests). Los intentos guardan esta revisión: sin ella, un
      // before/after mezclaría dos ejercicios distintos con el mismo slug.
      await trackRevision(
        db,
        "practice_exercise",
        dbExercise.id,
        dbExercise.contentRevision,
        contentRevision({
          runtime,
          prompt: ex.prompt,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          hints: ex.hints ?? [],
          structure: ex.structure ?? null,
          difficulty: ex.difficulty,
          xpReward: ex.xpReward ?? 15,
          testCases: ex.testCases.map((tc) => ({
            stdin: tc.stdin ?? "",
            expectedStdout: tc.expectedStdout,
            visible: tc.visible ?? true,
            description: tc.description ?? null,
          })),
        }),
        (revision) =>
          db.practiceExercise.update({
            where: { id: dbExercise.id },
            data: { contentRevision: revision, contentRevisionAt: new Date() },
          }),
      );
    }
  }
}
