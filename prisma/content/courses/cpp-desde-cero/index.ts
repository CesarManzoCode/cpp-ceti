// =====================================================================
// Paquete de curso: C++ desde cero.
//
// Legacy: las 10 unidades y los 10 sets de práctica siguen viviendo en
// sus archivos grandes de siempre (`prisma/content/unidad-*.ts` y
// `prisma/content/exercises/u*.ts`) — NO se movieron ni se editaron. Lo
// único que vive aquí es el ENSAMBLAJE: la metadata del curso (relocada
// tal cual desde el `prisma/content/index.ts` anterior), el paso por
// `adaptLegacyUnits` para entrar a la capa de authoring, y la agrupación
// curricular EN DOS SEMESTRES (`curriculum`) que `defineCourse` aplana de
// vuelta a `CourseDefinition.units` — ese aplanado es el único orden real
// de navegación del curso (`Unit.order`, numerado por el seed).
// =====================================================================

import { adaptLegacyUnits, defineCourse } from "../../authoring";
import type { AuthoredUnitDefinition } from "../../authoring";
import type { CourseDefinition } from "../../types";

import { unidad01 } from "../../unidad-01-primer-programa";
import { unidadCin } from "../../unidad-02-cin";
import { unidadVariables } from "../../unidad-03-variables";
import { unidad04 } from "../../unidad-04-control-flujo";
import { unidad05 } from "../../unidad-05-loops";
import { unidad06 } from "../../unidad-06-funciones";
import { unidad07 } from "../../unidad-07-printf-scanf";
import { unidad08 } from "../../unidad-08-arreglos";
import { unidad09 } from "../../unidad-09-archivos";
import { unidad10 } from "../../unidad-10-matrices";

import { u01PrimerProgramaExercises } from "../../exercises/u01-primer-programa";
import { u02CinExercises } from "../../exercises/u02-cin";
import { u03VariablesExercises } from "../../exercises/u03-variables";
import { u04ControlFlujoExercises } from "../../exercises/u04-control-flujo";
import { u05LoopsExercises } from "../../exercises/u05-loops";
import { u06FuncionesExercises } from "../../exercises/u06-funciones";
import { u07PrintfScanfExercises } from "../../exercises/u07-printf-scanf";
import { u08ArreglosExercises } from "../../exercises/u08-arreglos";
import { u09ArchivosExercises } from "../../exercises/u09-archivos";
import { u10MatricesExercises } from "../../exercises/u10-matrices";

const cursoCppLegacy: CourseDefinition = {
  // El slug es identidad histórica: NO se renombra. Todas las URLs viejas,
  // el progreso y los intentos de los alumnos cuelgan de él.
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description:
    "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. " +
    "Cada concepto va seguido de práctica inmediata.",
  subjectName: "Programación en C++",
  academicContext: "Curso introductorio CETI",
  language: "cpp",
  executionProfile: "cpp17-wandbox",
  // El ORDEN de este arreglo es el orden del curso (el seed numera por
  // posición). "Variables y tipos" va ANTES de "Leer datos con cin": la
  // unidad de `cin` ya usaba `int`, `double`, `string`, aritmética y
  // `setprecision`, es decir, exactamente lo que la de variables enseña.
  // Los slugs NO cambian —`leer-datos` y `variables-y-tipos` siguen siendo
  // los mismos recursos, con el mismo progreso y los mismos enlaces—; lo
  // único que cambia es en qué posición aparecen.
  units: [
    unidad01,
    unidadVariables,
    unidadCin,
    unidad04,
    unidad05,
    unidad06,
    unidad07,
    unidad08,
    unidad09,
    unidad10,
  ],
};

// Orden histórico del registry de práctica (`prisma/content/exercises/index.ts`
// de antes de este refactor): por archivo, NO por posición de unidad en el
// curso. `adaptLegacyUnits` empareja por `unitSlug`, así que este arreglo
// sólo necesita traer los 10 sets — el orden de SALIDA de la práctica lo fija
// `defineCourse` recorriendo `course.units` (ver `authoring.ts`).
const legacyPracticeSets = [
  u01PrimerProgramaExercises,
  u02CinExercises,
  u03VariablesExercises,
  u04ControlFlujoExercises,
  u05LoopsExercises,
  u06FuncionesExercises,
  u07PrintfScanfExercises,
  u08ArreglosExercises,
  u09ArchivosExercises,
  u10MatricesExercises,
];

const authoredUnits = adaptLegacyUnits(cursoCppLegacy, legacyPracticeSets);

const unitsBySlug = new Map(authoredUnits.map((u) => [u.slug, u] as const));

/** Selecciona una Unit legacy ya adaptada por su slug. Falla cerrado. */
function unit(slug: string): AuthoredUnitDefinition {
  const found = unitsBySlug.get(slug);
  if (!found) {
    throw new Error(
      `courses/cpp-desde-cero: no existe la unidad "${slug}" en cursoCppLegacy.units.`,
    );
  }
  return found;
}

const { slug, title, description, subjectName, academicContext, language, executionProfile } =
  cursoCppLegacy;

export const cppDesdeCero = defineCourse({
  slug,
  title,
  description,
  subjectName,
  academicContext,
  language,
  executionProfile,
  curriculum: [
    {
      key: "s1-fundamentos-desarrollo-software",
      semester: 1,
      subjectName: "Fundamentos de Desarrollo de Software",
      units: [
        unit("primer-programa"),
        unit("variables-y-tipos"),
        unit("leer-datos"),
        unit("control-de-flujo"),
        unit("loops"),
        unit("printf-scanf"),
      ],
    },
    {
      key: "s2-programacion-estructurada",
      semester: 2,
      subjectName: "Programación Estructurada",
      units: [
        unit("funciones"),
        unit("arreglos"),
        unit("archivos"),
        unit("matrices"),
      ],
    },
  ],
});
