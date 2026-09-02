import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import { findNextLesson } from "@/features/roadmap/queries";

import { seedCourse } from "../../prisma/seed-content";
import { seedPracticeExercises } from "../../prisma/seed-practice";

import { createTestUser } from "./helpers";

/**
 * Contra PostgreSQL real: el refactor de `CurriculumSection` no debe mover
 * ni una sola identidad (Course/Unit/Lesson/LessonStep/Exercise/
 * PracticeExercise), no debe tocar progreso/attempts/XP históricos, y el
 * swap de orden `printf-scanf`↔`funciones` (la transición 1.er→2.º
 * semestre) debe llegar por UPDATE, nunca por delete/recreate.
 */
describe("curriculum: el seed preserva identidad, progreso y XP; navegación S1→S2", () => {
  let userId: string;
  let cppCourseId: string;
  let printfUnitId: string;
  let funcionesUnitId: string;
  let funcionesFirstLessonSlug: string;

  let sampleLessonId: string;
  let sampleStepId: string;
  let sampleExerciseId: string;
  let samplePracticeId: string;

  let lessonProgressId: string;
  let stepProgressId: string;
  let exerciseAttemptId: string;
  let practiceAttemptId: string;
  let xpAwardId: string;

  let contentRevisionCountBefore: number;

  beforeAll(async () => {
    // 1. seed baseline — idempotente, deja el contenido en su forma canónica.
    await seedCourse(db);
    await seedPracticeExercises(db);

    const cpp = await db.course.findUniqueOrThrow({
      where: { slug: "cpp-desde-cero" },
    });
    cppCourseId = cpp.id;

    const printfUnit = await db.unit.findUniqueOrThrow({
      where: { courseId_slug: { courseId: cppCourseId, slug: "printf-scanf" } },
      include: {
        lessons: { where: { published: true }, orderBy: { order: "asc" } },
      },
    });
    const funcionesUnit = await db.unit.findUniqueOrThrow({
      where: { courseId_slug: { courseId: cppCourseId, slug: "funciones" } },
      include: {
        lessons: { where: { published: true }, orderBy: { order: "asc" } },
      },
    });
    printfUnitId = printfUnit.id;
    funcionesUnitId = funcionesUnit.id;
    funcionesFirstLessonSlug = funcionesUnit.lessons[0].slug;

    // 2. capturar IDs de recursos representativos.
    sampleLessonId = printfUnit.lessons[0].id;

    const step = await db.lessonStep.findFirstOrThrow({
      where: { lessonId: sampleLessonId },
      orderBy: { order: "asc" },
    });
    sampleStepId = step.id;

    const challengeStep = await db.lessonStep.findFirstOrThrow({
      where: { type: "code_challenge", lesson: { unitId: printfUnitId } },
    });
    const exercise = await db.exercise.findUniqueOrThrow({
      where: { stepId: challengeStep.id },
    });
    sampleExerciseId = exercise.id;

    const practice = await db.practiceExercise.findFirstOrThrow({
      where: { courseId: cppCourseId, unitSlug: "printf-scanf" },
      orderBy: { position: "asc" },
    });
    samplePracticeId = practice.id;

    const user = await createTestUser("curriculum");
    userId = user.id;

    // 3. crear/proteger fixtures históricos.
    const lessonProgress = await db.userLessonProgress.create({
      data: {
        userId,
        lessonId: sampleLessonId,
        status: "completed",
        xpEarned: 20,
        completedAt: new Date(),
      },
    });
    lessonProgressId = lessonProgress.id;

    const stepProgress = await db.userStepProgress.create({
      data: { userId, stepId: sampleStepId },
    });
    stepProgressId = stepProgress.id;

    const exerciseAttempt = await db.userExerciseAttempt.create({
      data: {
        userId,
        exerciseId: sampleExerciseId,
        code: "// fixture histórico",
        passed: true,
        testsPassed: 1,
        testsTotal: 1,
        awardedXp: true,
      },
    });
    exerciseAttemptId = exerciseAttempt.id;

    const practiceAttempt = await db.userPracticeAttempt.create({
      data: {
        userId,
        exerciseId: samplePracticeId,
        code: "// fixture histórico",
        passed: true,
        testsPassed: 1,
        testsTotal: 1,
        awardedXp: true,
      },
    });
    practiceAttemptId = practiceAttempt.id;

    const xpAward = await db.xpAward.create({
      data: {
        userId,
        amount: 20,
        reason: "lesson_completed",
        dedupeKey: `curriculum-integration-${sampleLessonId}`,
        lessonId: sampleLessonId,
      },
    });
    xpAwardId = xpAward.id;

    contentRevisionCountBefore = await db.contentRevision.count();

    // 4. simular el orden HISTÓRICO (antes de este refactor): funciones=6,
    //    printf-scanf=7 — el swap que el seed nuevo debe corregir.
    await db.unit.update({ where: { id: funcionesUnitId }, data: { order: 6 } });
    await db.unit.update({ where: { id: printfUnitId }, data: { order: 7 } });

    // 5. correr el seed nuevo.
    await seedCourse(db);
    await seedPracticeExercises(db);
  });

  afterAll(async () => {
    // Limpia sólo el fixture del usuario de este test — el contenido del
    // curso no se borra: es la fuente de verdad compartida por todo lo demás.
    await db.xpAward.deleteMany({ where: { userId } });
    await db.userPracticeAttempt.deleteMany({ where: { userId } });
    await db.userExerciseAttempt.deleteMany({ where: { userId } });
    await db.userStepProgress.deleteMany({ where: { userId } });
    await db.userLessonProgress.deleteMany({ where: { userId } });
    await db.user.delete({ where: { id: userId } });
    await db.$disconnect();
  });

  it("el curso, la unidad y el orden corregido conservan los mismos IDs", async () => {
    const cpp = await db.course.findUniqueOrThrow({
      where: { slug: "cpp-desde-cero" },
    });
    expect(cpp.id).toBe(cppCourseId);

    const printfUnit = await db.unit.findUniqueOrThrow({ where: { id: printfUnitId } });
    const funcionesUnit = await db.unit.findUniqueOrThrow({ where: { id: funcionesUnitId } });

    // El swap llegó por UPDATE (mismo id), no por delete/recreate.
    expect(printfUnit.slug).toBe("printf-scanf");
    expect(funcionesUnit.slug).toBe("funciones");
    expect(printfUnit.order).toBe(6);
    expect(funcionesUnit.order).toBe(7);
  });

  it("las filas históricas (progreso, attempts, XP) sobreviven intactas", async () => {
    const lessonProgress = await db.userLessonProgress.findUnique({
      where: { id: lessonProgressId },
    });
    expect(lessonProgress).not.toBeNull();
    expect(lessonProgress!.lessonId).toBe(sampleLessonId);
    expect(lessonProgress!.status).toBe("completed");

    const stepProgress = await db.userStepProgress.findUnique({
      where: { id: stepProgressId },
    });
    expect(stepProgress).not.toBeNull();
    expect(stepProgress!.stepId).toBe(sampleStepId);

    const exerciseAttempt = await db.userExerciseAttempt.findUnique({
      where: { id: exerciseAttemptId },
    });
    expect(exerciseAttempt).not.toBeNull();
    expect(exerciseAttempt!.exerciseId).toBe(sampleExerciseId);

    const practiceAttempt = await db.userPracticeAttempt.findUnique({
      where: { id: practiceAttemptId },
    });
    expect(practiceAttempt).not.toBeNull();
    expect(practiceAttempt!.exerciseId).toBe(samplePracticeId);

    const xpAward = await db.xpAward.findUnique({ where: { id: xpAwardId } });
    expect(xpAward).not.toBeNull();
    expect(xpAward!.amount).toBe(20);
    expect(xpAward!.lessonId).toBe(sampleLessonId);
  });

  it("2 CurriculumSections para C++ (membership 6 + 4); 1 sección S3 para C#", async () => {
    const cppSections = await db.curriculumSection.findMany({
      where: { courseId: cppCourseId },
      include: { units: { select: { slug: true } } },
      orderBy: { order: "asc" },
    });
    expect(cppSections).toHaveLength(2);
    expect(cppSections[0].key).toBe("s1-fundamentos-desarrollo-software");
    expect(cppSections[0].semester).toBe(1);
    expect(cppSections[0].units.map((u) => u.slug).sort()).toEqual(
      ["primer-programa", "variables-y-tipos", "leer-datos", "control-de-flujo", "loops", "printf-scanf"].sort(),
    );
    expect(cppSections[1].key).toBe("s2-programacion-estructurada");
    expect(cppSections[1].semester).toBe(2);
    expect(cppSections[1].units.map((u) => u.slug).sort()).toEqual(
      ["funciones", "arreglos", "archivos", "matrices"].sort(),
    );

    const csharp = await db.course.findUniqueOrThrow({
      where: { slug: "csharp-poo-1" },
    });
    const csharpSections = await db.curriculumSection.findMany({
      where: { courseId: csharp.id },
      include: { units: true },
    });
    expect(csharpSections).toHaveLength(1);
    expect(csharpSections[0].semester).toBe(3);
    expect(csharpSections[0].units).toHaveLength(8);
  });

  it("un curso sin curriculum: sus Units quedan con curriculumSectionId null (FK nullable)", async () => {
    const suffix = Date.now().toString(36);
    const generalCourse = await db.course.create({
      data: {
        slug: `curso-general-integration-${suffix}`,
        title: "Curso general de prueba",
        description: "test",
        subjectName: "test",
        academicContext: "Ruta general",
        language: "cpp",
        executionProfile: "cpp17-wandbox",
      },
    });
    try {
      const generalUnit = await db.unit.create({
        data: {
          courseId: generalCourse.id,
          slug: "unidad-1",
          title: "Unidad 1",
          description: "d",
        },
      });
      expect(generalUnit.curriculumSectionId).toBeNull();

      const sections = await db.curriculumSection.findMany({
        where: { courseId: generalCourse.id },
      });
      expect(sections).toHaveLength(0);
    } finally {
      // Cascade borra la unidad de prueba junto con el curso.
      await db.course.delete({ where: { id: generalCourse.id } });
    }
  });

  it("no aparece una nueva ContentRevision de los recursos representativos por este cambio", async () => {
    const countAfter = await db.contentRevision.count();
    expect(countAfter).toBe(contentRevisionCountBefore);
  });

  it("navegación: última lesson de printf-scanf → primera lesson de funciones", async () => {
    const printfUnit = await db.unit.findUniqueOrThrow({ where: { id: printfUnitId } });

    // `findNextLesson` busca la primera lección NO completada en orden
    // (unit.order, lesson.order) — hay que completar TODO lo que va antes
    // de printf-scanf (S1 completo), no sólo la unidad misma.
    const lessonsThroughPrintf = await db.lesson.findMany({
      where: {
        published: true,
        unit: { courseId: cppCourseId, published: true, order: { lte: printfUnit.order } },
      },
      orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    });
    expect(lessonsThroughPrintf.length).toBeGreaterThan(0);

    for (const lesson of lessonsThroughPrintf) {
      await db.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: { status: "completed", completedAt: new Date() },
        create: {
          userId,
          lessonId: lesson.id,
          status: "completed",
          completedAt: new Date(),
        },
      });
    }

    const next = await findNextLesson(userId, cppCourseId);
    expect(next).not.toBeNull();
    expect(next!.unitSlug).toBe("funciones");
    expect(next!.lessonSlug).toBe(funcionesFirstLessonSlug);
    expect(next!.status).toBe("not_started");
  });

  it("PracticeExercise: mismo ID, mismo unitSlug, mismo attempt", async () => {
    const practice = await db.practiceExercise.findUniqueOrThrow({
      where: { id: samplePracticeId },
    });
    expect(practice.unitSlug).toBe("printf-scanf");
    expect(practice.courseId).toBe(cppCourseId);

    const attempt = await db.userPracticeAttempt.findUnique({
      where: { id: practiceAttemptId },
    });
    expect(attempt).not.toBeNull();
    expect(attempt!.exerciseId).toBe(samplePracticeId);
  });
});
