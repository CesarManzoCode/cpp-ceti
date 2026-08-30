import { z } from "zod";

import { cuidSchema } from "@/lib/validation";

/**
 * TAXONOMÍA DE EVENTOS DE PRODUCTO
 * =================================
 * Cerrada, chica y documentada. Un evento entra aquí SÓLO si su señal no se
 * puede reconstruir de las tablas de dominio que ya existen:
 *
 *   · envíos calificados → `UserExerciseAttempt` / `UserPracticeAttempt`
 *   · aprobado por primera vez → `UserExerciseCompletion` / `UserPracticeCompletion`
 *   · progreso curricular → `UserStepProgress` / `UserLessonProgress`
 *   · pistas → `UserHintViewed`
 *   · reportes → `BugReport` / `Feedback`
 *
 * Nada de eso se duplica como evento. Lo que sí vive aquí es lo que antes
 * moría en el estado de React o no existía: vistas, primera interacción,
 * intentos de steps interactivos, respuestas reveladas y compilaciones sin
 * calificar.
 *
 * Reglas duras:
 *   · el servidor pone `occurredAt` (nunca el cliente);
 *   · el servidor resuelve `contentRevision` leyendo el recurso;
 *   · `props` tiene contrato por evento (abajo), no es JSON libre;
 *   · `dedupeKey` hace idempotente todo lo que un re-render, un doble click
 *     o un reintento podrían duplicar;
 *   · nunca guardamos código fuente, teclas, mouse ni texto del alumno.
 */

/** Tipos de step interactivo que dejan señal pedagógica. */
export const INTERACTIVE_STEP_TYPES = [
  "quiz",
  "fill_blank",
  "matching",
  "code_completion",
  "code_challenge",
] as const;

export const interactiveStepTypeSchema = z.enum(INTERACTIVE_STEP_TYPES);
export type InteractiveStepType = z.infer<typeof interactiveStepTypeSchema>;

/** Qué disparó la primera interacción de una visita. */
export const engagementTriggerSchema = z.enum([
  /** Avanzó de paso / envió una respuesta. */
  "step_advance",
  /** Contestó o manipuló un step interactivo. */
  "step_interaction",
  /** Escribió en el editor. */
  "code_edit",
  /** Compiló o envió código. */
  "code_run",
]);

const attemptNumberSchema = z
  .number()
  .int()
  .min(1)
  .max(1_000, "Número de intento fuera de rango");

/**
 * Eventos que el CLIENTE puede emitir. `code_run` no está aquí a propósito:
 * lo emite el servidor en `/api/run`, que es el único que sabe de verdad si
 * el código compiló.
 */
export const clientEventSchema = z.discriminatedUnion("name", [
  z.object({
    name: z.literal("lesson_view"),
    lessonId: cuidSchema,
    studySessionId: cuidSchema,
  }),
  z.object({
    name: z.literal("lesson_engaged"),
    lessonId: cuidSchema,
    studySessionId: cuidSchema,
    trigger: engagementTriggerSchema,
  }),
  z.object({
    name: z.literal("lesson_step_view"),
    lessonId: cuidSchema,
    lessonStepId: cuidSchema,
    studySessionId: cuidSchema,
    stepType: z.string().min(1).max(40),
    stepIndex: z.number().int().min(0).max(1_000),
  }),
  z.object({
    name: z.literal("lesson_step_attempt"),
    lessonId: cuidSchema,
    lessonStepId: cuidSchema,
    studySessionId: cuidSchema,
    stepType: interactiveStepTypeSchema,
    /** Ordinal del intento dentro de la visita (1 = primer intento). */
    attemptNumber: attemptNumberSchema,
    correct: z.boolean(),
  }),
  z.object({
    name: z.literal("lesson_step_answer_revealed"),
    lessonId: cuidSchema,
    lessonStepId: cuidSchema,
    studySessionId: cuidSchema,
    stepType: interactiveStepTypeSchema,
    /** Intentos fallidos antes de rendirse. */
    failedAttempts: z.number().int().min(0).max(1_000),
  }),
  z.object({
    name: z.literal("practice_view"),
    practiceExerciseId: cuidSchema,
    studySessionId: cuidSchema,
  }),
  z.object({
    name: z.literal("practice_engaged"),
    practiceExerciseId: cuidSchema,
    studySessionId: cuidSchema,
    trigger: engagementTriggerSchema,
  }),
]);

