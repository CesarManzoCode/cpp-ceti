import { beforeEach, describe, expect, it } from "vitest";

import { recordProductEvent } from "@/lib/analytics/record";
import { createFakeDb, type FakeDb } from "../../helpers/fake-prisma";

const db = createFakeDb();
const asPrisma = db as unknown as Parameters<typeof recordProductEvent>[0];

beforeEach(() => {
  (db as FakeDb).reset();
});

const base = {
  userId: "user_1",
  name: "lesson_view" as const,
  surface: "lesson" as const,
  lessonId: "lesson_1",
  studySessionId: "sess_1",
};

describe("recordProductEvent", () => {
  it("inserta una vez y reporta el duplicado como no insertado", async () => {
    const first = await recordProductEvent(asPrisma, {
      ...base,
      dedupeKey: "lesson_view:sess_1",
    });
    const second = await recordProductEvent(asPrisma, {
      ...base,
      dedupeKey: "lesson_view:sess_1",
    });

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect((db as FakeDb).table("productEvent")).toHaveLength(1);
  });

  it("no lanza P2002 en el duplicado (no aborta transacciones)", async () => {
    await recordProductEvent(asPrisma, { ...base, dedupeKey: "k" });
    await expect(
      recordProductEvent(asPrisma, { ...base, dedupeKey: "k" }),
    ).resolves.toBe(false);
    expect((db as FakeDb).abortedQueries).toEqual([]);
  });

  it("el dedupe es por usuario: dos alumnos con la misma clave no chocan", async () => {
    await recordProductEvent(asPrisma, { ...base, dedupeKey: "k" });
    const other = await recordProductEvent(asPrisma, {
      ...base,
      userId: "user_2",
      dedupeKey: "k",
    });
    expect(other).toBe(true);
    expect((db as FakeDb).table("productEvent")).toHaveLength(2);
  });

  it("los eventos sin dedupeKey se pueden repetir (cada run es un run)", async () => {
    const input = {
      userId: "user_1",
      name: "code_run" as const,
      surface: "practice" as const,
      practiceExerciseId: "p1",
      props: { outcome: "compile_error", errorCategory: "missing_semicolon" },
    };
    expect(await recordProductEvent(asPrisma, input)).toBe(true);
    expect(await recordProductEvent(asPrisma, input)).toBe(true);
    expect((db as FakeDb).table("productEvent")).toHaveLength(2);
  });

  it("normaliza los recursos ausentes a null (no undefined)", async () => {
    await recordProductEvent(asPrisma, { ...base, dedupeKey: "k" });
    const row = (db as FakeDb).table("productEvent")[0];
    expect(row.exerciseId).toBeNull();
    expect(row.practiceExerciseId).toBeNull();
    expect(row.props).toEqual({});
  });
});
