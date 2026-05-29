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

  // Estrategia de reemplazo: borramos los pasos existentes y recreamos.
  // Esto simplifica el seed cuando reordenas/eliminas/agregas pasos.
  // (El progreso del usuario referencia stepId, así que borrar resetea ese
  // progreso, pero eso es aceptable en desarrollo. En producción versionaríamos.)
  await db.lessonStep.deleteMany({ where: { lessonId: dbLesson.id } });

  for (let i = 0; i < lesson.steps.length; i++) {
    await createStep(db, dbLesson.id, lesson.steps[i], i);
  }
}

async function createStep(
  db: PrismaClient,
  lessonId: string,
  step: StepDefinition,
  index: number,
) {
  const content = buildStepContent(step);

  const dbStep = await db.lessonStep.create({
    data: {
      lessonId,
      order: index + 1,
      type: step.type,
      content: content as Prisma.InputJsonValue,
    },
  });

  if (step.type === "code_challenge") {
    const ex = step.exercise;
    const dbExercise = await db.exercise.create({
      data: {
        stepId: dbStep.id,
        prompt: ex.prompt,
        starterCode: ex.starterCode,
        solutionCode: ex.solutionCode,
        hints: ex.hints ?? [],
        difficulty: ex.difficulty ?? "easy",
        xpReward: ex.xpReward ?? 15,
      },
    });

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
  }
}
