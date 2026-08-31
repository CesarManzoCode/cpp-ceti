import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TestCaseResult } from "@/lib/executor";

import type { FakeDb, Row } from "../../helpers/fake-prisma";

const USER_ID = "user_1";
const EXERCISE_ID = "ex_1";
const EXERCISE_XP = 15;
const LESSON_XP = 50;

const runTests = vi.hoisted(() => vi.fn());
const profilesUsed = vi.hoisted(() => [] as string[]);

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
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
vi.mock("@/lib/executor", () => ({
  getExecutorForProfile: (profileId: string) => {
    profilesUsed.push(profileId);
    return { runTests, execute: vi.fn(), supportsProfile: () => true };
  },
  buildFeedback: () => "feedback",
}));
// El guard de acceso hace su propia query con includes anidados; para estos
// tests basta devolver el ejercicio ya resuelto.
vi.mock("@/features/lessons/lib/access", () => ({
  requireAccessibleExercise: vi.fn(async () => ({
    id: "ex_1",
    stepId: "step_1",
    xpReward: 15,
    testCases: [
      {
        id: "tc_1",
        stdin: "1 2",
        expectedStdout: "3",
        visible: true,
        description: null,
        order: 1,
      },
    ],
    step: {
      id: "step_1",
      lesson: {
        id: "lesson_1",
        xpReward: 50,
        steps: [{ id: "step_1" }],
        unit: { slug: "unidad-01", course: { slug: "cpp-desde-cero" } },
      },
    },
  })),
  requireAccessibleStep: vi.fn(),
}));

vi.mock("@/lib/execution-target", () => ({
  // El perfil sale del curso del ejercicio guardado; aquí basta con
  // devolverlo ya resuelto.
  resolveExecutionTarget: vi.fn(async () => ({
    profileId: "cpp17-wandbox",
    language: "cpp",
    courseId: "course_cpp",
    courseSlug: "cpp-desde-cero",
    surface: "lesson",
    lessonId: "lesson_1",
    stepId: "step_1",
    exerciseId: "ex_1",
    practiceExerciseId: null,
    contentRevision: null,
  })),
}));

import { submitExercise } from "@/features/lessons/actions";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;

function result(passed: boolean): TestCaseResult[] {
  return [
    {
      testId: "tc_1",
      passed,
      visible: true,
      description: null,
      expectedStdout: "3",
      actualStdout: passed ? "3" : "4",
      stderr: "",
      status: passed ? "accepted" : "wrong_answer",
      durationMs: 5,
    },
  ];
}

function attempts(): Row[] {
  return fake.table("userExerciseAttempt");
}
function completions(): Row[] {
  return fake.table("userExerciseCompletion");
}
function lessonProgress(): Row[] {
  return fake.table("userLessonProgress");
}
function totalXp(): number {
  return (fake.table("userStreak")[0]?.totalXp as number) ?? 0;
}

const submit = () =>
  submitExercise({ exerciseId: EXERCISE_ID, sourceCode: "int main(){}" });

describe("submitExercise", () => {
  beforeEach(() => {
    fake.reset();
    runTests.mockResolvedValue(result(true));
    profilesUsed.length = 0;
  });

  it("el perfil de ejecución se deriva del curso, no del envío", async () => {
    await submit();
    expect(profilesUsed).toEqual(["cpp17-wandbox"]);
    expect(runTests).toHaveBeenCalledWith(
      { profileId: "cpp17-wandbox", sourceCode: "int main(){}" },
      expect.any(Array),
    );
  });

  it("primer aprobado: completion + intento + XP de ejercicio y de lección", async () => {
    const res = await submit();

    expect(res.passed).toBe(true);
    // Único paso de la lección → también completa la lección.
    expect(res.xpEarned).toBe(EXERCISE_XP + LESSON_XP);
    expect(completions()).toHaveLength(1);
    expect(attempts()).toHaveLength(1);
    expect(attempts()[0]?.awardedXp).toBe(true);
    expect(lessonProgress()[0]?.status).toBe("completed");
    expect(totalXp()).toBe(EXERCISE_XP + LESSON_XP);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("segundo aprobado del mismo ejercicio: no revienta con 25P02 y no duplica XP", async () => {
    await submit();
    const second = await submit();

    // Regresión: antes, el create() duplicado abortaba la transacción y el
    // userExerciseAttempt.create / la progresión morían con 25P02.
    expect(fake.abortedQueries).toEqual([]);
    expect(second.passed).toBe(true);
    expect(second.xpEarned).toBe(0);

    // El intento se registra aunque la completion ya existiera.
    expect(attempts()).toHaveLength(2);
    expect(attempts()[1]?.awardedXp).toBe(false);

    expect(completions()).toHaveLength(1);
    expect(lessonProgress()).toHaveLength(1);
    expect(totalXp()).toBe(EXERCISE_XP + LESSON_XP);
  });

  it("intento fallido: sólo guarda el intento", async () => {
    runTests.mockResolvedValue(result(false));

    const res = await submit();

    expect(res.passed).toBe(false);
    expect(res.xpEarned).toBe(0);
    expect(completions()).toHaveLength(0);
    expect(attempts()).toHaveLength(1);
    expect(lessonProgress()).toHaveLength(0);
    expect(totalXp()).toBe(0);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("envíos concurrentes: exactamente uno otorga XP", async () => {
    const results = await Promise.all([submit(), submit(), submit()]);

    expect(results.reduce((sum, r) => sum + r.xpEarned, 0)).toBe(
      EXERCISE_XP + LESSON_XP,
    );
    expect(completions()).toHaveLength(1);
    expect(attempts()).toHaveLength(3);
    expect(attempts().filter((a) => a.awardedXp === true)).toHaveLength(1);
    expect(lessonProgress()).toHaveLength(1);
    expect(totalXp()).toBe(EXERCISE_XP + LESSON_XP);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("re-aprobar varias veces mantiene XP y completions estables", async () => {
    for (let i = 0; i < 4; i++) await submit();

    expect(completions()).toHaveLength(1);
    expect(attempts()).toHaveLength(4);
    expect(totalXp()).toBe(EXERCISE_XP + LESSON_XP);
    expect(
      fake.table("userStepProgress").filter((s) => s.userId === USER_ID),
    ).toHaveLength(1);
    expect(fake.abortedQueries).toEqual([]);
  });
});
