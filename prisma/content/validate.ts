// =====================================================================
// Validación semántica del contenido, SIN tocar DB ni compiladores.
//
// `buildContentRegistry` (ver `./authoring.ts`) corre esta validación
// antes de aceptar un registry canónico: cualquier problema estructural
// (slug vacío o duplicado, quiz sin opciones, fill_blank con huecos mal
// formados, etc.) se detecta al importar el contenido, no al sembrar.
//
// Acumula TODOS los issues encontrados y lanza un único
// `ContentValidationError` al final — así un `npm run content:validate`
// reporta la lista completa en una sola corrida en vez de un error a la
// vez.
// =====================================================================

import { assertLanguagePair } from "../../src/lib/code-languages";
import { structureContractSchema } from "../../src/lib/structure/contract";

import type {
  CourseDefinition,
  LessonDefinition,
  StepDefinition,
  UnitDefinition,
} from "./types";
import type {
  PracticeExerciseDefinition,
  PracticeUnitSetDefinition,
} from "./exercises/types";

export interface ContentValidationIssue {
  path: string;
  message: string;
}

export class ContentValidationError extends Error {
  readonly issues: ContentValidationIssue[];

  constructor(issues: ContentValidationIssue[]) {
    super(
      `Contenido inválido: ${issues.length} problema(s).\n` +
        issues.map((issue) => `  ${issue.path}: ${issue.message}`).join("\n"),
    );
    this.name = "ContentValidationError";
    this.issues = issues;
  }
}

function push(
  issues: ContentValidationIssue[],
  path: string,
  message: string,
): void {
  issues.push({ path, message });
}

/**
 * Valida un registry completo (cursos + prácticas). Lanza
 * `ContentValidationError` con TODOS los issues acumulados si algo falla.
 * No usa DB, no ejecuta compiladores, es síncrona.
 */
export function validateContentRegistry(
  courses: readonly CourseDefinition[],
  practiceSets: readonly PracticeUnitSetDefinition[],
): void {
  const issues: ContentValidationIssue[] = [];
  const seenCourseSlugs = new Set<string>();

  for (const course of courses) {
    validateCourse(course, issues, seenCourseSlugs);
  }

  validatePracticeSets(courses, practiceSets, issues);

  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }
}

function validateCourse(
  course: CourseDefinition,
  issues: ContentValidationIssue[],
  seenCourseSlugs: Set<string>,
): void {
  const path = `courses[${course.slug || "?"}]`;

  if (!course.slug.trim()) {
    push(issues, path, "slug vacío");
  } else if (seenCourseSlugs.has(course.slug)) {
    push(issues, path, `slug de curso duplicado: "${course.slug}"`);
  } else {
    seenCourseSlugs.add(course.slug);
  }

  if (!course.title.trim()) push(issues, path, "title vacío");
  if (!course.description.trim()) push(issues, path, "description vacía");
  if (!course.subjectName.trim()) push(issues, path, "subjectName vacío");
  if (!course.academicContext.trim()) {
    push(issues, path, "academicContext vacío");
  }
  if (course.units.length === 0) {
    push(issues, path, "debe tener al menos 1 unidad");
  }

  try {
    assertLanguagePair(course.language, course.executionProfile, path);
  } catch (err) {
    push(issues, path, err instanceof Error ? err.message : String(err));
  }

  const seenUnitSlugs = new Set<string>();
  for (const unit of course.units) {
    validateUnit(unit, path, issues, seenUnitSlugs);
  }
}

function validateUnit(
  unit: UnitDefinition,
  coursePath: string,
  issues: ContentValidationIssue[],
  seenUnitSlugs: Set<string>,
): void {
  const path = `${coursePath}.units[${unit.slug || "?"}]`;

  if (!unit.slug.trim()) {
    push(issues, path, "slug vacío");
  } else if (seenUnitSlugs.has(unit.slug)) {
    push(issues, path, `slug de unidad duplicado dentro del curso: "${unit.slug}"`);
  } else {
    seenUnitSlugs.add(unit.slug);
  }

  if (!unit.title.trim()) push(issues, path, "title vacío");
  if (!unit.description.trim()) push(issues, path, "description vacía");
  if (unit.lessons.length === 0) {
    push(issues, path, "debe tener al menos 1 lección");
  }

  const seenLessonSlugs = new Set<string>();
  for (const lesson of unit.lessons) {
    validateLesson(lesson, path, issues, seenLessonSlugs);
  }
}

