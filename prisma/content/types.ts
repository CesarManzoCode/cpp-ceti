// =====================================================================
// Tipos type-safe para definir el contenido del curso en TypeScript.
// Cambia, agrega o reordena lecciones aquí y luego ejecuta `npm run db:seed`.
// =====================================================================

import type {
  ExecutionProfileId,
  LanguageId,
} from "../../src/lib/code-languages";
import type { StructureContract } from "../../src/lib/structure/contract";

export type { ExecutionProfileId, LanguageId, StructureContract };

/**
 * Un curso es la unidad de identidad del producto: define QUÉ se enseña y
 * CON QUÉ se ejecuta. `language` y `executionProfile` no son decoración —
 * son la fuente de verdad de la que todo lo demás (editor, compilador,
 * diagnósticos, analytics) deriva. Nunca se infieren de un slug ni de un
 * fence de markdown.
 */
export interface CourseDefinition {
  slug: string;
  title: string;
  description: string;
  /** Materia académica tal como aparece en el plan de estudios. */
  subjectName: string;
  /** Contexto académico visible (programa, semestre, institución). */
  academicContext: string;
  language: LanguageId;
  executionProfile: ExecutionProfileId;
  units: UnitDefinition[];
  /**
   * Agrupaciones curriculares OPCIONALES de las `units` de este curso (p.
   * ej. "1.er semestre — Fundamentos de Desarrollo de Software"). Un curso
   * sin `curriculum` sigue siendo válido: la agrupación es organización,
   * no identidad — no crea rutas, no afecta progreso/XP y `Unit.order`
   * sigue siendo el único orden real de navegación.
   */
  curriculum?: CurriculumSectionDefinition[];
}

/**
 * Una agrupación curricular (p. ej. una materia de un semestre) dentro de
 * UN Course. Agrupa `Unit`s ya existentes del curso — no es una entidad de
 * identidad propia: no aparece en URLs, no tiene progreso ni XP propios.
 */
export interface CurriculumSectionDefinition {
  /** Identidad estable dentro del Course. No forma parte de URLs. */
  key: string;

  /** Entero positivo. NO limitar a 1..8. */
  semester: number;

  /** Nombre académico de la materia/bloque. */
  subjectName: string;

  /** Derivado del orden del array. Base 1. */
  order: number;

  /** Slugs de las Units pertenecientes a esta section. */
  unitSlugs: string[];
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
  | CodeChallengeStep
  | MatchingStep
  | CodeCompletionStep;

export interface TheoryStep {
  type: "theory";
  markdown: string;
  mediaUrl?: string;
}

export interface CodeExampleStep {
  type: "code_example";
  code: string;
  explanation: string;
  /**
   * `true` habilita el botón de ejecutar. Default `false`.
   *
   * Los ejemplos que NO se pueden ejecutar honestamente en el juez del
   * navegador (Windows Forms, por ejemplo) DEBEN quedar en `false`: la UI
   * no muestra control de ejecución y el servidor rechaza cualquier intento
   * de ejecutarlos aunque llegue una petición forjada.
   */
  runnable?: boolean;
  expectedOutput?: string;
  /**
   * Nota visible para ejemplos no ejecutables: explica dónde SÍ se corren
   * (ej. "Requiere Visual Studio en Windows"). Sólo tiene sentido con
   * `runnable: false`.
   */
  localOnlyNote?: string;
}

export interface QuizStep {
  type: "quiz";
  question: string;
  options: string[];
  /** Mensaje dirigido por opción incorrecta (mismo índice que `options`). Opcional. */
  feedbackPerOption?: string[];
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
     * del lenguaje del curso); el `answer` solo sirve para ejemplo/dimensionar
     * el input.
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
  /**
   * Contrato ESTRUCTURAL del reto (sólo cursos con lector estructural; hoy,
   * C#). Declararlo convierte el objetivo del reto en "comportamiento +
   * estructura": la salida correcta deja de bastar y el alumno recibe
   * feedback de qué clase, miembro, visibilidad o relación falta.
   *
   * Se declara SÓLO en retos cuyo objetivo es estructural. Un reto que
   * enseña un algoritmo se queda sin contrato y se evalúa por salida.
   */
  structure?: StructureContract;
}

export interface TestCaseDefinition {
  stdin?: string;
  expectedStdout: string;
  visible?: boolean;
  description?: string;
}

/**
 * Pareo conceptual — el alumno empareja cada item de la columna izquierda
 * con el correspondiente de la derecha. Se mezclan visualmente para que
 * piense la respuesta, no la posición.
 */
export interface MatchingStep {
  type: "matching";
  /** Enunciado (markdown) — opcional. */
  prompt?: string;
  /** Cada par {left, right} es una asociación correcta. */
  pairs: { left: string; right: string }[];
  /** Explicación que se muestra al pasar. */
  explanation?: string;
}

/**
 * Reordenar líneas — la UI muestra el código mezclado y el alumno tiene
 * que poner las líneas en el orden correcto usando flechas ↑/↓.
 */
export interface CodeCompletionStep {
  type: "code_completion";
  prompt?: string;
  /** Líneas en orden correcto. La UI las muestra mezcladas al inicio. */
  lines: string[];
  explanation?: string;
}
