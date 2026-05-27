// =====================================================================
// Tipos de contenido de las lecciones.
// El campo `content` de cada LessonStep es un JSON validado por estos tipos.
// =====================================================================

export type StepType =
  | "theory"
  | "code_example"
  | "quiz"
  | "fill_blank"
  | "code_challenge";

export interface TheoryStepContent {
  /** Cuerpo de la lección en Markdown. Soporta bloques de código con ```cpp */
  markdown: string;
  /** URL opcional de imagen, diagrama o video corto */
  mediaUrl?: string;
}

export interface CodeExampleStepContent {
  /** Código a mostrar */
  code: string;
  /** Explicación en markdown */
  explanation: string;
  /** Si true, el usuario puede correr el código en el editor */
  runnable: boolean;
  /** Output esperado a mostrar como referencia */
  expectedOutput?: string;
}

export interface QuizStepContent {
  question: string;
  options: string[];
  /** Índice de la opción correcta (0-based) */
  correctIndex: number;
  explanation: string;
}

export interface FillBlankStepContent {
  /**
   * Template con espacios marcados como {{0}}, {{1}}, etc.
   * Ej: `cout << "Hola" {{0}} endl;`
   */
  template: string;
  blanks: {
    /** Respuesta correcta exacta */
    answer: string;
    /** Pista opcional */
    hint?: string;
  }[];
  explanation?: string;
}

export interface CodeChallengeStepContent {
  /** Indica que los detalles vienen del Exercise relacionado */
  exerciseRef: true;
}

export type StepContent =
  | ({ type: "theory" } & TheoryStepContent)
  | ({ type: "code_example" } & CodeExampleStepContent)
  | ({ type: "quiz" } & QuizStepContent)
  | ({ type: "fill_blank" } & FillBlankStepContent)
  | ({ type: "code_challenge" } & CodeChallengeStepContent);

export interface LessonStepData<T extends StepType = StepType> {
  id: string;
  order: number;
  type: T;
  content: Extract<StepContent, { type: T }>;
}
