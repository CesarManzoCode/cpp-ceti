import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TestCaseResult } from "@/lib/executor";

import type { FakeDb, Row } from "../../helpers/fake-prisma";

const EXERCISE_ID = "ex_csharp";

const runTests = vi.hoisted(() => vi.fn());
const structureContract = vi.hoisted(() => ({
  current: null as unknown,
}));

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
  getExecutorForProfile: () => ({
    runTests,
    execute: vi.fn(),
    supportsProfile: () => true,
  }),
  buildFeedback: () => "🎉 ¡Pasaste los tests!",
}));
vi.mock("@/features/lessons/lib/access", () => ({
  requireAccessibleExercise: vi.fn(async () => ({
    id: EXERCISE_ID,
    stepId: "step_1",
    xpReward: 15,
    contentRevision: null,
    structureContract: structureContract.current,
    testCases: [
      {
        id: "tc_1",
        stdin: "",
        expectedStdout: "1",
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
        unit: { slug: "objetos", course: { slug: "csharp-poo-1" } },
      },
    },
  })),
  requireAccessibleStep: vi.fn(async () => ({
    id: "step_1",
    lessonId: "lesson_1",
    lesson: {
      id: "lesson_1",
      xpReward: 50,
      steps: [{ id: "step_1" }],
      unit: { slug: "objetos", course: { slug: "csharp-poo-1" } },
    },
  })),
}));
vi.mock("@/lib/execution-target", () => ({
  resolveExecutionTarget: vi.fn(async () => ({
    profileId: "csharp-dotnet",
    language: "csharp",
    courseId: "course_csharp",
    courseSlug: "csharp-poo-1",
    surface: "lesson",
    lessonId: "lesson_1",
    stepId: "step_1",
    exerciseId: EXERCISE_ID,
    practiceExerciseId: null,
    contentRevision: null,
  })),
}));

import {
  completeStep,
  markStepAssisted,
  submitExercise,
} from "@/features/lessons/actions";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;

function passingTests(): TestCaseResult[] {
  return [
    {
      testId: "tc_1",
      passed: true,
      visible: true,
      description: null,
      expectedStdout: "1",
      actualStdout: "1",
      stderr: "",
      status: "accepted",
      durationMs: 3,
    },
  ];
}

function stepProgress(): Row | undefined {
  return fake.table("userStepProgress")[0];
}

const PROCEDURAL = `
  using System;
  class Program { static void Main() { Console.WriteLine(1); } }`;
const CON_CLASE = `
  using System;
  class Contador {
    private int valor;
    public void Incrementar() { valor++; }
  }
  class Program { static void Main() { Console.WriteLine(1); } }`;

describe("LEARN-01 · el contrato estructural decide el pase", () => {
  beforeEach(() => {
    fake.reset();
    runTests.mockReset();
    runTests.mockResolvedValue(passingTests());
    structureContract.current = {
      classes: [
        {
          name: "Contador",
          fields: [{ name: "valor", visibility: "private" }],
          methods: [{ name: "Incrementar" }],
        },
      ],
    };
  });

  it("stdout perfecto dentro de Main NO otorga completion ni XP", async () => {
    const res = await submitExercise({
      exerciseId: EXERCISE_ID,
      sourceCode: PROCEDURAL,
    });

    expect(res.passed).toBe(false);
    expect(res.xpEarned).toBe(0);
    expect(fake.table("userExerciseCompletion")).toHaveLength(0);
    expect(fake.table("userStepProgress")).toHaveLength(0);
  });

  it("el feedback nombra el constructo faltante, no 'salida incorrecta'", async () => {
    const res = await submitExercise({
      exerciseId: EXERCISE_ID,
      sourceCode: PROCEDURAL,
    });

    expect(res.feedback).toContain("La salida es correcta");
    expect(res.structureFailures[0]).toContain("Falta la clase `Contador`");
  });

  it("la solución con la estructura pedida sí pasa y otorga XP", async () => {
    const res = await submitExercise({
      exerciseId: EXERCISE_ID,
      sourceCode: CON_CLASE,
    });

    expect(res.passed).toBe(true);
    expect(res.structureFailures).toEqual([]);
    expect(fake.table("userExerciseCompletion")).toHaveLength(1);
    expect(res.xpEarned).toBeGreaterThan(0);
  });

  it("sin contrato, el reto se sigue evaluando sólo por salida", async () => {
    structureContract.current = null;
    const res = await submitExercise({
      exerciseId: EXERCISE_ID,
      sourceCode: PROCEDURAL,
    });
    expect(res.passed).toBe(true);
  });
});

describe("LEARN-02 · la ayuda revelada queda persistida", () => {
  beforeEach(() => {
    fake.reset();
    runTests.mockReset();
    runTests.mockResolvedValue(passingTests());
    structureContract.current = null;
  });

  it("revelar la ayuda se guarda antes de completar el paso", async () => {
    await markStepAssisted("step_1");

    expect(stepProgress()).toMatchObject({
      assisted: true,
      helpRevealCount: 1,
      // No es un paso completado: revelar no avanza la lección.
      completionCount: 0,
    });
  });

  it("un paso revelado y luego completado queda marcado como asistido", async () => {
    await markStepAssisted("step_1");
    await completeStep("step_1", { assisted: true });

    expect(stepProgress()).toMatchObject({ assisted: true });
    expect(stepProgress()?.completionCount).toBe(1);
  });

  it("resolverlo después sin ayuda lo devuelve a autónomo", async () => {
    await markStepAssisted("step_1");
    await completeStep("step_1", { assisted: true });
    await completeStep("step_1", { assisted: false });

    expect(stepProgress()).toMatchObject({
      assisted: false,
      // El registro de que la ayuda existió no se borra.
      helpRevealCount: 1,
    });
  });

  it("enviar la solución revelada conserva el XP y marca el intento", async () => {
    const res = await submitExercise({
      exerciseId: EXERCISE_ID,
      sourceCode: CON_CLASE,
      assisted: true,
    });

    expect(res.passed).toBe(true);
    expect(res.xpEarned).toBeGreaterThan(0);
    expect(fake.table("userExerciseAttempt")[0]).toMatchObject({
      passed: true,
      assisted: true,
    });
    expect(stepProgress()).toMatchObject({ assisted: true });
  });

  it("un envío normal no marca nada como asistido", async () => {
    await submitExercise({ exerciseId: EXERCISE_ID, sourceCode: CON_CLASE });

    expect(fake.table("userExerciseAttempt")[0]).toMatchObject({
      assisted: false,
    });
    expect(stepProgress()).toMatchObject({ assisted: false });
  });
});
