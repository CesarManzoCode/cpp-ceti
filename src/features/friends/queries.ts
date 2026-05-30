import { FriendStatus, type Prisma } from "@prisma/client";
import { cache } from "react";

import { db } from "@/lib/db";

export type FriendshipState =
  | "self"
  | "none"
  | "friends"
  | "pending_outgoing"
  | "pending_incoming"
  | "blocked_by_me"
  | "blocked_by_them";

export interface FriendCard {
  id: string;
  username: string;
  name: string;
  image: string | null;
  totalXp: number;
  currentStreak: number;
  /** Marca de tiempo de la última actividad relevante; null si nunca. */
  lastActiveAt: Date | null;
  friendsSince: Date;
}

export interface PendingRequest {
  /** Id de la fila friendship (necesario para responder/cancelar). */
  friendshipId: string;
  /** El otro usuario (requester si entrante, addressee si saliente). */
  user: {
    id: string;
    username: string;
    name: string;
    image: string | null;
  };
  createdAt: Date;
}

export interface UserSearchResult {
  id: string;
  username: string;
  name: string;
  image: string | null;
  state: FriendshipState;
}

export interface ActivityEvent {
  kind: "lesson_completed";
  at: Date;
  user: {
    id: string;
    username: string;
    name: string;
    image: string | null;
  };
  lesson: {
    title: string;
    unitTitle: string;
    unitSlug: string;
    lessonSlug: string;
    xpReward: number;
  };
}

export interface PublicProfile {
  id: string;
  username: string;
  name: string;
  image: string | null;
  bio: string | null;
  joinedAt: Date;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  completedLessons: number;
  completedExercises: number;
  state: FriendshipState;
}

/**
 * Devuelve todas las amistades aceptadas del usuario en una sola consulta.
 * El UNION lógico (sent + received con status=accepted) se hace en código
 * porque Friendship es direccional pero la relación es simétrica.
 */
