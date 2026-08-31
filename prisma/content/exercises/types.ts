// =====================================================================
// Tipos para EJERCICIOS DE PRÁCTICA (independientes de lecciones).
//
// Cada ejercicio vive solo. El seed los carga en la tabla
// `practice_exercise`. No comparten estructura con las lecciones
// — son sueltos.
//
// La dificultad es RELATIVA a su unidad: "hard" en `primer-programa`
// = escribir un Hola Mundo desde cero. "hard" en `arreglos` = un
// programa con búsqueda + estadísticas desde cero. Cada uno se mide
// contra el material de su unidad.
//
// REGLA ANTI-HARDCODE (importante):
//   Las pruebas validan solo stdout. Si un ejercicio NO lee de stdin,
//   su salida es FIJA y el alumno puede copiarla con un `printf` sin
//   resolver nada. Por eso, todo ejercicio que enseñe una TÉCNICA
//   (loops, arreglos, matrices, archivos, funciones) DEBE:
//     1. Leer sus datos desde stdin (scanf/cin).
//     2. Tener >=2 test cases ocultos con inputs DISTINTOS (incluye
//        edge cases). Así un output hardcodeado falla los ocultos.
//   Única excepción: ejercicios cuyo objetivo ES producir un texto
//   fijo (ej. "imprime Hola Mundo" en la unidad 1) — ahí imprimir es
//   el ejercicio y no hay algoritmo que saltarse.
// =====================================================================

import type { StructureContract } from "../../../src/lib/structure/contract";

export type { StructureContract };

export type Difficulty = "easy" | "medium" | "hard";

export interface PracticeTestCaseDefinition {
  stdin?: string;
  expectedStdout: string;
  visible?: boolean;
  description?: string;
}

export interface PracticeExerciseDefinition {
  slug: string;
  title: string;
  description: string;
  prompt: string;       // markdown del enunciado
  starterCode: string;  // pre-cargado en el editor
  solutionCode: string; // referencia interna, no se muestra
  hints?: string[];
  difficulty: Difficulty;
  xpReward?: number;
  testCases: PracticeTestCaseDefinition[];
  /**
   * Contrato estructural. Ver `ExerciseDefinition.structure` en
   * `prisma/content/types.ts`: mismo significado y mismo evaluador.
   */
  structure?: StructureContract;
}

/**
 * Conjunto de ejercicios de una unidad de UN curso.
 *
 * `courseSlug` es obligatorio: dos cursos pueden tener unidades y ejercicios
 * con nombres convencionales idénticos ("arreglos", "constructores"). Sin el
 * curso, el seed no puede resolver a qué unidad pertenece el conjunto y los
 * intentos de un alumno podrían colgarse del ejercicio equivocado. El curso
 * NUNCA se infiere de un prefijo de slug.
 */
export interface PracticeUnitSetDefinition {
  courseSlug: string;     // debe coincidir con el slug del curso
  unitSlug: string;       // debe coincidir con el slug de la unidad DEL CURSO
  unitTitle: string;      // texto para el header del grupo
  unitIcon?: string;      // emoji opcional (espejo del de la unidad)
  exercises: PracticeExerciseDefinition[];
}
