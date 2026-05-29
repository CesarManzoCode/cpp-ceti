// =====================================================================
// Tipos type-safe para definir el contenido del curso en TypeScript.
// Cambia, agrega o reordena lecciones aquí y luego ejecuta `npm run db:seed`.
// =====================================================================

export interface CourseDefinition {
  slug: string;
  title: string;
  description: string;
  units: UnitDefinition[];
}

export interface UnitDefinition {
  slug: string;
  title: string;
  description: string;
  icon?: string;
  colorAccent?: string;
  published?: boolean;
  lessons: LessonDefinition[];
}

export interface LessonDefinition {
  slug: string;
  title: string;
  description: string;
  xpReward?: number;
  estimatedMinutes?: number;
  published?: boolean;
  steps: StepDefinition[];
}

export type StepDefinition =
  | TheoryStep
  | CodeExampleStep
  | QuizStep
  | FillBlankStep
  | CodeChallengeStep;

export interface TheoryStep {
  type: "theory";
  markdown: string;
  mediaUrl?: string;
}

export interface CodeExampleStep {
  type: "code_example";
  code: string;
  explanation: string;
  runnable?: boolean;
  expectedOutput?: string;
}

export interface QuizStep {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FillBlankStep {
  type: "fill_blank";
  template: string;
  /**
   * Enunciado específico del ejercicio (markdown). Si se define, reemplaza al
   * encabezado genérico "Llena los espacios para que el programa compile" y
   * debe describir EXACTAMENTE qué espera el ejercicio. Úsalo siempre que la
   * respuesta no sea obvia desde el código mostrado.
   */
  prompt?: string;
  blanks: {
    /** Respuesta canónica (se muestra como ejemplo y dimensiona el campo). */
    answer: string;
    /**
     * Regex opcional para blanks de texto libre. Si está presente, la respuesta
     * se valida contra este patrón (anclado) en lugar de comparar exacto con
     * `answer`. Ej: `"\\".*\\""` para aceptar cualquier texto entre comillas.
     */
    pattern?: string;
    /**
     * Índice de OTRO blank con el que este debe COINCIDIR exactamente. Permite
     * "cualquier nombre válido — pero el mismo en ambos lugares". Si se usa,
     * el `pattern` controla qué se considera "válido" (por defecto: identificador
     * C++); el `answer` solo sirve para ejemplo/dimensionar el input.
     */
    matchBlank?: number;
    /** Pista opcional */
    hint?: string;
  }[];
  explanation?: string;
}

export interface CodeChallengeStep {
  type: "code_challenge";
  exercise: ExerciseDefinition;
}

export interface ExerciseDefinition {
  prompt: string;
  starterCode: string;
  solutionCode: string;
  hints?: string[];
  difficulty?: "easy" | "medium" | "hard";
  xpReward?: number;
  testCases: TestCaseDefinition[];
}

export interface TestCaseDefinition {
  stdin?: string;
  expectedStdout: string;
  visible?: boolean;
  description?: string;
}
