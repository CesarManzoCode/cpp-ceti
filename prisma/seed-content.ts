import { Prisma, type PrismaClient } from "@prisma/client";

import { allCourses } from "./content";
import type {
  CourseDefinition,
  LessonDefinition,
  StepDefinition,
  UnitDefinition,
} from "./content/types";

export async function seedCourse(db: PrismaClient) {
  for (const course of allCourses) {
    await upsertCourse(db, course);
  }
}

async function upsertCourse(db: PrismaClient, course: CourseDefinition) {
  console.log(`📚 Curso: ${course.title}`);
  const dbCourse = await db.course.upsert({
    where: { slug: course.slug },
    update: {
      title: course.title,
      description: course.description,
    },
    create: {
      slug: course.slug,
      title: course.title,
      description: course.description,
      order: 0,
    },
  });

  for (let i = 0; i < course.units.length; i++) {
    await upsertUnit(db, dbCourse.id, course.units[i], i);
  }
}

async function upsertUnit(
  db: PrismaClient,
  courseId: string,
  unit: UnitDefinition,
  index: number,
) {
  console.log(`  📦 Unidad: ${unit.title}`);
  const dbUnit = await db.unit.upsert({
    where: { courseId_slug: { courseId, slug: unit.slug } },
    update: {
      title: unit.title,
      description: unit.description,
      icon: unit.icon ?? null,
      colorAccent: unit.colorAccent ?? null,
      published: unit.published ?? true,
      order: index + 1,
    },
    create: {
      courseId,
      slug: unit.slug,
      title: unit.title,
      description: unit.description,
      icon: unit.icon ?? null,
      colorAccent: unit.colorAccent ?? null,
      published: unit.published ?? true,
      order: index + 1,
    },
  });

  for (let i = 0; i < unit.lessons.length; i++) {
    await upsertLesson(db, dbUnit.id, unit.lessons[i], i);
  }
}

async function upsertLesson(
  db: PrismaClient,
  unitId: string,
  lesson: LessonDefinition,
  index: number,
) {
  console.log(`    📖 Lección ${index + 1}: ${lesson.title}`);
  const dbLesson = await db.lesson.upsert({
    where: { unitId_slug: { unitId, slug: lesson.slug } },
    update: {
      title: lesson.title,
      description: lesson.description,
      xpReward: lesson.xpReward ?? 20,
      estimatedMinutes: lesson.estimatedMinutes ?? 5,
      published: lesson.published ?? true,
      order: index + 1,
    },
    create: {
      unitId,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      xpReward: lesson.xpReward ?? 20,
      estimatedMinutes: lesson.estimatedMinutes ?? 5,
      published: lesson.published ?? true,
      order: index + 1,
    },
  });

  // Upsert por (lessonId, order). Esto preserva los IDs de los pasos y
  // por extensión todo el UserStepProgress / UserExerciseAttempt asociado.
  // Cambiar texto, hints o test cases NO resetea el progreso del usuario.
  for (let i = 0; i < lesson.steps.length; i++) {
    await upsertStep(db, dbLesson.id, lesson.steps[i], i);
  }

  // Si una lección se acortó (menos pasos que antes), purgar los sobrantes.
  // Sólo borra los que ya no caen en el rango — el resto sobrevive.
  await db.lessonStep.deleteMany({
    where: { lessonId: dbLesson.id, order: { gt: lesson.steps.length } },
  });
}

async function upsertStep(
  db: PrismaClient,
  lessonId: string,
  step: StepDefinition,
  index: number,
) {
  const content = buildStepContent(step);
  const order = index + 1;

  const dbStep = await db.lessonStep.upsert({
    where: { lessonId_order: { lessonId, order } },
    update: {
      type: step.type,
      content: content as Prisma.InputJsonValue,
    },
    create: {
      lessonId,
      order,
      type: step.type,
      content: content as Prisma.InputJsonValue,
    },
  });

  if (step.type !== "code_challenge") return;

  const ex = step.exercise;
  const dbExercise = await db.exercise.upsert({
    where: { stepId: dbStep.id },
    update: {
      prompt: ex.prompt,
      starterCode: ex.starterCode,
      solutionCode: ex.solutionCode,
      hints: ex.hints ?? [],
      difficulty: ex.difficulty ?? "easy",
      xpReward: ex.xpReward ?? 15,
    },
    create: {
      stepId: dbStep.id,
      prompt: ex.prompt,
      starterCode: ex.starterCode,
      solutionCode: ex.solutionCode,
      hints: ex.hints ?? [],
      difficulty: ex.difficulty ?? "easy",
      xpReward: ex.xpReward ?? 15,
    },
  });

  // Reemplazo de test cases: no afecta a UserExerciseAttempt porque los
  // intentos referencian al exerciseId, no a los test cases.
  await db.testCase.deleteMany({ where: { exerciseId: dbExercise.id } });
  for (let i = 0; i < ex.testCases.length; i++) {
    const tc = ex.testCases[i];
    await db.testCase.create({
      data: {
        exerciseId: dbExercise.id,
        stdin: tc.stdin ?? "",
        expectedStdout: tc.expectedStdout,
        visible: tc.visible ?? true,
        description: tc.description ?? null,
        order: i + 1,
      },
    });
  }
}

/**
 * Convierte un step de la definición a su JSON serializable.
 * Quitamos `type` del JSON porque el campo existe en la columna SQL.
 */
function buildStepContent(step: StepDefinition): Record<string, unknown> {
  switch (step.type) {
    case "theory":
      return {
        markdown: step.markdown,
        ...(step.mediaUrl ? { mediaUrl: step.mediaUrl } : {}),
      };
    case "code_example":
      return {
        code: step.code,
        explanation: step.explanation,
        runnable: step.runnable ?? false,
        ...(step.expectedOutput ? { expectedOutput: step.expectedOutput } : {}),
      };
    case "quiz":
      return {
        question: step.question,
        options: step.options,
        ...(step.feedbackPerOption
          ? { feedbackPerOption: step.feedbackPerOption }
          : {}),
        correctIndex: step.correctIndex,
        explanation: step.explanation,
      };
    case "fill_blank":
      return {
        template: step.template,
        ...(step.prompt ? { prompt: step.prompt } : {}),
        blanks: step.blanks,
        ...(step.explanation ? { explanation: step.explanation } : {}),
      };
    case "code_challenge":
      // El detalle del ejercicio se guarda en la tabla Exercise,
      // aquí solo dejamos un marcador.
      return { exerciseRef: true };
    case "matching":
      return {
        ...(step.prompt ? { prompt: step.prompt } : {}),
        pairs: step.pairs,
        ...(step.explanation ? { explanation: step.explanation } : {}),
      };
    case "code_completion":
      return {
        ...(step.prompt ? { prompt: step.prompt } : {}),
        lines: step.lines,
        ...(step.explanation ? { explanation: step.explanation } : {}),
      };
  }
}
