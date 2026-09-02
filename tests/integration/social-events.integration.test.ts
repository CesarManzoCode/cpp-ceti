import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { getSocialFeed } from "@/features/social-feed/queries";
import { db } from "@/lib/db";
import { canonicalPair } from "@/lib/social/pair";
import { emitSocialEvent, maybeEmitStreakMilestone } from "@/lib/social/social-events";

import { createTestUser, resetSocialTables } from "./helpers";

async function makeAcceptedFriends(aId: string, bId: string) {
  const { lowId, highId } = canonicalPair(aId, bId);
  await db.friendship.create({
    data: {
      requesterId: aId,
      addresseeId: bId,
      status: "accepted",
      pairKey: `${lowId}:${highId}`,
      acceptedAt: new Date(),
    },
  });
}

describe("SocialEvent / Kudos — Postgres real", () => {
  beforeEach(async () => {
    await resetSocialTables();
  });
  afterAll(async () => {
    await resetSocialTables();
    await db.$disconnect();
  });

  it("emitSocialEvent es idempotente vía UNIQUE(actorId, dedupeKey)", async () => {
    const user = await createTestUser("u");
    await db.$transaction(async (tx) => {
      const first = await emitSocialEvent(tx, {
        actorId: user.id,
        kind: "streak_milestone",
        dedupeKey: "streak_milestone:7",
        value: 7,
      });
      const second = await emitSocialEvent(tx, {
        actorId: user.id,
        kind: "streak_milestone",
        dedupeKey: "streak_milestone:7",
        value: 7,
      });
      expect(first).toBe(true);
      expect(second).toBe(false);
    });
    const events = await db.socialEvent.findMany({ where: { actorId: user.id } });
    expect(events).toHaveLength(1);
  });

  it("maybeEmitStreakMilestone sólo emite en el conjunto fijo {3,7,14,30,60,100}", async () => {
    const user = await createTestUser("u");
    await db.$transaction(async (tx) => {
      await maybeEmitStreakMilestone(tx, user.id, 5); // no es milestone
      await maybeEmitStreakMilestone(tx, user.id, 7); // sí lo es
    });
    const events = await db.socialEvent.findMany({ where: { actorId: user.id } });
    expect(events).toHaveLength(1);
    expect(events[0]?.value).toBe(7);
  });

  it("el feed de un amigo desaparece INMEDIATAMENTE tras unfriend", async () => {
    const viewer = await createTestUser("v");
    const friend = await createTestUser("f");
    await makeAcceptedFriends(viewer.id, friend.id);

    await db.$transaction(async (tx) => {
      await emitSocialEvent(tx, {
        actorId: friend.id,
        kind: "unit_completed",
        dedupeKey: "unit_completed:u1",
        unitId: null,
        courseId: null,
      });
    });

    const before = await getSocialFeed(viewer.id);
    expect(before.events.some((e) => e.actor.id === friend.id)).toBe(true);

    // Unfriend: borra la fila accepted (igual que `removeFriend`).
    await db.friendship.deleteMany({
      where: { status: "accepted", OR: [{ requesterId: viewer.id, addresseeId: friend.id }, { requesterId: friend.id, addresseeId: viewer.id }] },
    });

    const after = await getSocialFeed(viewer.id);
    expect(after.events.some((e) => e.actor.id === friend.id)).toBe(false);
  });

  it("kudos: doble click produce UNA sola fila (UNIQUE eventId+userId)", async () => {
    const actor = await createTestUser("a");
    const giver = await createTestUser("g");
    await makeAcceptedFriends(actor.id, giver.id);

    const event = await db.socialEvent.create({
      data: { actorId: actor.id, kind: "unit_completed", dedupeKey: "unit_completed:x" },
    });

    await db.kudos.createMany({ data: [{ eventId: event.id, userId: giver.id }], skipDuplicates: true });
    await db.kudos.createMany({ data: [{ eventId: event.id, userId: giver.id }], skipDuplicates: true });

    const rows = await db.kudos.findMany({ where: { eventId: event.id } });
    expect(rows).toHaveLength(1);
  });
});