export const getFriends = cache(async (userId: string): Promise<FriendCard[]> => {
  const rows = await db.friendship.findMany({
    where: {
      status: FriendStatus.accepted,
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: {
      acceptedAt: true,
      createdAt: true,
      requester: friendUserSelect,
      addressee: friendUserSelect,
      requesterId: true,
    },
    orderBy: { acceptedAt: "desc" },
  });

  return rows.map((row) => {
    const other = row.requesterId === userId ? row.addressee : row.requester;
    return {
      id: other.id,
      username: other.username,
      name: other.name,
      image: other.image,
      totalXp: other.streak?.totalXp ?? 0,
      currentStreak: other.streak?.currentStreak ?? 0,
      lastActiveAt: other.streak?.lastActiveDate ?? null,
      friendsSince: row.acceptedAt ?? row.createdAt,
    };
  });
});

export const getPendingIncoming = cache(
  async (userId: string): Promise<PendingRequest[]> => {
    const rows = await db.friendship.findMany({
      where: { addresseeId: userId, status: FriendStatus.pending },
      select: {
        id: true,
        createdAt: true,
        requester: { select: { id: true, username: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      friendshipId: r.id,
      user: r.requester,
      createdAt: r.createdAt,
    }));
  },
);

export const getPendingOutgoing = cache(
  async (userId: string): Promise<PendingRequest[]> => {
    const rows = await db.friendship.findMany({
      where: { requesterId: userId, status: FriendStatus.pending },
      select: {
        id: true,
        createdAt: true,
        addressee: { select: { id: true, username: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      friendshipId: r.id,
      user: r.addressee,
      createdAt: r.createdAt,
    }));
  },
);

export const getPendingIncomingCount = cache(async (userId: string): Promise<number> => {
  return db.friendship.count({
    where: { addresseeId: userId, status: FriendStatus.pending },
  });
});

/**
 * Estado de la relación entre `viewerId` y `otherId` desde la perspectiva
 * del viewer. Determina qué botón mostrar en el perfil público.
 */
export async function getFriendshipState(
  viewerId: string,
  otherId: string,
): Promise<FriendshipState> {
  if (viewerId === otherId) return "self";

  const rows = await db.friendship.findMany({
    where: {
      OR: [
        { requesterId: viewerId, addresseeId: otherId },
        { requesterId: otherId, addresseeId: viewerId },
      ],
    },
    select: { requesterId: true, addresseeId: true, status: true },
  });

  if (rows.length === 0) return "none";

  for (const row of rows) {
    if (row.status === FriendStatus.accepted) return "friends";
    if (row.status === FriendStatus.blocked) {
      return row.requesterId === viewerId ? "blocked_by_me" : "blocked_by_them";
    }
  }
  // Sólo quedan filas pending
  const out = rows.find((r) => r.requesterId === viewerId);
  if (out) return "pending_outgoing";
  return "pending_incoming";
}

/**
 * Busca usuarios por prefix de username o por substring del nombre.
 * Excluye al viewer, a quienes el viewer bloqueó y a quienes lo bloquearon.
 * Limit pequeño porque la UI muestra resultados inline.
 */
export async function searchUsers(
  viewerId: string,
  rawQuery: string,
  limit = 12,
): Promise<UserSearchResult[]> {
  const q = rawQuery.trim();
  if (q.length === 0) return [];

  const blocked = await db.friendship.findMany({
    where: {
      status: FriendStatus.blocked,
      OR: [{ requesterId: viewerId }, { addresseeId: viewerId }],
    },
    select: { requesterId: true, addresseeId: true },
  });
  const excludedIds = new Set<string>([viewerId]);
  for (const b of blocked) {
    excludedIds.add(b.requesterId);
    excludedIds.add(b.addresseeId);
  }

  // username prefix (case-insensitive) o name contains (case-insensitive)
  const candidates = await db.user.findMany({
    where: {
      id: { notIn: Array.from(excludedIds) },
      OR: [
        { username: { startsWith: q.toLowerCase(), mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, username: true, name: true, image: true },
    take: limit,
    orderBy: [{ username: "asc" }],
  });

  if (candidates.length === 0) return [];

  // Estado de relación en bulk para no hacer N+1.
  const rels = await db.friendship.findMany({
    where: {
      OR: [
        { requesterId: viewerId, addresseeId: { in: candidates.map((c) => c.id) } },
        { addresseeId: viewerId, requesterId: { in: candidates.map((c) => c.id) } },
      ],
    },
    select: { requesterId: true, addresseeId: true, status: true },
  });

  const stateByUser = new Map<string, FriendshipState>();
  for (const r of rels) {
    const otherId = r.requesterId === viewerId ? r.addresseeId : r.requesterId;
    const isOutgoing = r.requesterId === viewerId;
    let state: FriendshipState;
    if (r.status === FriendStatus.accepted) state = "friends";
    else if (r.status === FriendStatus.blocked)
      state = isOutgoing ? "blocked_by_me" : "blocked_by_them";
    else state = isOutgoing ? "pending_outgoing" : "pending_incoming";
    stateByUser.set(otherId, state);
  }

  return candidates.map((c) => ({
    ...c,
    state: stateByUser.get(c.id) ?? "none",
  }));
}

/**
 * Perfil público completo de un usuario por username. Incluye el estado
 * de la relación con `viewerId` para que la UI pueda mostrar el botón
 * correcto sin un round-trip extra.
 */
export async function getPublicProfile(
  username: string,
  viewerId: string,
): Promise<PublicProfile | null> {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      streak: { select: { totalXp: true, currentStreak: true, longestStreak: true } },
    },
  });
  if (!user) return null;

  const [completedLessons, completedExercises, state] = await Promise.all([
    db.userLessonProgress.count({
      where: { userId: user.id, status: "completed" },
    }),
    db.userExerciseCompletion.count({ where: { userId: user.id } }),
    getFriendshipState(viewerId, user.id),
  ]);

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    bio: user.bio,
    joinedAt: user.createdAt,
    totalXp: user.streak?.totalXp ?? 0,
    currentStreak: user.streak?.currentStreak ?? 0,
    longestStreak: user.streak?.longestStreak ?? 0,
    completedLessons,
    completedExercises,
    state,
  };
}

/**
 * Feed de actividad reciente de los amigos del usuario.
 * V1 sólo emite "lesson_completed" — los milestones de level-up/racha
 * requerirían snapshots históricos que aún no almacenamos.
 */
export async function getActivityFeed(
  viewerId: string,
  limit = 30,
): Promise<ActivityEvent[]> {
  const friendIds = (
    await db.friendship.findMany({
      where: {
        status: FriendStatus.accepted,
        OR: [{ requesterId: viewerId }, { addresseeId: viewerId }],
      },
      select: { requesterId: true, addresseeId: true },
    })
  )
    .map((r) => (r.requesterId === viewerId ? r.addresseeId : r.requesterId));

  if (friendIds.length === 0) return [];

  const rows = await db.userLessonProgress.findMany({
    where: {
      userId: { in: friendIds },
      status: "completed",
      completedAt: { not: null },
    },
    select: {
      completedAt: true,
      user: { select: { id: true, username: true, name: true, image: true } },
      lesson: {
        select: {
          title: true,
          slug: true,
          xpReward: true,
          unit: { select: { title: true, slug: true } },
        },
      },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
  });

  return rows.flatMap<ActivityEvent>((row) => {
    if (!row.completedAt) return [];
    return [
      {
        kind: "lesson_completed",
        at: row.completedAt,
        user: row.user,
        lesson: {
          title: row.lesson.title,
          unitTitle: row.lesson.unit.title,
          unitSlug: row.lesson.unit.slug,
          lessonSlug: row.lesson.slug,
          xpReward: row.lesson.xpReward,
        },
      },
    ];
  });
}

const friendUserSelect = {
  select: {
    id: true,
    username: true,
    name: true,
    image: true,
    streak: {
      select: {
        totalXp: true,
        currentStreak: true,
        lastActiveDate: true,
      },
    },
  },
} satisfies Prisma.UserDefaultArgs;
