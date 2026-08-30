import { describe, expect, it } from "vitest";

import { clientEventSchema, toEventRow } from "@/lib/analytics/events";

const SESSION = "sess_1";

describe("taxonomía de eventos", () => {
  it("rechaza un evento que no está en la taxonomía", () => {
    const parsed = clientEventSchema.safeParse({
      name: "usuario_hizo_scroll",
      lessonId: "l1",
      studySessionId: SESSION,
    });
    expect(parsed.success).toBe(false);
  });

  it("no deja que el cliente emita code_run (lo emite el servidor)", () => {
    const parsed = clientEventSchema.safeParse({
      name: "code_run",
      lessonId: "l1",
      studySessionId: SESSION,
      outcome: "success",
    });
    expect(parsed.success).toBe(false);
  });

  it("exige la sesión de estudio en todos los eventos", () => {
    const parsed = clientEventSchema.safeParse({
      name: "lesson_view",
      lessonId: "l1",
    });
    expect(parsed.success).toBe(false);
  });

  it("rechaza props fuera de contrato", () => {
    const parsed = clientEventSchema.safeParse({
      name: "lesson_step_attempt",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "theory", // no es un step interactivo
      attemptNumber: 1,
      correct: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("rechaza un número de intento absurdo", () => {
    const parsed = clientEventSchema.safeParse({
      name: "lesson_step_attempt",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      attemptNumber: 0,
      correct: false,
    });
    expect(parsed.success).toBe(false);
  });

  it("no acepta timestamps del cliente (los ignora del todo)", () => {
    const parsed = clientEventSchema.parse({
      name: "lesson_view",
      lessonId: "l1",
      studySessionId: SESSION,
      occurredAt: "1999-01-01T00:00:00.000Z",
    });
    expect(parsed).not.toHaveProperty("occurredAt");
  });
});

describe("dedupeKey", () => {
  it("una vista por sesión de estudio", () => {
    const a = toEventRow({
      name: "lesson_view",
      lessonId: "l1",
      studySessionId: SESSION,
    });
    const b = toEventRow({
      name: "lesson_view",
      lessonId: "l1",
      studySessionId: SESSION,
    });
    expect(a.dedupeKey).toBe(b.dedupeKey);
  });

  it("distingue sesiones distintas del mismo recurso", () => {
    const a = toEventRow({
      name: "lesson_view",
      lessonId: "l1",
      studySessionId: "sess_1",
    });
    const b = toEventRow({
      name: "lesson_view",
      lessonId: "l1",
      studySessionId: "sess_2",
    });
    expect(a.dedupeKey).not.toBe(b.dedupeKey);
  });

  it("una vista por paso, no una por re-render", () => {
    const first = toEventRow({
      name: "lesson_step_view",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      stepIndex: 0,
    });
    const again = toEventRow({
      name: "lesson_step_view",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      stepIndex: 0,
    });
    const other = toEventRow({
      name: "lesson_step_view",
      lessonId: "l1",
      lessonStepId: "s2",
      studySessionId: SESSION,
      stepType: "quiz",
      stepIndex: 1,
    });
    expect(first.dedupeKey).toBe(again.dedupeKey);
    expect(first.dedupeKey).not.toBe(other.dedupeKey);
  });

  it("cada intento pedagógico es distinto, pero el reintento de red no", () => {
    const attempt1 = toEventRow({
      name: "lesson_step_attempt",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      attemptNumber: 1,
      correct: false,
    });
    const attempt1Retry = toEventRow({
      name: "lesson_step_attempt",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      attemptNumber: 1,
      correct: false,
    });
    const attempt2 = toEventRow({
      name: "lesson_step_attempt",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      attemptNumber: 2,
      correct: true,
    });
    expect(attempt1.dedupeKey).toBe(attempt1Retry.dedupeKey);
    expect(attempt1.dedupeKey).not.toBe(attempt2.dedupeKey);
  });

  it("guarda la señal pedagógica en props, sin datos del alumno", () => {
    const row = toEventRow({
      name: "lesson_step_answer_revealed",
      lessonId: "l1",
      lessonStepId: "s1",
      studySessionId: SESSION,
      stepType: "quiz",
      failedAttempts: 3,
    });
    expect(row.props).toEqual({ stepType: "quiz", failedAttempts: 3 });
    expect(JSON.stringify(row)).not.toMatch(/cout|#include/);
  });

  it("marca la superficie correcta para práctica", () => {
    const row = toEventRow({
      name: "practice_engaged",
      practiceExerciseId: "p1",
      studySessionId: SESSION,
      trigger: "code_edit",
    });
    expect(row.surface).toBe("practice");
    expect(row.practiceExerciseId).toBe("p1");
    expect(row.lessonId).toBeUndefined();
  });
});
