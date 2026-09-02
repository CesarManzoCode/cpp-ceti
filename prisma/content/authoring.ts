// =====================================================================
// Capa de authoring — composición type-safe sobre el IR existente
// (`CourseDefinition` / `PracticeUnitSetDefinition`, sin cambios).
//
// No introduce un formato nuevo: sigue siendo TypeScript. Lo que da es
// una forma de escribir un curso NUEVO con su práctica colocalizada por
// unidad (`AuthoredUnitDefinition.practice`) y un único punto donde se
// ensamblan todos los cursos (`buildContentRegistry`), en vez de mantener
// a mano dos arreglos paralelos (`units` y `practiceSets`) que se pueden
// desincronizar.
//
// `defineLesson` / `defineUnit` son identidad: no aplican defaults, no
// reordenan, no mutan. Los defaults (xpReward, published, etc.) siguen
// viviendo exclusivamente en los seeds — ver `prisma/seed-content.ts` y
// `prisma/seed-practice.ts`.
// =====================================================================

import { validateContentRegistry } from "./validate";

import type {
  CourseDefinition,
  CurriculumSectionDefinition,
  LessonDefinition,
  UnitDefinition,
} from "./types";
import type {
  PracticeExerciseDefinition,
  PracticeUnitSetDefinition,
} from "./exercises/types";

/**
 * Una unidad tal como se autora: sus lecciones, más su práctica
 * colocalizada (si tiene). `practice` NUNCA llega a la DB como parte de
 * la unidad — `defineCourse` lo separa en su propio
 * `PracticeUnitSetDefinition`.
 */
export interface AuthoredUnitDefinition
  extends Omit<UnitDefinition, "lessons"> {
  lessons: LessonDefinition[];
  practice?: PracticeExerciseDefinition[];
}

/** Lo que produce `defineCourse`: el curso (IR de siempre) + su práctica. */
export interface CoursePackageDefinition {
  course: CourseDefinition;
  practiceSets: PracticeUnitSetDefinition[];
}

/**
 * Una agrupación curricular tal como se autora: sus unidades EN LÍNEA (en
 * vez de una lista de slugs apuntando a unidades declaradas aparte). El
 * `order` de la sección se deriva de su posición en el arreglo
 * `curriculum` — no se declara aquí.
 */
export interface AuthoredCurriculumSectionDefinition {
  key: string;
  semester: number;
  subjectName: string;
  units: AuthoredUnitDefinition[];
}

/** Metadata de curso sin `units` ni `curriculum` — común a ambos caminos. */
type CourseMetadata = Omit<CourseDefinition, "units" | "curriculum">;

/**
 * Lo que acepta `defineCourse`. Exactamente uno de los dos caminos:
 *   - `units`: el curso NO tiene agrupación curricular (comportamiento de
 *     siempre, intacto).
 *   - `curriculum`: el curso se declara como secciones curriculares, cada
 *     una con sus unidades; `defineCourse` las aplana a `CourseDefinition.units`
 *     y deriva las `CurriculumSectionDefinition` correspondientes.
 * No se acepta mezclar `units` sueltas con `curriculum` en el mismo curso.
 */
export type AuthoredCourseDefinition = CourseMetadata &
  (
    | {
        units: AuthoredUnitDefinition[];
        curriculum?: never;
      }
    | {
        curriculum: AuthoredCurriculumSectionDefinition[];
        units?: never;
      }
  );

/**
 * Identidad type-safe. No aplica defaults, no clona ni reordena — sólo
 * ayuda a que TypeScript infiera el tipo correcto en el sitio donde se
 * declara la lección.
 */
export function defineLesson(lesson: LessonDefinition): LessonDefinition {
  return lesson;
}

/**
 * Identidad type-safe para unidades autoradas. Preserva metadata, lessons
 * y practice tal cual se pasaron — no aplica defaults ni ordena nada.
 */
export function defineUnit(unit: AuthoredUnitDefinition): AuthoredUnitDefinition {
  return unit;
}

/**
 * Ensambla un `CoursePackageDefinition` a partir de metadata de curso +
 * unidades autoradas (`units`) O secciones curriculares (`curriculum`),
 * nunca ambas. Separa la práctica colocalizada de cada unidad en su
 * propio `PracticeUnitSetDefinition`, derivando `courseSlug`, `unitSlug`,
 * `unitTitle` y `unitIcon` de la unidad — nunca se infieren de otro lado
 * ni se piden por duplicado.
 *
 * Preserva EXACTAMENTE el orden de sections/units/lessons/steps/practice/
 * tests recibido: no ordena alfabéticamente, no aplica defaults, no
 * infiere `language` ni `executionProfile`, no muta el input.
 *
 * Camino `curriculum`: recorre las secciones en el orden recibido y,
 * dentro de cada una, sus unidades en el orden recibido; aplana todas las
 * unidades a `CourseDefinition.units` (ese aplanado es lo que define el
 * orden GLOBAL de navegación del curso, vía `Unit.order` en el seed) y
 * deriva `CurriculumSectionDefinition.order` (= posición de la sección +
 * 1) y `unitSlugs` (de las unidades de esa sección).
 */
export function defineCourse(
  course: AuthoredCourseDefinition,
): CoursePackageDefinition {
  if (course.curriculum) {
    return assembleFromCurriculum(course, course.curriculum);
  }
  return assembleFromUnits(course, course.units);
}

