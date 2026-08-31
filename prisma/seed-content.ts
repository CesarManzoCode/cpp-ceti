import { Prisma, type PrismaClient } from "@prisma/client";

import { assertLanguagePair } from "../src/lib/code-languages";
import type {
  ExecutionProfileId,
  LanguageId,
} from "../src/lib/code-languages";

import { allCourses } from "./content";
import { contentRevision, trackRevision } from "./seed-revisions";
import type {
  CourseDefinition,
  LessonDefinition,
  StepDefinition,
  UnitDefinition,
} from "./content/types";

/**
 * Semántica de ejecución del curso. Entra en el preimage de TODAS las
 * revisiones de contenido: un mismo enunciado compilado con otro toolchain
 * no es el mismo ejercicio para efectos de comparación antes/después.
 */
export interface CourseRuntime {
  language: LanguageId;
  executionProfile: ExecutionProfileId;
}

export async function seedCourse(db: PrismaClient) {
  assertUniqueCourseSlugs();
  for (let i = 0; i < allCourses.length; i++) {
    await upsertCourse(db, allCourses[i], i);
  }
}

/** Dos cursos con el mismo slug se pisarían mutuamente al hacer upsert. */
function assertUniqueCourseSlugs() {
  const seen = new Set<string>();
  for (const course of allCourses) {
    if (seen.has(course.slug)) {
      throw new Error(`Slug de curso duplicado: "${course.slug}"`);
    }
    seen.add(course.slug);
  }
}

async function upsertCourse(
  db: PrismaClient,
  course: CourseDefinition,
  order: number,
) {
  console.log(`📚 Curso: ${course.title}`);

  // Falla cerrado: un par (lenguaje, perfil) inválido no debe llegar nunca a
  // la base. Si llega, todo el contenido del curso quedaría sin compilador
  // resoluble en runtime.
  const runtime = assertLanguagePair(
    course.language,
    course.executionProfile,
    `curso "${course.slug}"`,
  );

  const dbCourse = await db.course.upsert({
    where: { slug: course.slug },
    update: {
      title: course.title,
      description: course.description,
      subjectName: course.subjectName,
      academicContext: course.academicContext,
      language: runtime.language,
      executionProfile: runtime.executionProfile,
      order,
    },
    create: {
      slug: course.slug,
      title: course.title,
      description: course.description,
      subjectName: course.subjectName,
      academicContext: course.academicContext,
      language: runtime.language,
      executionProfile: runtime.executionProfile,
      order,
    },
  });

  for (let i = 0; i < course.units.length; i++) {
    await upsertUnit(db, dbCourse.id, course.units[i], i, runtime);
  }
}

async function upsertUnit(
  db: PrismaClient,
  courseId: string,
  unit: UnitDefinition,
  index: number,
  runtime: CourseRuntime,
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
    await upsertLesson(db, dbUnit.id, unit.lessons[i], i, runtime);
  }
}

async function upsertLesson(
  db: PrismaClient,
  unitId: string,
  lesson: LessonDefinition,
  index: number,
  runtime: CourseRuntime,
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
  const stepRevisions: string[] = [];
  for (let i = 0; i < lesson.steps.length; i++) {
    stepRevisions.push(
      await upsertStep(db, dbLesson.id, lesson.steps[i], i, runtime),
    );
  }

  // Si una lección se acortó (menos pasos que antes), purgar los sobrantes.
  // Sólo borra los que ya no caen en el rango — el resto sobrevive.
  await db.lessonStep.deleteMany({
    where: { lessonId: dbLesson.id, order: { gt: lesson.steps.length } },
  });

  // Revisión de la lección = hash de las revisiones de sus pasos, en orden.
  // Cambiar cualquier paso (o reordenarlos) cambia la revisión de la lección,
  // que es la unidad de comparación de los funnels.
  await trackRevision(
    db,
    "lesson",
    dbLesson.id,
    dbLesson.contentRevision,
    contentRevision(stepRevisions),
    (revision) =>
      db.lesson.update({
        where: { id: dbLesson.id },
        data: { contentRevision: revision, contentRevisionAt: new Date() },
      }),
  );
}

/** @returns la revisión de contenido del paso (para la revisión de lección). */
async function upsertStep(
  db: PrismaClient,
  lessonId: string,
  step: StepDefinition,
  index: number,
  runtime: CourseRuntime,
): Promise<string> {
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

  // El runtime entra en el preimage: el mismo paso compilado con otro perfil
  // NO es el mismo paso para un análisis antes/después.
  const baseRevision = contentRevision({ type: step.type, content, runtime });

  if (step.type !== "code_challenge") {
    await saveStepRevision(db, dbStep.id, dbStep.contentRevision, baseRevision);
    return baseRevision;
  }

  const ex = step.exercise;
  const dbExercise = await db.exercise.upsert({
    where: { stepId: dbStep.id },
    update: {
      prompt: ex.prompt,
      starterCode: ex.starterCode,
      solutionCode: ex.solutionCode,
      hints: ex.hints ?? [],
      // `DbNull` y no `undefined`: quitar el contrato en el contenido tiene
      // que BORRARLO en la base, no dejar el viejo calificando.
      structureContract: ex.structure ?? Prisma.DbNull,
      difficulty: ex.difficulty ?? "easy",
      xpReward: ex.xpReward ?? 15,
    },
    create: {
      stepId: dbStep.id,
      prompt: ex.prompt,
      starterCode: ex.starterCode,
      solutionCode: ex.solutionCode,
      hints: ex.hints ?? [],
      structureContract: ex.structure ?? Prisma.DbNull,
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

  // La revisión del ejercicio incluye los tests: cambiar un `expectedStdout`
  // cambia el ejercicio para efectos de comparación, aunque el enunciado no
  // se haya tocado.
  const exerciseRevision = contentRevision({
    runtime,
    prompt: ex.prompt,
    starterCode: ex.starterCode,
    solutionCode: ex.solutionCode,
    hints: ex.hints ?? [],
    // El contrato entra en el preimage: endurecer la evaluación cambia el
    // ejercicio para efectos de comparación antes/después.
    structure: ex.structure ?? null,
    difficulty: ex.difficulty ?? "easy",
    xpReward: ex.xpReward ?? 15,
    testCases: ex.testCases.map((tc) => ({
      stdin: tc.stdin ?? "",
      expectedStdout: tc.expectedStdout,
      visible: tc.visible ?? true,
      description: tc.description ?? null,
    })),
  });
  await trackRevision(
    db,
    "exercise",
    dbExercise.id,
    dbExercise.contentRevision,
    exerciseRevision,
    (revision) =>
      db.exercise.update({
        where: { id: dbExercise.id },
        data: { contentRevision: revision, contentRevisionAt: new Date() },
      }),
  );

  // El reto es parte del paso: si cambia el ejercicio, cambia el paso.
  const stepRevision = contentRevision({
    step: baseRevision,
    exercise: exerciseRevision,
  });
  await saveStepRevision(db, dbStep.id, dbStep.contentRevision, stepRevision);
  return stepRevision;
}

/** Guarda la revisión del paso y la registra en la bitácora si cambió. */
async function saveStepRevision(
  db: PrismaClient,
  stepId: string,
  current: string | null,
  next: string,
): Promise<void> {
  await trackRevision(db, "lesson_step", stepId, current, next, (revision) =>
    db.lessonStep.update({
      where: { id: stepId },
      data: { contentRevision: revision, contentRevisionAt: new Date() },
    }),
  );
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
        ...(step.localOnlyNote ? { localOnlyNote: step.localOnlyNote } : {}),
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
