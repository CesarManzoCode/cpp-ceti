import type { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

import { markStepCompletedInTx } from "@/features/lessons/lib/progression";

import { createFakeDb, type FakeDb } from "../../helpers/fake-prisma";

const USER = "user_1";
const LESSON = "lesson_1";
const STEPS = ["step_1", "step_2"];
const LESSON_XP = 40;

describe("markStepCompletedInTx", () => {
  let db: FakeDb;

  beforeEach(() => {
    db = createFakeDb();
  });

  const mark = (stepId: string) =>
    db.$transaction((tx) =>
      markStepCompletedInTx(
        tx as unknown as Prisma.TransactionClient,
        USER,
        stepId,
        LESSON,
        STEPS,
        LESSON_XP,
      ),
    );

  it("con pasos pendientes deja la lección in_progress y sin XP", async () => {
    const res = await mark(STEPS[0]!);

    expect(res).toEqual({
      allStepsDone: false,
      lessonJustCompleted: false,
      lessonXpEarned: 0,
    });
    expect(db.table("userLessonProgress")[0]?.status).toBe("in_progress");
  });

  it("el último paso completa la lección y otorga XP una sola vez", async () => {
    await mark(STEPS[0]!);
    const first = await mark(STEPS[1]!);
    const again = await mark(STEPS[1]!);

    expect(first.lessonJustCompleted).toBe(true);
    expect(first.lessonXpEarned).toBe(LESSON_XP);
    expect(again.allStepsDone).toBe(true);
    expect(again.lessonJustCompleted).toBe(false);
    expect(again.lessonXpEarned).toBe(0);
    expect(db.table("userLessonProgress")).toHaveLength(1);
    expect(db.abortedQueries).toEqual([]);
  });

  it("sin fila previa de progreso: la crea como completed y otorga XP (sin race)", async () => {
    // Camino defensive: todos los pasos hechos pero nunca hubo
    // userLessonProgress. Antes era findUnique + create (read-then-write);
    // ahora es createMany({ skipDuplicates }) → ni P2002 ni transacción
    // abortada si otro request se adelanta.
    db.seed("userStepProgress", [
      { id: "sp_1", userId: USER, stepId: STEPS[0], attempts: 1 },
    ]);

    const res = await mark(STEPS[1]!);

    expect(res.lessonJustCompleted).toBe(true);
    expect(res.lessonXpEarned).toBe(LESSON_XP);
    expect(db.table("userLessonProgress")[0]?.status).toBe("completed");
    expect(db.abortedQueries).toEqual([]);
  });

  it("si la fila ya está completed no vuelve a otorgar XP", async () => {
    db.seed("userStepProgress", [
      { id: "sp_1", userId: USER, stepId: STEPS[0], attempts: 1 },
    ]);
    db.seed("userLessonProgress", [
      {
        id: "lp_1",
        userId: USER,
        lessonId: LESSON,
        status: "completed",
        xpEarned: LESSON_XP,
        completedAt: new Date(),
      },
    ]);

    const res = await mark(STEPS[1]!);

    expect(res.allStepsDone).toBe(true);
    expect(res.lessonJustCompleted).toBe(false);
    expect(res.lessonXpEarned).toBe(0);
    expect(db.table("userLessonProgress")).toHaveLength(1);
    expect(db.abortedQueries).toEqual([]);
  });

  it("llamadas concurrentes al último paso: sólo una completa la lección", async () => {
    await mark(STEPS[0]!);

    const results = await Promise.all([mark(STEPS[1]!), mark(STEPS[1]!), mark(STEPS[1]!)]);

    expect(results.filter((r) => r.lessonJustCompleted)).toHaveLength(1);
    expect(results.reduce((sum, r) => sum + r.lessonXpEarned, 0)).toBe(LESSON_XP);
    expect(db.table("userLessonProgress")).toHaveLength(1);
    expect(db.abortedQueries).toEqual([]);
  });
});
