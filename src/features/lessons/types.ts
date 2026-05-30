// =====================================================================
// Tipos de contenido de las lecciones.
// El campo `content` de cada LessonStep es un JSON validado por estos tipos.
// =====================================================================

export type StepType =
  | "theory"
  | "code_example"
  | "quiz"
  | "fill_blank"
  | "code_challenge"
  | "matching"
  | "code_completion";

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
  /** Mensaje dirigido por opción incorrecta (mismo índice que `options`). Opcional. */
  feedbackPerOption?: string[];
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
  /** Enunciado específico (markdown). Reemplaza al título genérico cuando existe. */
  prompt?: string;
  blanks: {
    /** Respuesta correcta exacta (canónica) */
    answer: string;
    /**
     * Regex opcional para blanks de texto libre. Si está presente, la respuesta
     * se valida contra este patrón (anclado) en vez de comparar exacto.
     */
    pattern?: string;
    /**
     * Índice de OTRO blank con el que este debe COINCIDIR. Permite "cualquier
     * nombre válido — pero el mismo en ambos lugares". Si se usa, el `pattern`
     * controla qué se considera "válido" (default: identificador C++).
     */
    matchBlank?: number;
    /** Pista opcional */
    hint?: string;
  }[];
  explanation?: string;
}

export interface CodeChallengeStepContent {
  /** Indica que los detalles vienen del Exercise relacionado */
  exerciseRef: true;
}

export interface MatchingStepContent {
  prompt?: string;
  pairs: { left: string; right: string }[];
  explanation?: string;
}

export interface CodeCompletionStepContent {
  prompt?: string;
  lines: string[];
  explanation?: string;
}

export type StepContent =
  | ({ type: "theory" } & TheoryStepContent)
  | ({ type: "code_example" } & CodeExampleStepContent)
  | ({ type: "quiz" } & QuizStepContent)
  | ({ type: "fill_blank" } & FillBlankStepContent)
  | ({ type: "code_challenge" } & CodeChallengeStepContent)
  | ({ type: "matching" } & MatchingStepContent)
  | ({ type: "code_completion" } & CodeCompletionStepContent);

export interface LessonStepData<T extends StepType = StepType> {
  id: string;
  order: number;
  type: T;
  content: Extract<StepContent, { type: T }>;
}

/**
 * Shape consumido por `<LessonViewer>` / `<LessonStepRenderer>`.
 * Unifica el contenido tipado con el progreso del usuario y, para los
 * pasos de reto, el `Exercise` ya hidratado (con sus test cases visibles).
 */
export interface ViewerStep {
  id: string;
  order: number;
  type: StepContent["type"];
  content: StepContent;
  completed: boolean;
  exercise?: {
    id: string;
    prompt: string;
    starterCode: string;
    solutionCode: string;
    hints: string[];
    difficulty: "easy" | "medium" | "hard";
    xpReward: number;
    bestAttemptCode: string | null;
    visibleTests: {
      id: string;
      stdin: string;
      expectedStdout: string;
      description: string | null;
    }[];
  };
}
