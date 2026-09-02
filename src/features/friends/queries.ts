import { FriendStatus, Prisma } from "@prisma/client";
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
    /** Curso de la lección: el enlace del feed nunca sale de su curso. */
    courseSlug: string;
    unitSlug: string;
    lessonSlug: string;
    xpReward: number;
  };
}

export interface PublicProfileAcademic {
  campusName: string;
  programName: string;
  semester: number | null;
  /**
   * `null` para un no-amigo — visible siempre para self/friend. Campus,
   * carrera y semestre SÍ se muestran a cualquier autenticado; el grupo
   * exacto NUNCA (ver `<privacy>` del contrato).
   */
  group: string | null;
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
  academic: PublicProfileAcademic | null;
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

  // username prefix (case-insensitive) o name contains (case-insensitive).
  // Excluye cuentas OAuth con setup pendiente: sin identidad pública
  // estable, no deben aparecer en discovery/search.
  const candidates = await db.user.findMany({
    where: {
      id: { notIn: Array.from(excludedIds) },
      usernameSetupRequired: false,
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
      usernameSetupRequired: true,
      academicSemester: true,
      academicGroup: true,
      academicOffering: {
        select: { campus: { select: { name: true } }, program: { select: { name: true } } },
      },
      streak: { select: { totalXp: true, currentStreak: true, longestStreak: true } },
    },
  });
  if (!user) return null;
  // Setup de username sin terminar: sin identidad pública estable, no hay
  // perfil social que mostrar a un tercero (self sigue viendo el suyo).
  if (user.usernameSetupRequired && user.id !== viewerId) return null;

  const state = await getFriendshipState(viewerId, user.id);
  // Blocked-by-target: notFound y exclusión total (nunca se revela ni
  // siquiera que el usuario existe) — el bloqueado ve exactamente lo mismo
  // que si el username no existiera. El lado que bloqueó sigue viendo su
  // perfil normal (ver `ProfileActions`, estado `blocked_by_me`).
  if (state === "blocked_by_them") return null;

  const [completedLessons, completedExercises] = await Promise.all([
    db.userLessonProgress.count({
      where: { userId: user.id, status: "completed" },
    }),
    db.userExerciseCompletion.count({ where: { userId: user.id } }),
  ]);

  // Campus/carrera/semestre: visibles para cualquier autenticado. Grupo
  // exacto: SOLO self o amigo accepted — nunca para un no-amigo.
  const showGroup = state === "self" || state === "friends";
  const academic: PublicProfileAcademic | null = user.academicOffering
    ? {
        campusName: user.academicOffering.campus.name,
        programName: user.academicOffering.program.name,
        semester: user.academicSemester,
        group: showGroup ? user.academicGroup : null,
      }
    : null;

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
    academic,
  };
}

const ACTIVITY_SELECT = {
  completedAt: true,
  user: { select: { id: true, username: true, name: true, image: true } },
  lesson: {
    select: {
      title: true,
      slug: true,
      xpReward: true,
      unit: {
        select: {
          title: true,
          slug: true,
          course: { select: { slug: true } },
        },
      },
    },
  },
} satisfies Prisma.UserLessonProgressSelect;

function toActivityEvents(
  rows: Prisma.UserLessonProgressGetPayload<{ select: typeof ACTIVITY_SELECT }>[],
): ActivityEvent[] {
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
          courseSlug: row.lesson.unit.course.slug,
          unitSlug: row.lesson.unit.slug,
          lessonSlug: row.lesson.slug,
          xpReward: row.lesson.xpReward,
        },
      },
    ];
  });
}

/**
 * Actividad propia de UN usuario (`actorId`) — lo que un perfil (el suyo o
 * el de un amigo) tiene que mostrar de sí mismo. NO amigos de `actorId`.
 *
 * Antes de esta separación, el perfil público llamaba a lo que hoy es
 * `getFriendsActivityFeed` pasándole el id del DUEÑO del perfil como si
 * fuera el viewer: eso mostraba "actividad de los amigos de A" en la
 * página de A, en vez de la actividad de A. Ver
 * `tests/features/friends/activity.test.ts`.
 */
export async function getUserLessonActivity(
  actorId: string,
  limit = 30,
): Promise<ActivityEvent[]> {
  const rows = await db.userLessonProgress.findMany({
    where: { userId: actorId, status: "completed", completedAt: { not: null } },
    select: ACTIVITY_SELECT,
    orderBy: { completedAt: "desc" },
    take: limit,
  });
  return toActivityEvents(rows);
}

/**
 * Feed de actividad reciente de los amigos ACEPTADOS de `viewerId` (no
 * incluye la actividad del propio viewer). V1 sólo emite
 * "lesson_completed" — los milestones (Fase 3, `SocialEvent`) tienen su
 * propio feed en `src/features/social-feed`.
 */
export async function getFriendsActivityFeed(
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
    where: { userId: { in: friendIds }, status: "completed", completedAt: { not: null } },
    select: ACTIVITY_SELECT,
    orderBy: { completedAt: "desc" },
    take: limit,
  });
  return toActivityEvents(rows);
}

/**
 * Amigos en común entre `viewerId` y `otherId` — normaliza los edges
 * accepted (direccionales en la tabla) en SQL para no hacer N+1. `preview`
 * trae hasta 3 para la UI ("Juan, Ana y 2 más").
 */
export async function getMutualFriends(
  viewerId: string,
  otherId: string,
): Promise<{ count: number; preview: { id: string; username: string; name: string; image: string | null }[] }> {
  const rows = await db.$queryRaw<
    { id: string; username: string; name: string; image: string | null }[]
  >(Prisma.sql`
    WITH viewer_friends AS (
      SELECT CASE WHEN f."requesterId" = ${viewerId} THEN f."addresseeId" ELSE f."requesterId" END AS friend_id
      FROM friendship f
      WHERE f.status = 'accepted' AND ${viewerId} IN (f."requesterId", f."addresseeId")
    ),
    other_friends AS (
      SELECT CASE WHEN f."requesterId" = ${otherId} THEN f."addresseeId" ELSE f."requesterId" END AS friend_id
      FROM friendship f
      WHERE f.status = 'accepted' AND ${otherId} IN (f."requesterId", f."addresseeId")
    )
    SELECT u.id, u.username, u.name, u.image
    FROM viewer_friends vf
    JOIN other_friends "of" ON "of".friend_id = vf.friend_id
    JOIN "user" u ON u.id = vf.friend_id
    ORDER BY u.username ASC
  `);
  return { count: rows.length, preview: rows.slice(0, 3) };
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
