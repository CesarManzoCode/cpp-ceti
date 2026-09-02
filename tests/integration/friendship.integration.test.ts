import { FriendStatus } from "@prisma/client";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import {
  closeFriendshipPeriod,
  friendshipCreateData,
  openFriendshipPeriod,
} from "@/lib/social/friendship-lifecycle";
import { pairKeyOf } from "@/lib/social/pair";

import { createTestUser, resetSocialTables } from "./helpers";

describe("Friendship — invariantes de Postgres real", () => {
  beforeEach(async () => {
    await resetSocialTables();
  });
  afterAll(async () => {
    await resetSocialTables();
    await db.$disconnect();
  });

  it("pairKey es UNIQUE — dos filas para el mismo par no pueden coexistir", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");

    await db.friendship.create({
      data: { ...friendshipCreateData(a.id, b.id, "profile", null), status: FriendStatus.pending },
    });

    await expect(
      db.friendship.create({
        // Dirección invertida, mismo par canónico → mismo pairKey.
        data: { ...friendshipCreateData(b.id, a.id, "search", null), status: FriendStatus.pending },
      }),
    ).rejects.toThrow(/Unique constraint/i);
  });

  it("a lo más UN FriendshipPeriod abierto por par — abrir dos veces es no-op", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");

    await db.$transaction(async (tx) => {
      await openFriendshipPeriod(tx, a.id, b.id, "profile", null, new Date("2026-01-01T00:00:00Z"));
      // Doble apertura concurrente/retry — el índice único parcial (WHERE
      // endedAt IS NULL) hace que la segunda sea un no-op silencioso.
      await openFriendshipPeriod(tx, a.id, b.id, "search", null, new Date("2026-01-02T00:00:00Z"));
    });

    const periods = await db.friendshipPeriod.findMany({
      where: { userLowId: a.id < b.id ? a.id : b.id, userHighId: a.id < b.id ? b.id : a.id },
    });
    expect(periods).toHaveLength(1);
    expect(periods[0]?.source).toBe("profile"); // gana la primera apertura
  });

  it("dos aperturas CONCURRENTES (transacciones separadas) también producen un solo período", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");

    const open = () =>
      db.$transaction((tx) => openFriendshipPeriod(tx, a.id, b.id, "profile", null));

    // Dos transacciones reales, en paralelo — ejercita el índice único
    // parcial bajo concurrencia genuina, no sólo dentro de una tx.
    await Promise.all([open(), open()]);

    const periods = await db.friendshipPeriod.findMany({
      where: { userLowId: a.id < b.id ? a.id : b.id, userHighId: a.id < b.id ? b.id : a.id, endedAt: null },
    });
    expect(periods).toHaveLength(1);
  });

  it("cerrar y reabrir crea un SEGUNDO período (el primero queda cerrado)", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");

    await db.$transaction(async (tx) => {
      await openFriendshipPeriod(tx, a.id, b.id, "profile", null, new Date("2026-01-01T00:00:00Z"));
      await closeFriendshipPeriod(tx, a.id, b.id, "unfriended", new Date("2026-01-05T00:00:00Z"));
    });
    await db.$transaction(async (tx) => {
      await openFriendshipPeriod(tx, a.id, b.id, "search", null, new Date("2026-02-01T00:00:00Z"));
    });

    const periods = await db.friendshipPeriod.findMany({
      where: { userLowId: a.id < b.id ? a.id : b.id, userHighId: a.id < b.id ? b.id : a.id },
      orderBy: { startedAt: "asc" },
    });
    expect(periods).toHaveLength(2);
    expect(periods[0]?.endedAt).not.toBeNull();
    expect(periods[1]?.endedAt).toBeNull();
  });

  it("pairKeyOf coincide con lo que persiste friendshipCreateData", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    const data = friendshipCreateData(a.id, b.id, "profile", null);
    expect(data.pairKey).toBe(pairKeyOf(a.id, b.id));
    expect(data.pairKey).toBe(pairKeyOf(b.id, a.id));
  });
});
