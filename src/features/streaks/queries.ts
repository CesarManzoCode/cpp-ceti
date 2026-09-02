import { db } from "@/lib/db";
import { refreshFriendStreakDay } from "@/lib/social/friend-streak";
import { mxToday } from "@/lib/social/time";

const userSelect = { select: { id: true, username: true, name: true, image: true } } as const;

export interface FriendStreakCard {
  id: string;
  status: "pending" | "active";
  other: { id: string; username: string; name: string; image: string | null };
  isCreator: boolean;
  currentStreak: number;
  longestStreak: number;
  canRemindToday: boolean;
  /** true si HOY ya calificó para los dos (`lastQualifiedDay` = hoy). */
  qualifiedToday: boolean;
  pendingExpiresAt: Date | null;
}

/**
 * Streaks activos/pendientes del viewer. Para los activos, refresca HOY de
 * forma idempotente (ver `refreshFriendStreakDay`) antes de leer, así que
 * si ambos ya estudiaron hoy el contador refleja eso inmediatamente sin
 * esperar al job diario.
 */
export async function getMyFriendStreaks(viewerId: string): Promise<FriendStreakCard[]> {
  const rows = await db.friendStreak.findMany({
    where: { OR: [{ userLowId: viewerId }, { userHighId: viewerId }], status: { in: ["pending", "active"] } },
    include: { userLow: userSelect, userHigh: userSelect },
  });

  const today = mxToday();
  await Promise.all(
    rows.filter((r) => r.status === "active").map((r) => refreshFriendStreakDay(r.id, today, { breakOnMiss: false })),
  );

  const ids = rows.map((r) => r.id);
  const fresh = ids.length > 0 ? await db.friendStreak.findMany({ where: { id: { in: ids } } }) : [];
  const freshById = new Map(fresh.map((f) => [f.id, f]));

  const todayReminders = await db.streakReminder.findMany({
    where: { streakId: { in: ids }, senderId: viewerId, day: today },
    select: { streakId: true },
  });
  const remindedToday = new Set(todayReminders.map((r) => r.streakId));

  return rows.map((row) => {
    const f = freshById.get(row.id) ?? row;
    const other = row.userLowId === viewerId ? row.userHigh : row.userLow;
    return {
      id: row.id,
      status: f.status as "pending" | "active",
      other,
      isCreator: row.createdById === viewerId,
      currentStreak: f.currentStreak,
      longestStreak: f.longestStreak,
      canRemindToday: f.status === "active" && !remindedToday.has(row.id),
      qualifiedToday: f.lastQualifiedDay?.getTime() === today.getTime(),
      pendingExpiresAt: f.pendingExpiresAt,
    };
  });
}

export interface StreakReminderCard {
  id: string;
  streakId: string;
  sender: { id: string; username: string; name: string; image: string | null };
  createdAt: Date;
  readAt: Date | null;
}

/** Recordatorios recibidos, no leídos primero. */
export async function getMyStreakReminders(viewerId: string, limit = 10): Promise<StreakReminderCard[]> {
  const rows = await db.streakReminder.findMany({
    where: { recipientId: viewerId, expiresAt: { gt: new Date() } },
    include: { sender: userSelect },
    orderBy: [{ readAt: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }],
    take: limit,
  });
  return rows.map((r) => ({
    id: r.id,
    streakId: r.streakId,
    sender: r.sender,
    createdAt: r.createdAt,
    readAt: r.readAt,
  }));
}
