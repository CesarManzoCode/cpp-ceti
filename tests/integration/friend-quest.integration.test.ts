import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db";
import { canonicalPair } from "@/lib/social/pair";
import {
  FRIEND_QUEST_TARGET,
  refreshFriendQuestProgress,
  runWeeklyFriendQuestMatching,
} from "@/lib/social/friend-quest";
import { mxWeekRange } from "@/lib/social/time";

import { createTestLesson, createTestUser, resetSocialTables } from "./helpers";

async function makeAcceptedFriends(aId: string, bId: string) {
  const { lowId, highId } = canonicalPair(aId, bId);
  await db.friendship.create({
    data: { requesterId: aId, addresseeId: bId, status: "accepted", pairKey: `${lowId}:${highId}`, acceptedAt: new Date() },
  });
}

/** Simula N lecciones completadas por `userId` en un instante dado. */
async function completeLessons(userId: string, count: number, at: Date) {
  for (let i = 0; i < count; i++) {
    const lesson = await createTestLesson();
    await db.userLessonProgress.create({
      data: { userId, lessonId: lesson.id, status: "completed", completedAt: at, startedAt: at },
    });
  }
}

describe("Friend Quest — Postgres real", () => {
  beforeEach(async () => {
    await resetSocialTables();
    await db.friendQuestParticipant.deleteMany({});
    await db.friendQuest.deleteMany({});
  });
  afterAll(async () => {
    await resetSocialTables();
    await db.friendQuestParticipant.deleteMany({});
    await db.friendQuest.deleteMany({});
    await db.$disconnect();
  });

  it("un usuario inactivo (sin actividad reciente) no se empareja", async () => {
    const now = new Date();
    const { start: thisWeekStart } = mxWeekRange(now);
    const prevWeek = mxWeekRange(new Date(thisWeekStart.getTime() - 86_400_000)).start;

    const active = await createTestUser("active");
    const inactive = await createTestUser("inactive");
    await makeAcceptedFriends(active.id, inactive.id);

    // Sólo `active` completó lecciones la semana previa; `inactive` nada.
    await completeLessons(active.id, 3, new Date(prevWeek.getTime() + 86_400_000));

    const created = await runWeeklyFriendQuestMatching(now);
    expect(created).toBe(0);

    const participants = await db.friendQuestParticipant.findMany({});
    expect(participants).toHaveLength(0);
  });

  it("empareja a dos amigos elegibles y respeta 1 quest/usuario/semana", async () => {
    const now = new Date();
    const { start: thisWeekStart } = mxWeekRange(now);
    const prevWeek = mxWeekRange(new Date(thisWeekStart.getTime() - 86_400_000)).start;
    const midPrevWeek = new Date(prevWeek.getTime() + 86_400_000);

    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);
    await completeLessons(a.id, 3, midPrevWeek);
    await completeLessons(b.id, 2, midPrevWeek);

    const created = await runWeeklyFriendQuestMatching(now);
    expect(created).toBe(1);

    const participantsA = await db.friendQuestParticipant.findMany({ where: { userId: a.id } });
    expect(participantsA).toHaveLength(1);

    // Segunda corrida en la MISMA semana: ya están emparejados, no duplica.
    const createdAgain = await runWeeklyFriendQuestMatching(now);
    expect(createdAgain).toBe(0);
    const participantsA2 = await db.friendQuestParticipant.findMany({ where: { userId: a.id } });
    expect(participantsA2).toHaveLength(1);
  });

  it("progreso cuenta lecciones de AMBOS aunque sean de cursos distintos", async () => {
    const now = new Date();
    const { start, end } = mxWeekRange(now);
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);

    const quest = await db.friendQuest.create({
      data: { weekStart: start, startsAt: start, endsAt: end, type: "lessons_completed", target: FRIEND_QUEST_TARGET, status: "active" },
    });
    await db.friendQuestParticipant.createMany({
      data: [
        { questId: quest.id, userId: a.id, weekStart: start },
        { questId: quest.id, userId: b.id, weekStart: start },
      ],
    });

    const mid = new Date(start.getTime() + 3600_000);
    await completeLessons(a.id, 5, mid); // curso A (lecciones nuevas cada vez, cursos distintos por diseño de createTestLesson)
    await completeLessons(b.id, 6, mid); // curso B

    const result = await refreshFriendQuestProgress(quest.id);
    expect(result.progress).toBe(11);
    expect(result.justCompleted).toBe(false);

    await completeLessons(a.id, 1, mid); // 12avo
    const result2 = await refreshFriendQuestProgress(quest.id);
    expect(result2.progress).toBe(12);
    expect(result2.justCompleted).toBe(true);

    const questRow = await db.friendQuest.findUnique({ where: { id: quest.id } });
    expect(questRow?.status).toBe("completed");
  });

  it("al completar, emite friend_quest_completed UNA vez por participante (no duplica en doble refresh)", async () => {
    const now = new Date();
    const { start, end } = mxWeekRange(now);
    const a = await createTestUser("a");
    const b = await createTestUser("b");
    await makeAcceptedFriends(a.id, b.id);

    const quest = await db.friendQuest.create({
      data: { weekStart: start, startsAt: start, endsAt: end, type: "lessons_completed", target: FRIEND_QUEST_TARGET, status: "active" },
    });
    await db.friendQuestParticipant.createMany({
      data: [
        { questId: quest.id, userId: a.id, weekStart: start },
        { questId: quest.id, userId: b.id, weekStart: start },
      ],
    });
    await completeLessons(a.id, 12, new Date(start.getTime() + 3600_000));

    await refreshFriendQuestProgress(quest.id);
    await refreshFriendQuestProgress(quest.id); // doble refresh — no debe duplicar el evento

    const eventsA = await db.socialEvent.findMany({ where: { actorId: a.id, kind: "friend_quest_completed" } });
    const eventsB = await db.socialEvent.findMany({ where: { actorId: b.id, kind: "friend_quest_completed" } });
    expect(eventsA).toHaveLength(1);
    expect(eventsB).toHaveLength(1);
  });
});
