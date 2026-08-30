import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FakeDb } from "../../helpers/fake-prisma";

vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("../../helpers/fake-prisma");
  return { db: createFakeDb() };
});
vi.mock("@/lib/get-session", () => ({
  requireSession: vi.fn(async () => ({ user: { id: "user_1" } })),
}));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/rate-limit")>()),
  enforceRateLimit: vi.fn(async () => {}),
}));

import { recordHintViewed, trackEvent } from "@/features/analytics/actions";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;

beforeEach(() => {
  fake.reset();
  fake.seed("studySession", [
    { id: "sess_1", userId: "user_1", surface: "lesson", resourceId: "lesson_1" },
    { id: "sess_other", userId: "user_2", surface: "lesson", resourceId: "lesson_1" },
  ]);
  fake.seed("lesson", [{ id: "lesson_1", contentRevision: "rev_lesson" }]);
  fake.seed("lessonStep", [
    { id: "step_1", lessonId: "lesson_1", contentRevision: "rev_step" },
    { id: "step_other", lessonId: "lesson_2", contentRevision: "rev_other" },
  ]);
  fake.seed("exercise", [
    { id: "ex_1", hints: ["pista 1", "pista 2"], contentRevision: "rev_ex" },
  ]);
  fake.seed("practiceExercise", [
    { id: "p_1", hints: ["pista"], contentRevision: "rev_practice" },
  ]);
});

describe("trackEvent", () => {
  const view = {
    name: "lesson_view" as const,
    lessonId: "lesson_1",
    studySessionId: "sess_1",
  };

  it("registra el evento una sola vez aunque se reintente", async () => {
    expect(await trackEvent(view)).toEqual({ recorded: true });
    expect(await trackEvent(view)).toEqual({ recorded: false });
    expect(fake.table("productEvent")).toHaveLength(1);
  });

  it("resuelve la revisión de contenido en el servidor", async () => {
    await trackEvent({
      name: "lesson_step_view",
      lessonId: "lesson_1",
      lessonStepId: "step_1",
      studySessionId: "sess_1",
      stepType: "quiz",
      stepIndex: 0,
    });
    const row = fake.table("productEvent")[0];
    expect(row.contentRevision).toBe("rev_step");
    expect(row.occurredAt).toBeUndefined(); // lo pone la BD, no el cliente
  });

  it("descarta eventos apuntando a la sesión de otro usuario", async () => {
    const result = await trackEvent({ ...view, studySessionId: "sess_other" });
    expect(result).toEqual({ recorded: false });
    expect(fake.table("productEvent")).toHaveLength(0);
  });

  it("descarta un paso que no pertenece a la lección declarada", async () => {
    const result = await trackEvent({
      name: "lesson_step_view",
      lessonId: "lesson_1",
      lessonStepId: "step_other",
      studySessionId: "sess_1",
      stepType: "quiz",
      stepIndex: 0,
    });
    expect(result).toEqual({ recorded: false });
    expect(fake.table("productEvent")).toHaveLength(0);
  });

  it("rechaza un evento que no está en la taxonomía", async () => {
    await expect(
      // @ts-expect-error probamos justamente el input inválido
      trackEvent({ name: "inventado", lessonId: "lesson_1", studySessionId: "sess_1" }),
    ).rejects.toThrow();
    expect(fake.table("productEvent")).toHaveLength(0);
  });

  it("distingue un quiz fallado y revelado de uno acertado a la primera", async () => {
    for (const attemptNumber of [1, 2, 3]) {
      await trackEvent({
        name: "lesson_step_attempt",
        lessonId: "lesson_1",
        lessonStepId: "step_1",
        studySessionId: "sess_1",
        stepType: "quiz",
        attemptNumber,
        correct: false,
      });
    }
    await trackEvent({
      name: "lesson_step_answer_revealed",
      lessonId: "lesson_1",
      lessonStepId: "step_1",
      studySessionId: "sess_1",
      stepType: "quiz",
      failedAttempts: 3,
    });

    const events = fake.table("productEvent");
    expect(events.filter((e) => e.name === "lesson_step_attempt")).toHaveLength(3);
    expect(
      events.filter((e) => e.name === "lesson_step_answer_revealed"),
    ).toHaveLength(1);
  });
});

describe("recordHintViewed", () => {
  it("registra la pista una sola vez por usuario y ejercicio", async () => {
    const input = {
      target: { kind: "exercise" as const, exerciseId: "ex_1" },
      hintIndex: 0,
      studySessionId: "sess_1",
    };
    expect(await recordHintViewed(input)).toEqual({ recorded: true });
    expect(await recordHintViewed(input)).toEqual({ recorded: false });
    expect(fake.table("userHintViewed")).toHaveLength(1);
  });

  it("cada pista distinta sí se registra", async () => {
    await recordHintViewed({
      target: { kind: "exercise", exerciseId: "ex_1" },
      hintIndex: 0,
    });
    await recordHintViewed({
      target: { kind: "exercise", exerciseId: "ex_1" },
      hintIndex: 1,
    });
    expect(fake.table("userHintViewed")).toHaveLength(2);
  });

  it("guarda la sesión de estudio y la revisión de contenido", async () => {
    await recordHintViewed({
      target: { kind: "exercise", exerciseId: "ex_1" },
      hintIndex: 0,
      studySessionId: "sess_1",
    });
    const row = fake.table("userHintViewed")[0];
    expect(row.studySessionId).toBe("sess_1");
    expect(row.contentRevision).toBe("rev_ex");
    expect(row.practiceExerciseId).toBeNull();
  });

  it("ignora una sesión de estudio ajena en vez de atribuirla mal", async () => {
    await recordHintViewed({
      target: { kind: "exercise", exerciseId: "ex_1" },
      hintIndex: 0,
      studySessionId: "sess_other",
    });
    expect(fake.table("userHintViewed")[0].studySessionId).toBeNull();
  });

  it("rechaza una pista que no existe", async () => {
    await expect(
      recordHintViewed({
        target: { kind: "exercise", exerciseId: "ex_1" },
        hintIndex: 7,
      }),
    ).rejects.toThrow(/pista/i);
  });

  it("funciona igual para ejercicios de práctica", async () => {
    expect(
      await recordHintViewed({
        target: { kind: "practice", practiceExerciseId: "p_1" },
        hintIndex: 0,
      }),
    ).toEqual({ recorded: true });
    expect(fake.table("userHintViewed")[0].exerciseId).toBeNull();
  });
});
