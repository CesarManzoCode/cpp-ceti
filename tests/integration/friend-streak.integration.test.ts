import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  acceptFriendStreakRequest,
  createFriendStreakRequest,
  endFriendStreakForPair,
  MAX_ACTIVE_FRIEND_STREAKS,
  refreshFriendStreakDay,
} from "@/lib/social/friend-streak";
import { db } from "@/lib/db";
import { canonicalPair } from "@/lib/social/pair";
import { mxDateOnly, shiftDateOnly } from "@/lib/social/time";

import { createTestLesson, createTestUser, resetSocialTables } from "./helpers";

async function makeAcceptedFriends(aId: string, bId: string) {
  const { lowId, highId } = canonicalPair(aId, bId);
  await db.friendship.create({
    data: { requesterId: aId, addresseeId: bId, status: "accepted", pairKey: `${lowId}:${highId}`, acceptedAt: new Date() },
  });
}

async function activateStreak(aId: string, bId: string): Promise<string> {
  const req = await createFriendStreakRequest(aId, bId);
  await acceptFriendStreakRequest(bId, req.id);
  return req.id;
}

/** Crea un ejercicio real (step + exercise) dentro de la lección dada. */
async function createTestExercise(lessonId: string): Promise<{ id: string }> {
  const step = await db.lessonStep.create({
    data: { lessonId, order: 1, type: "code_challenge", content: {} },
  });
  return db.exercise.create({
    data: { stepId: step.id, prompt: "x", starterCode: "x", solutionCode: "x", hints: [] },
    select: { id: true },
  });
}

/** Marca actividad significativa de `userId` en el día calendario `dateOnly` (mediodía local). */
async function markActivity(userId: string, dateOnly: Date, exerciseId: string) {
  const noon = new Date(dateOnly.getTime() + 12 * 3600 * 1000);
  await db.userExerciseAttempt.create({
    data: { userId, exerciseId, code: "int main(){}", passed: true, createdAt: noon },
  });
}

describe("FriendStreak — Postgres real", () => {
  beforeEach(async () => {
    await resetSocialTables();
  });
  afterAll(async () => {
    await resetSocialTables();
    await db.$disconnect();
  });

  it("máximo 3 rachas activas — la 4ª se rechaza", async () => {
    const a = await createTestUser("a");
    const friends = await Promise.all([createTestUser("f1"), createTestUser("f2"), createTestUser("f3"), createTestUser("f4")]);
    for (const f of friends) await makeAcceptedFriends(a.id, f.id);

    for (let i = 0; i < MAX_ACTIVE_FRIEND_STREAKS; i++) {
      await activateStreak(a.id, friends[i]!.id);
    }

    await expect(createFriendStreakRequest(a.id, friends[3]!.id)).rejects.toThrow(/3 rachas activas/);
  });

  it("unfriend/block cierra el streak en la misma operación — current queda en 0, longest se conserva", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);
    const streakId = await activateStreak(a.id, b.id);

    await db.friendStreak.update({ where: { id: streakId }, data: { currentStreak: 5, longestStreak: 5 } });

    await db.$transaction(async (tx) => {
      await endFriendStreakForPair(tx, a.id, b.id, "unfriended");
    });

    const row = await db.friendStreak.findUnique({ where: { id: streakId } });
    expect(row?.status).toBe("ended");
    expect(row?.currentStreak).toBe(0);
    expect(row?.longestStreak).toBe(5);
  });

  it("reamistad reutiliza el par canónico como pending, conserva longest", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);
    const streakId = await activateStreak(a.id, b.id);
    await db.friendStreak.update({ where: { id: streakId }, data: { currentStreak: 9, longestStreak: 9 } });
    await db.$transaction(async (tx) => endFriendStreakForPair(tx, a.id, b.id, "unfriended"));

    const reReq = await createFriendStreakRequest(a.id, b.id);
    expect(reReq.id).toBe(streakId); // MISMO row canónico

    const row = await db.friendStreak.findUnique({ where: { id: streakId } });
    expect(row?.status).toBe("pending");
    expect(row?.currentStreak).toBe(0);
    expect(row?.longestStreak).toBe(9); // conservado
  });

  it("día calificado consecutivo incrementa; doble refresh el mismo día no suma +2", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);
    const streakId = await activateStreak(a.id, b.id);
    const lesson = await createTestLesson();
    const exercise = await createTestExercise(lesson.id);

    const day1 = mxDateOnly(new Date());
    await markActivity(a.id, day1, exercise.id);
    await markActivity(b.id, day1, exercise.id);

    await refreshFriendStreakDay(streakId, day1, { breakOnMiss: false });
    await refreshFriendStreakDay(streakId, day1, { breakOnMiss: false }); // retry — no debe sumar de nuevo

    const row = await db.friendStreak.findUnique({ where: { id: streakId } });
    expect(row?.currentStreak).toBe(1);

    const days = await db.friendStreakDay.findMany({ where: { streakId } });
    expect(days).toHaveLength(1);
  });

  it("un solo participante activo no califica el día (ambos deben estudiar)", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);
    const streakId = await activateStreak(a.id, b.id);
    const lesson = await createTestLesson();
    const exercise = await createTestExercise(lesson.id);

    const day1 = mxDateOnly(new Date());
    await markActivity(a.id, day1, exercise.id); // sólo A estudia

    await refreshFriendStreakDay(streakId, day1, { breakOnMiss: false });

    const row = await db.friendStreak.findUnique({ where: { id: streakId } });
    expect(row?.currentStreak).toBe(0);
    const days = await db.friendStreakDay.findMany({ where: { streakId } });
    expect(days).toHaveLength(0);
  });

  it("día faltante rompe la racha (breakOnMiss=true, como el job diario)", async () => {
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);
    const streakId = await activateStreak(a.id, b.id);
    const lesson = await createTestLesson();
    const exercise = await createTestExercise(lesson.id);

    const day1 = shiftDateOnly(mxDateOnly(new Date()), -2);
    const day2 = shiftDateOnly(day1, 1); // día perdido — nadie estudia
    await markActivity(a.id, day1, exercise.id);
    await markActivity(b.id, day1, exercise.id);
    await refreshFriendStreakDay(streakId, day1, { breakOnMiss: true });

    let row = await db.friendStreak.findUnique({ where: { id: streakId } });
    expect(row?.currentStreak).toBe(1);

    // día2: nadie estudió, el job (breakOnMiss=true) lo evalúa y rompe.
    await refreshFriendStreakDay(streakId, day2, { breakOnMiss: true });
    row = await db.friendStreak.findUnique({ where: { id: streakId } });
    expect(row?.currentStreak).toBe(0);
  });
});
