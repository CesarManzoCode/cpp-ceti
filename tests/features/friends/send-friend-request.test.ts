import { FriendStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FakeDb, Row } from "../../helpers/fake-prisma";

const ME = "user_me";
const OTHER = "user_other";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("../../helpers/fake-prisma");
  return { db: createFakeDb() };
});
vi.mock("@/lib/get-session", () => ({
  requireSession: vi.fn(async () => ({ user: { id: "user_me" } })),
}));

import { sendFriendRequest } from "@/features/friends/actions";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

const fake = db as unknown as FakeDb;

function friendships(): Row[] {
  return fake.table("friendship");
}

describe("sendFriendRequest", () => {
  beforeEach(() => {
    vi.spyOn(logger, "info").mockImplementation(() => {});
    fake.reset();
    fake.seed("user", [
      { id: ME, username: "yo" },
      { id: OTHER, username: "otro" },
    ]);
  });

  it("crea la solicitud cuando no hay relación previa", async () => {
    const res = await sendFriendRequest({ username: "otro", source: "profile" });

    expect(res.status).toBe("sent");
    expect(friendships()).toHaveLength(1);
    expect(friendships()[0]?.status).toBe(FriendStatus.pending);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("es idempotente: repetir la solicitud no duplica filas", async () => {
    await sendFriendRequest({ username: "otro", source: "profile" });
    const res = await sendFriendRequest({ username: "otro", source: "profile" });

    expect(res.status).toBe("already");
    expect(friendships()).toHaveLength(1);
    expect(fake.abortedQueries).toEqual([]);
  });

  it("race: si la fila aparece entre la lectura y la escritura, no aborta la transacción", async () => {
    // La lectura devuelve stale (como si otro request insertara justo después)
    // y la escritura choca con el UNIQUE. Con create()+catch(P2002) la
    // transacción de Postgres quedaría abortada; con
    // createMany({ skipDuplicates }) simplemente inserta 0 filas.
    fake.seed("friendship", [
      {
        id: "f_1",
        requesterId: ME,
        addresseeId: OTHER,
        status: FriendStatus.pending,
      },
    ]);
    const api = fake.friendship as Record<string, unknown>;
    api.findMany = vi.fn(async () => []);

    const res = await sendFriendRequest({ username: "otro", source: "profile" });

    expect(res.status).toBe("already");
    expect(friendships()).toHaveLength(1);
    expect(fake.abortedQueries).toEqual([]);
  });
});