function assembleFromUnits(
  metadata: CourseMetadata,
  authoredUnits: AuthoredUnitDefinition[],
): CoursePackageDefinition {
  const { units, practiceSets } = flattenUnits(metadata.slug, authoredUnits);
  return {
    course: { ...metadata, units },
    practiceSets,
  };
}

function assembleFromCurriculum(
  metadata: CourseMetadata,
  sections: AuthoredCurriculumSectionDefinition[],
): CoursePackageDefinition {
  const units: UnitDefinition[] = [];
  const practiceSets: PracticeUnitSetDefinition[] = [];
  const curriculum: CurriculumSectionDefinition[] = [];

  sections.forEach((section, sectionIndex) => {
    const flattened = flattenUnits(metadata.slug, section.units);
    units.push(...flattened.units);
    practiceSets.push(...flattened.practiceSets);

    curriculum.push({
      key: section.key,
      semester: section.semester,
      subjectName: section.subjectName,
      order: sectionIndex + 1,
      unitSlugs: flattened.units.map((u) => u.slug),
    });
  });

  return {
    course: { ...metadata, units, curriculum },
    practiceSets,
  };
}

/** Aplana unidades autoradas a `UnitDefinition[]` + sus `PracticeUnitSetDefinition[]`. */
function flattenUnits(
  courseSlug: string,
  authoredUnits: AuthoredUnitDefinition[],
): { units: UnitDefinition[]; practiceSets: PracticeUnitSetDefinition[] } {
  const units: UnitDefinition[] = [];
  const practiceSets: PracticeUnitSetDefinition[] = [];

  for (const authoredUnit of authoredUnits) {
    const { practice, ...unit } = authoredUnit;
    units.push(unit);

    if (practice) {
      practiceSets.push({
        courseSlug,
        unitSlug: unit.slug,
        unitTitle: unit.title,
        unitIcon: unit.icon,
        exercises: practice,
      });
    }
  }

  return { units, practiceSets };
}

/**
 * Adapta un curso legacy (unidades grandes en un solo archivo, práctica
 * en un registry aparte por `unitSlug`) a la misma capa de authoring que
 * usan los cursos nuevos, SIN mover ni tocar su contenido.
 *
 * Preserva el orden de `course.units`. Empareja cada set de práctica con
 * su unidad por `unitSlug` y falla (Error, no `ContentValidationError`:
 * esto es un error de ENSAMBLAJE, detectado antes de que exista un
 * registry que validar) si:
 *   - un set declara un `courseSlug` que no es el de `course`;
 *   - un set apunta a una unidad que no existe en `course`;
 *   - hay más de un set para la misma unidad.
 *
 * `unitTitle`/`unitIcon` del set legacy son metadata duplicada antigua:
 * NO se comparan contra la unidad. El IR canónico que sale de
 * `defineCourse` siempre deriva esos campos de `unit.title`/`unit.icon`.
 */
export function adaptLegacyUnits(
  course: CourseDefinition,
  practiceSets: readonly PracticeUnitSetDefinition[],
): AuthoredUnitDefinition[] {
  const practiceByUnitSlug = new Map<string, PracticeUnitSetDefinition>();

  for (const set of practiceSets) {
    if (set.courseSlug !== course.slug) {
      throw new Error(
        `adaptLegacyUnits: el set de práctica de la unidad "${set.unitSlug}" ` +
          `declara courseSlug "${set.courseSlug}", pero se está adaptando ` +
          `el curso "${course.slug}".`,
      );
    }

    const unitExists = course.units.some((u) => u.slug === set.unitSlug);
    if (!unitExists) {
      throw new Error(
        `adaptLegacyUnits: el set de práctica declara la unidad ` +
          `"${set.unitSlug}", que no existe en el curso "${course.slug}".`,
      );
    }

    if (practiceByUnitSlug.has(set.unitSlug)) {
      throw new Error(
        `adaptLegacyUnits: hay más de un set de práctica para la unidad ` +
          `"${set.unitSlug}" del curso "${course.slug}".`,
      );
    }

    practiceByUnitSlug.set(set.unitSlug, set);
  }

  return course.units.map((unit): AuthoredUnitDefinition => {
    const set = practiceByUnitSlug.get(unit.slug);
    return set ? { ...unit, practice: set.exercises } : unit;
  });
}

/**
 * Aplana una lista de paquetes de curso en el registry canónico
 * (`allCourses` + `allPracticeSets`), preservando el orden del arreglo
 * `packages` y, dentro de cada curso, el orden curso→unidad de su
 * práctica. Síncrona, no lee filesystem, no toca DB, no compila nada.
 *
 * Corre la validación semántica completa (`validateContentRegistry`)
 * antes de devolver el registry: un `ContentValidationError` aquí
 * significa que ALGO del contenido (de cualquier curso) es inválido, y
 * el import de `./courses` falla con ese error en vez de dejar pasar un
 * registry a medias.
 */
export function buildContentRegistry(
  packages: readonly CoursePackageDefinition[],
): {
  allCourses: CourseDefinition[];
  allPracticeSets: PracticeUnitSetDefinition[];
} {
  const allCourses = packages.map((p) => p.course);
  const allPracticeSets = packages.flatMap((p) => p.practiceSets);

  validateContentRegistry(allCourses, allPracticeSets);

  return { allCourses, allPracticeSets };
}