function validateLesson(
  lesson: LessonDefinition,
  unitPath: string,
  issues: ContentValidationIssue[],
  seenLessonSlugs: Set<string>,
): void {
  const path = `${unitPath}.lessons[${lesson.slug || "?"}]`;

  if (!lesson.slug.trim()) {
    push(issues, path, "slug vacío");
  } else if (seenLessonSlugs.has(lesson.slug)) {
    push(
      issues,
      path,
      `slug de lección duplicado dentro de la unidad: "${lesson.slug}"`,
    );
  } else {
    seenLessonSlugs.add(lesson.slug);
  }

  if (!lesson.title.trim()) push(issues, path, "title vacío");
  if (!lesson.description.trim()) push(issues, path, "description vacía");
  if (lesson.steps.length === 0) {
    push(issues, path, "debe tener al menos 1 step");
  }

  lesson.steps.forEach((step, index) => {
    validateStep(step, path, index, issues);
  });
}

function validateStep(
  step: StepDefinition,
  lessonPath: string,
  index: number,
  issues: ContentValidationIssue[],
): void {
  const path = `${lessonPath}.steps[${index}]`;

  switch (step.type) {
    case "theory": {
      if (!step.markdown.trim()) push(issues, path, "markdown vacío");
      break;
    }

    case "code_example": {
      if (!step.code.trim()) push(issues, path, "code vacío");
      if (!step.explanation.trim()) push(issues, path, "explanation vacía");
      if (step.localOnlyNote && step.runnable === true) {
        push(
          issues,
          path,
          "localOnlyNote es incompatible con runnable: true",
        );
      }
      break;
    }

    case "quiz": {
      if (step.options.length < 2) {
        push(issues, path, "debe tener al menos 2 opciones");
      }
      if (step.correctIndex < 0 || step.correctIndex >= step.options.length) {
        push(issues, path, "correctIndex fuera de rango");
      }
      if (
        step.feedbackPerOption &&
        step.feedbackPerOption.length !== step.options.length
      ) {
        push(
          issues,
          path,
          "feedbackPerOption debe tener la misma longitud que options",
        );
      }
      break;
    }

    case "fill_blank": {
      validateFillBlank(step.template, step.blanks, path, issues);
      break;
    }

    case "code_challenge": {
      const ex = step.exercise;
      if (!ex.prompt.trim()) push(issues, path, "exercise.prompt vacío");
      if (!ex.solutionCode.trim()) {
        push(issues, path, "exercise.solutionCode vacío");
      }
      if (ex.testCases.length === 0) {
        push(issues, path, "exercise debe tener al menos 1 test case");
      }
      if (ex.structure) {
        const result = structureContractSchema.safeParse(ex.structure);
        if (!result.success) {
          push(
            issues,
            path,
            `exercise.structure inválido: ${result.error.message}`,
          );
        }
      }
      break;
    }

    case "matching": {
      if (step.pairs.length < 2) {
        push(issues, path, "debe tener al menos 2 pares");
      }
      break;
    }

    case "code_completion": {
      if (step.lines.length < 2) {
        push(issues, path, "debe tener al menos 2 líneas");
      }
      break;
    }
  }
}

function validateFillBlank(
  template: string,
  blanks: { answer: string; pattern?: string; matchBlank?: number }[],
  path: string,
  issues: ContentValidationIssue[],
): void {
  const holes = [...template.matchAll(/\{\{(\d+)\}\}/g)].map((m) =>
    Number(m[1]),
  );

  const counts = new Map<number, number>();
  for (const h of holes) counts.set(h, (counts.get(h) ?? 0) + 1);
  for (const [h, count] of counts) {
    if (count > 1) {
      push(issues, path, `hueco {{${h}}} aparece ${count} veces en template`);
    }
  }

  const uniqueHoles = new Set(holes);
  for (const h of uniqueHoles) {
    if (h < 0 || h >= blanks.length) {
      push(issues, path, `hueco {{${h}}} fuera de rango de blanks`);
    }
  }

  blanks.forEach((blank, i) => {
    if (!uniqueHoles.has(i)) {
      push(issues, path, `falta el hueco {{${i}}} en template`);
    }
    if (!blank.answer.length) {
      push(issues, path, `blank ${i}: answer vacío`);
    }
    if (blank.matchBlank !== undefined) {
      if (blank.matchBlank < 0 || blank.matchBlank >= blanks.length) {
        push(issues, path, `blank ${i}: matchBlank fuera de rango`);
      } else if (blank.matchBlank === i) {
        push(issues, path, `blank ${i}: matchBlank no puede apuntarse a sí mismo`);
      }
    }
    if (blank.pattern !== undefined) {
      try {
        new RegExp(blank.pattern);
      } catch {
        push(issues, path, `blank ${i}: pattern inválido: "${blank.pattern}"`);
      }
    }
  });
}

