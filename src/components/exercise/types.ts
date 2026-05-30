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
}
