import type { TestCaseResult } from "@/lib/executor";

/**
 * Test visible para un ejercicio (compartido entre práctica y reto de lección).
 * Los tests ocultos no se mandan al cliente; solo aparecen tests con visible=true.
 */
export interface VisibleTest {
  id: string;
  stdin: string;
  expectedStdout: string;
  description: string | null;
}

/**
 * Resultado de calificar un envío. Lo devuelven `submitExercise` y
 * `submitPracticeExercise` y lo consume `<SubmissionResults>`.
 */
export interface SubmissionState {
  passed: boolean;
  results: TestCaseResult[];
  feedback: string;
  /**
   * Requisitos ESTRUCTURALES del enunciado que el código no cumple (clases,
   * miembros, visibilidad, herencia…). Vacío cuando el reto sólo evalúa
   * comportamiento. Un error de diseño nunca se reduce a "salida
   * incorrecta": se dice cuál es.
   */
  structureFailures?: string[];
}