function validatePracticeSets(
  courses: readonly CourseDefinition[],
  practiceSets: readonly PracticeUnitSetDefinition[],
  issues: ContentValidationIssue[],
): void {
  const courseBySlug = new Map(courses.map((c) => [c.slug, c] as const));
  const seenUnitPerCourse = new Set<string>();
  const exerciseSlugsByCourse = new Map<string, Set<string>>();

  for (const set of practiceSets) {
    const path = `practiceSets[${set.courseSlug}/${set.unitSlug}]`;

    const course = courseBySlug.get(set.courseSlug);
    if (!course) {
      push(issues, path, `no existe el curso "${set.courseSlug}"`);
    } else {
      const unit = course.units.find((u) => u.slug === set.unitSlug);
      if (!unit) {
        push(
          issues,
          path,
          `el curso "${set.courseSlug}" no tiene la unidad "${set.unitSlug}"`,
        );
      }
    }

    const unitKey = `${set.courseSlug}::${set.unitSlug}`;
    if (seenUnitPerCourse.has(unitKey)) {
      push(
        issues,
        path,
        `más de un set de práctica para la unidad "${set.unitSlug}"`,
      );
    } else {
      seenUnitPerCourse.add(unitKey);
    }

    const exerciseSlugs =
      exerciseSlugsByCourse.get(set.courseSlug) ?? new Set<string>();
    exerciseSlugsByCourse.set(set.courseSlug, exerciseSlugs);

    set.exercises.forEach((exercise, index) => {
      validatePracticeExercise(exercise, path, index, exerciseSlugs, issues);
    });
  }
}

function validatePracticeExercise(
  ex: PracticeExerciseDefinition,
  setPath: string,
  index: number,
  seenSlugsInCourse: Set<string>,
  issues: ContentValidationIssue[],
): void {
  const path = `${setPath}.exercises[${ex.slug || index}]`;

  if (!ex.slug.trim()) {
    push(issues, path, "slug vacío");
  } else if (seenSlugsInCourse.has(ex.slug)) {
    push(issues, path, `slug de ejercicio duplicado dentro del curso: "${ex.slug}"`);
  } else {
    seenSlugsInCourse.add(ex.slug);
  }

  if (!ex.title.trim()) push(issues, path, "title vacío");
  if (!ex.description.trim()) push(issues, path, "description vacía");
  if (!ex.prompt.trim()) push(issues, path, "prompt vacío");
  if (!ex.solutionCode.trim()) push(issues, path, "solutionCode vacío");
  if (!["easy", "medium", "hard"].includes(ex.difficulty)) {
    push(issues, path, `difficulty inválida: "${ex.difficulty}"`);
  }
  if (ex.testCases.length === 0) {
    push(issues, path, "debe tener al menos 1 test");
  }

  if (ex.structure) {
    const result = structureContractSchema.safeParse(ex.structure);
    if (!result.success) {
      push(issues, path, `structure inválido: ${result.error.message}`);
    }
  }

  const readsStdin = ex.testCases.some(
    (tc) => (tc.stdin ?? "").trim().length > 0,
  );
  if (readsStdin) {
    const visibleInputs = new Set(
      ex.testCases
        .filter((tc) => tc.visible !== false)
        .map((tc) => tc.stdin ?? ""),
    );
    const discriminating = ex.testCases.filter(
      (tc) => tc.visible === false && !visibleInputs.has(tc.stdin ?? ""),
    );
    if (discriminating.length === 0) {
      push(
        issues,
        path,
        "ningún test oculto usa una entrada distinta a las visibles",
      );
    }
  }
}
