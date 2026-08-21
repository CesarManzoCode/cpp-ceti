import type { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

import {
  claimExerciseCompletion,
  claimPracticeCompletion,
} from "@/lib/completions";

import { createFakeDb, type FakeDb } from "../helpers/fake-prisma";

const USER = "user_1";
const EXERCISE = "ex_1";

describe("claim*Completion", () => {
  let db: FakeDb;

  beforeEach(() => {
    db = createFakeDb();
  });

  const claimExercise = () =>
    db.$transaction((tx) =>
      claimExerciseCompletion(tx as unknown as Prisma.TransactionClient, USER, EXERCISE),
    );
  const claimPractice = () =>
    db.$transaction((tx) =>
      claimPracticeCompletion(tx as unknown as Prisma.TransactionClient, USER, EXERCISE),
    );

  it("claimExerciseCompletion: true la primera vez, false después", async () => {
    expect(await claimExercise()).toBe(true);
    expect(await claimExercise()).toBe(false);
    expect(db.table("userExerciseCompletion")).toHaveLength(1);
    expect(db.abortedQueries).toEqual([]);
  });

  it("claimPracticeCompletion: true la primera vez, false después", async () => {
    expect(await claimPractice()).toBe(true);
    expect(await claimPractice()).toBe(false);
    expect(db.table("userPracticeCompletion")).toHaveLength(1);
    expect(db.abortedQueries).toEqual([]);
  });

  it("la transacción sigue usable después de un reclamo duplicado", async () => {
    await claimPractice();

    const stillWorks = await db.$transaction(async (tx) => {
      const first = await claimPracticeCompletion(
        tx as unknown as Prisma.TransactionClient,
        USER,
        EXERCISE,
      );
      // Si el reclamo hubiera abortado la transacción, esto tiraría 25P02.
      const attempts = tx.userPracticeAttempt as {
        create(args: { data: Record<string, unknown> }): Promise<unknown>;
      };
      await attempts.create({ data: { userId: USER, exerciseId: EXERCISE } });
      return first;
    });

    expect(stillWorks).toBe(false);
    expect(db.table("userPracticeAttempt")).toHaveLength(1);
    expect(db.abortedQueries).toEqual([]);
  });

  it("reclamos concurrentes: sólo uno devuelve true", async () => {
    const claims = await Promise.all([claimPractice(), claimPractice(), claimPractice()]);

    expect(claims.filter(Boolean)).toHaveLength(1);
    expect(db.table("userPracticeCompletion")).toHaveLength(1);
  });

  it("usuarios distintos reclaman de forma independiente", async () => {
    await claimPractice();
    const other = await db.$transaction((tx) =>
      claimPracticeCompletion(
        tx as unknown as Prisma.TransactionClient,
        "user_2",
        EXERCISE,
      ),
    );

    expect(other).toBe(true);
    expect(db.table("userPracticeCompletion")).toHaveLength(2);
  });
});
