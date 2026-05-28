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
}

/**
 * Conjunto de ejercicios de una unidad. El `unitSlug` se usa para
 * agrupar visualmente y para el contexto pedagógico de la dificultad.
 */
export interface PracticeUnitSetDefinition {
  unitSlug: string;       // debe coincidir con el slug de la unidad
  unitTitle: string;      // texto para el header del grupo
  unitIcon?: string;      // emoji opcional (espejo del de la unidad)
  exercises: PracticeExerciseDefinition[];
}
