import { db } from "@/lib/db";
import { pairKeyOf } from "@/lib/social/pair";
import { emitSocialEvent } from "@/lib/social/social-events";
import { mxWeekRange, mxWeekStartDateOnly, shiftDateOnly } from "@/lib/social/time";

export const FRIEND_QUEST_TARGET = 12;
const ACTIVITY_WINDOW_DAYS = 14;

interface Edge {
  a: string;
  b: string;
  diff14d: number;
  repeatedFromLastWeek: boolean;
  pairKey: string;
}

/**
 * Matching semanal de Friend Quests. Idempotente por diseño: sólo
 * considera usuarios SIN participación ya registrada para `weekStart`
 * (`FriendQuestParticipant.userId_weekStart` es UNIQUE), así que correrlo
 * de nuevo en la misma semana sólo empareja a quien quedó suelto.
 */
export async function runWeeklyFriendQuestMatching(now: Date = new Date()): Promise<number> {
  const { start: weekStartInstant, end: weekEndInstant } = mxWeekRange(now);
  const weekStart = mxWeekStartDateOnly(now);
  const prevWeekStartInstant = mxWeekRange(new Date(weekStartInstant.getTime() - 86_400_000)).start;

  const alreadyMatched = await db.friendQuestParticipant.findMany({
    where: { weekStart },
    select: { userId: true },
  });
  const alreadyMatchedIds = new Set(alreadyMatched.map((m) => m.userId));

  // Candidatos: >=1 lección completada la semana PREVIA + >=1 actividad
  // significativa en los últimos 14 días — nunca empareja a alguien
  // inactivo con alguien activo.
  const fourteenDaysAgo = new Date(now.getTime() - ACTIVITY_WINDOW_DAYS * 86_400_000);
  const [recentLessons, recentExercises, recentPractice, lastWeekLessons] = await Promise.all([
    db.userLessonProgress.findMany({
      where: { status: "completed", completedAt: { gte: fourteenDaysAgo, lte: now } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.userExerciseAttempt.findMany({
      where: { createdAt: { gte: fourteenDaysAgo, lte: now } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.userPracticeAttempt.findMany({
      where: { createdAt: { gte: fourteenDaysAgo, lte: now } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.userLessonProgress.groupBy({
      by: ["userId"],
      where: { status: "completed", completedAt: { gte: prevWeekStartInstant, lt: weekStartInstant } },
      _count: { _all: true },
    }),
  ]);

  const activeRecently = new Set([
    ...recentLessons.map((r) => r.userId),
    ...recentExercises.map((r) => r.userId),
    ...recentPractice.map((r) => r.userId),
  ]);
  const lessonsLastWeekByUser = new Map(lastWeekLessons.map((r) => [r.userId, r._count._all]));

  const eligibleIds = new Set(
    [...lessonsLastWeekByUser.keys()].filter(
      (id) => activeRecently.has(id) && !alreadyMatchedIds.has(id),
    ),
  );
  if (eligibleIds.size < 2) return 0;

  // 14d de actividad TOTAL (lecciones, para el criterio de diferencia de
  // ritmo) — reusamos lastWeekLessons como proxy razonable de "ritmo
  // reciente"; ver decisión documentada en el reporte final.
  const activityCount = lessonsLastWeekByUser;

  const lastWeekPairs = await getLastWeekPairs(shiftDateOnly(weekStart, -7));

  const friendships = await db.friendship.findMany({
    where: {
      status: "accepted",
      OR: [
        { requesterId: { in: [...eligibleIds] } },
        { addresseeId: { in: [...eligibleIds] } },
      ],
    },
    select: { requesterId: true, addresseeId: true },
  });

  const edges: Edge[] = [];
  for (const f of friendships) {
    if (!eligibleIds.has(f.requesterId) || !eligibleIds.has(f.addresseeId)) continue;
    const key = pairKeyOf(f.requesterId, f.addresseeId);
    edges.push({
      a: f.requesterId,
      b: f.addresseeId,
      diff14d: Math.abs((activityCount.get(f.requesterId) ?? 0) - (activityCount.get(f.addresseeId) ?? 0)),
      repeatedFromLastWeek: lastWeekPairs.has(key),
      pairKey: key,
    });
  }

  edges.sort((x, y) => {
    if (x.diff14d !== y.diff14d) return x.diff14d - y.diff14d;
    if (x.repeatedFromLastWeek !== y.repeatedFromLastWeek) return x.repeatedFromLastWeek ? 1 : -1;
    return x.pairKey < y.pairKey ? -1 : x.pairKey > y.pairKey ? 1 : 0;
  });

  const taken = new Set<string>();
  let created = 0;
  for (const edge of edges) {
    if (taken.has(edge.a) || taken.has(edge.b)) continue;
    taken.add(edge.a);
    taken.add(edge.b);

    try {
      await db.$transaction(async (tx) => {
        const quest = await tx.friendQuest.create({
          data: {
            weekStart,
            startsAt: weekStartInstant,
            endsAt: weekEndInstant,
            type: "lessons_completed",
            target: FRIEND_QUEST_TARGET,
            status: "active",
          },
        });
        await tx.friendQuestParticipant.createMany({
          data: [
            { questId: quest.id, userId: edge.a, weekStart },
            { questId: quest.id, userId: edge.b, weekStart },
          ],
        });
      });
      created++;
    } catch {
      // UNIQUE(userId, weekStart) chocó — alguien ya se emparejó por otra
      // vía entre la lectura y esta escritura. Se salta, no se reintenta:
      // el siguiente run del job lo recoge si sigue libre.
    }
  }
  return created;
}

async function getLastWeekPairs(lastWeekStart: Date): Promise<Set<string>> {
  const quests = await db.friendQuest.findMany({
    where: { weekStart: lastWeekStart },
    select: { participants: { select: { userId: true } } },
  });
  const pairs = new Set<string>();
  for (const q of quests) {
    if (q.participants.length === 2) {
      pairs.add(pairKeyOf(q.participants[0]!.userId, q.participants[1]!.userId));
    }
  }
  return pairs;
}

/**
 * Progreso actual de una quest: COUNT de lecciones completadas por AMBOS
 * participantes dentro de [startsAt, endsAt). Cursos pueden ser distintos.
 * Transición active→completed es CONDICIONAL (`updateMany` con
 * `status: "active"` en el WHERE) — sólo la llamada que gana emite el
 * `SocialEvent`.
 */
export async function refreshFriendQuestProgress(questId: string): Promise<{ progress: number; justCompleted: boolean }> {
  const quest = await db.friendQuest.findUnique({
    where: { id: questId },
    include: { participants: { select: { userId: true } } },
  });
  if (!quest || quest.status !== "active") {
    return { progress: quest?.status === "completed" ? quest.target : 0, justCompleted: false };
  }

  const progress = await db.userLessonProgress.count({
    where: {
      userId: { in: quest.participants.map((p) => p.userId) },
      status: "completed",
      completedAt: { gte: quest.startsAt, lt: quest.endsAt },
    },
  });

  if (progress < quest.target) return { progress, justCompleted: false };

  const claimed = await db.friendQuest.updateMany({
    where: { id: questId, status: "active" },
    data: { status: "completed", completedAt: new Date() },
  });
  if (claimed.count === 1) {
    for (const p of quest.participants) {
      await db.$transaction(async (tx) => {
        await emitSocialEvent(tx, {
          actorId: p.userId,
          kind: "friend_quest_completed",
          dedupeKey: `friend_quest_completed:${questId}`,
        });
      });
    }
  }
  return { progress, justCompleted: claimed.count === 1 };
}

/** Expira quests activas cuya ventana ya cerró sin llegar al target. */
export async function expireStaleFriendQuests(now: Date = new Date()): Promise<number> {
  const res = await db.friendQuest.updateMany({
    where: { status: "active", endsAt: { lte: now } },
    data: { status: "expired" },
  });
  return res.count;
}
