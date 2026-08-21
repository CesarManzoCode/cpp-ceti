import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

import { createFakeDb, type FakeDb } from "./fake-prisma";

/**
 * Meta-tests del doble de prueba.
 *
 * Los tests de regresión de las Server Actions sólo valen si este doble
 * REPRODUCE el bug: violar un UNIQUE dentro de una transacción debe dejarla
 * abortada, igual que Postgres. Aquí se verifica exactamente eso.
 */

interface Completions {
  create(args: { data: { userId: string; exerciseId: string } }): Promise<unknown>;
  createMany(args: {
    data: { userId: string; exerciseId: string }[];
    skipDuplicates?: boolean;
  }): Promise<{ count: number }>;
}
interface Attempts {
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
}

const completions = (tx: FakeDb) => tx.userPracticeCompletion as Completions;
const attempts = (tx: FakeDb) => tx.userPracticeAttempt as Attempts;

describe("fake-prisma: semántica de aborto de Postgres", () => {
  let db: FakeDb;

  beforeEach(() => {
    db = createFakeDb();
    db.seed("userPracticeCompletion", [{ id: "c1", userId: "u1", exerciseId: "e1" }]);
  });

  it("create() duplicado lanza P2002", async () => {
    const err = await db
      .$transaction(async (tx) =>
        completions(tx).create({ data: { userId: "u1", exerciseId: "e1" } }),
      )
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    expect((err as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
  });

  it("ATRAPAR el P2002 no salva la transacción: la siguiente query da 25P02", async () => {
    // Este es EXACTAMENTE el antipatrón que rompía producción.
    const err = await db
      .$transaction(async (tx) => {
        try {
          await completions(tx).create({ data: { userId: "u1", exerciseId: "e1" } });
        } catch {
          // "manejado" en JS… pero Postgres ya abortó la transacción.
        }
        return attempts(tx).create({ data: { userId: "u1", exerciseId: "e1" } });
      })
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(Prisma.PrismaClientUnknownRequestError);
    expect((err as Error).message).toContain("25P02");
    expect((err as Error).message).toContain("current transaction is aborted");
    expect(db.abortedQueries).toContain("userPracticeAttempt.create");
  });

  it("createMany({ skipDuplicates }) NO aborta la transacción y devuelve count 0", async () => {
    const result = await db.$transaction(async (tx) => {
      const inserted = await completions(tx).createMany({
        data: [{ userId: "u1", exerciseId: "e1" }],
        skipDuplicates: true,
      });
      await attempts(tx).create({ data: { userId: "u1", exerciseId: "e1" } });
      return inserted.count;
    });

    expect(result).toBe(0);
    expect(db.abortedQueries).toEqual([]);
    expect(db.table("userPracticeAttempt")).toHaveLength(1);
    expect(db.table("userPracticeCompletion")).toHaveLength(1);
  });

  it("createMany({ skipDuplicates }) inserta y devuelve count 1 cuando no hay fila", async () => {
    const count = await db.$transaction(async (tx) => {
      const inserted = await completions(tx).createMany({
        data: [{ userId: "u1", exerciseId: "OTRO" }],
        skipDuplicates: true,
      });
      return inserted.count;
    });

    expect(count).toBe(1);
    expect(db.table("userPracticeCompletion")).toHaveLength(2);
  });

  it("la transacción hace rollback cuando el callback lanza", async () => {
    await expect(
      db.$transaction(async (tx) => {
        await attempts(tx).create({ data: { userId: "u1", exerciseId: "e1" } });
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    expect(db.table("userPracticeAttempt")).toHaveLength(0);
  });
});