export type ClientEvent = z.infer<typeof clientEventSchema>;
export type ClientEventName = ClientEvent["name"];

/** Resultado de una compilación sin calificar (evento `code_run`). */
export const runOutcomeSchema = z.enum([
  "success",
  "compile_error",
  "runtime_error",
  "time_limit",
  "internal_error",
]);
export type RunOutcome = z.infer<typeof runOutcomeSchema>;

/**
 * Traduce un evento del cliente a las columnas de `product_event`.
 * `contentRevision` NO se calcula aquí: lo resuelve el servidor leyendo el
 * recurso, porque el cliente no es fuente confiable de esa información.
 */
export function toEventRow(event: ClientEvent): {
  name: ClientEventName;
  surface: "lesson" | "practice";
  lessonId?: string;
  lessonStepId?: string;
  practiceExerciseId?: string;
  studySessionId: string;
  dedupeKey: string;
  props: Record<string, unknown>;
} {
  const s = event.studySessionId;
  switch (event.name) {
    case "lesson_view":
      return {
        name: event.name,
        surface: "lesson",
        lessonId: event.lessonId,
        studySessionId: s,
        dedupeKey: `lesson_view:${s}`,
        props: {},
      };
    case "lesson_engaged":
      return {
        name: event.name,
        surface: "lesson",
        lessonId: event.lessonId,
        studySessionId: s,
        // Una visita "se engancha" una sola vez, dispare lo que dispare.
        dedupeKey: `lesson_engaged:${s}`,
        props: { trigger: event.trigger },
      };
    case "lesson_step_view":
      return {
        name: event.name,
        surface: "lesson",
        lessonId: event.lessonId,
        lessonStepId: event.lessonStepId,
        studySessionId: s,
        // Volver al mismo paso dentro de la misma visita no infla la vista.
        dedupeKey: `lesson_step_view:${s}:${event.lessonStepId}`,
        props: { stepType: event.stepType, stepIndex: event.stepIndex },
      };
    case "lesson_step_attempt":
      return {
        name: event.name,
        surface: "lesson",
        lessonId: event.lessonId,
        lessonStepId: event.lessonStepId,
        studySessionId: s,
        // El ordinal del intento hace el reintento de red idempotente.
        dedupeKey: `lesson_step_attempt:${s}:${event.lessonStepId}:${event.attemptNumber}`,
        props: {
          stepType: event.stepType,
          attemptNumber: event.attemptNumber,
          correct: event.correct,
        },
      };
    case "lesson_step_answer_revealed":
      return {
        name: event.name,
        surface: "lesson",
        lessonId: event.lessonId,
        lessonStepId: event.lessonStepId,
        studySessionId: s,
        dedupeKey: `lesson_step_answer_revealed:${s}:${event.lessonStepId}`,
        props: {
          stepType: event.stepType,
          failedAttempts: event.failedAttempts,
        },
      };
    case "practice_view":
      return {
        name: event.name,
        surface: "practice",
        practiceExerciseId: event.practiceExerciseId,
        studySessionId: s,
        dedupeKey: `practice_view:${s}`,
        props: {},
      };
    case "practice_engaged":
      return {
        name: event.name,
        surface: "practice",
        practiceExerciseId: event.practiceExerciseId,
        studySessionId: s,
        dedupeKey: `practice_engaged:${s}`,
        props: { trigger: event.trigger },
      };
  }
}
