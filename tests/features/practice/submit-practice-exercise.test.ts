import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TestCaseResult } from "@/lib/executor";

import type { FakeDb, Row } from "../../helpers/fake-prisma";

const EXERCISE_ID = "pex_1";
const XP_REWARD = 20;

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
    // El perfil se registra para poder afirmar que se derivó del curso y
    // no de nada que venga en el envío.
    profilesUsed.push(profileId);
    return { runTests, execute: vi.fn(), supportsProfile: () => true };
  },
  buildFeedback: () => "feedback",
}));

import { submitPracticeExercise } from "@/features/practice/actions";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;

function passingResult(passed: boolean): TestCaseResult[] {
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
  return fake.table("userPracticeAttempt");
}
function completions(): Row[] {
  return fake.table("userPracticeCompletion");
}
function totalXp(): number {
  return (fake.table("userStreak")[0]?.totalXp as number) ?? 0;
}

const submit = () =>
  submitPracticeExercise({ exerciseId: EXERCISE_ID, sourceCode: "int main(){}" });

describe("submitPracticeExercise", () => {
  beforeEach(() => {
    fake.reset();
    fake.seed("practiceExercise", [
      {
        id: EXERCISE_ID,
        slug: "suma-dos-numeros",
        published: true,
        xpReward: XP_REWARD,
        courseId: "course_cpp",
        // Relación obligatoria en el schema: `resolveExecutionTarget`
        // rechaza una práctica cuya unidad no esté publicada.
        unit: { published: true },
        course: {
          id: "course_cpp",
          slug: "cpp-desde-cero",
          published: true,
          language: "cpp",
          executionProfile: "cpp17-wandbox",
        },
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
      },
    ]);
    runTests.mockResolvedValue(passingResult(true));
    profilesUsed.length = 0;
  });

  it("el perfil de ejecución se deriva del curso dueño del ejercicio", async () => {
    await submit();
    expect(profilesUsed).toEqual(["cpp17-wandbox"]);
    // El código va en la petición; el compilador NO viene del envío.
    expect(runTests).toHaveBeenCalledWith(
      { profileId: "cpp17-wandbox", sourceCode: "int main(){}" },
      expect.any(Array),
    );
  });

  it("un ejercicio de un curso de C# se compila con el perfil de C#", async () => {
    fake.seed("practiceExercise", [
      {
        id: "pex_cs",
        slug: "suma-dos-numeros",
        published: true,
        xpReward: XP_REWARD,
        courseId: "course_cs",
        // Relación obligatoria en el schema: `resolveExecutionTarget`
        // rechaza una práctica cuya unidad no esté publicada.
        unit: { published: true },
        course: {
          id: "course_cs",
          slug: "csharp-poo-1",
          published: true,
          language: "csharp",
          executionProfile: "csharp-mono-6.12",
        },
        testCases: [
          {
            id: "tc_cs",
            stdin: "1 2",
            expectedStdout: "3",
            visible: true,
            description: null,
            order: 1,
          },
        ],
      },
    ]);
    await submitPracticeExercise({
      exerciseId: "pex_cs",
      sourceCode: "class Program {}",
    });
    expect(profilesUsed).toEqual(["csharp-mono-6.12"]);
  });

  it("primer aprobado: crea la completion, guarda el intento y otorga XP", async () => {
    const result = await submit();

    expect(result.passed).toBe(true);
    expect(result.firstPass).toBe(true);
    expect(result.xpEarned).toBe(XP_REWARD);
    expect(completions()).toHaveLength(1);
    expect(attempts()).toHaveLength(1);
    expect(attempts()[0]?.awardedXp).toBe(true);
    expect(totalXp()).toBe(XP_REWARD);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("segundo aprobado del mismo ejercicio: no revienta con 25P02 y no duplica XP", async () => {
    await submit();
    const second = await submit();

    // Regresión del bug: antes, el create() duplicado abortaba la transacción
    // y el userPracticeAttempt.create siguiente moría con 25P02.
    expect(fake.abortedQueries).toEqual([]);
    expect(second.passed).toBe(true);
    expect(second.firstPass).toBe(false);
    expect(second.xpEarned).toBe(0);

    // El intento SÍ se registra aunque la completion ya existiera.
    expect(attempts()).toHaveLength(2);
    expect(attempts()[1]?.awardedXp).toBe(false);

    // Sin duplicar completion ni XP.
    expect(completions()).toHaveLength(1);
    expect(totalXp()).toBe(XP_REWARD);
  });

  it("intento fallido: guarda el intento, sin completion ni XP", async () => {
    runTests.mockResolvedValue(passingResult(false));

    const result = await submit();

    expect(result.passed).toBe(false);
    expect(result.xpEarned).toBe(0);
    expect(completions()).toHaveLength(0);
    expect(attempts()).toHaveLength(1);
    expect(attempts()[0]?.awardedXp).toBe(false);
    expect(totalXp()).toBe(0);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("falla después de aprobar: se registra el intento sin tocar la completion ni el XP", async () => {
    await submit();
    runTests.mockResolvedValue(passingResult(false));
    const second = await submit();

    expect(second.passed).toBe(false);
    expect(second.xpEarned).toBe(0);
    expect(attempts()).toHaveLength(2);
    expect(completions()).toHaveLength(1);
    expect(totalXp()).toBe(XP_REWARD);
  });

  it("envíos concurrentes: exactamente uno gana el primer aprobado", async () => {
    const results = await Promise.all([submit(), submit(), submit()]);

    expect(results.filter((r) => r.firstPass)).toHaveLength(1);
    expect(results.reduce((sum, r) => sum + r.xpEarned, 0)).toBe(XP_REWARD);
    expect(completions()).toHaveLength(1);
    expect(attempts()).toHaveLength(3);
    expect(attempts().filter((a) => a.awardedXp === true)).toHaveLength(1);
    expect(totalXp()).toBe(XP_REWARD);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("re-aprobar muchas veces sigue siendo idempotente en XP", async () => {
    for (let i = 0; i < 5; i++) await submit();

    expect(completions()).toHaveLength(1);
    expect(attempts()).toHaveLength(5);
    expect(totalXp()).toBe(XP_REWARD);
    expect(fake.abortedQueries).toEqual([]);
  });
});
