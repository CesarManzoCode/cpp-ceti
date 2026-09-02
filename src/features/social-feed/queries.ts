import type { SocialEventKind } from "@prisma/client";

import { db } from "@/lib/db";
import { decodeSignedToken, encodeSignedToken } from "@/lib/social/signed-token";

const FEED_PAGE_SIZE = 20;

export interface FeedEvent {
  id: string;
  actor: { id: string; username: string; name: string; image: string | null };
  kind: SocialEventKind;
  unitTitle: string | null;
  courseTitle: string | null;
  value: number | null;
  occurredAt: Date;
  kudosCount: number;
  kudosByMe: boolean;
}

export interface FeedPage {
  events: FeedEvent[];
  nextCursor: string | null;
}

interface CursorPayload {
  occurredAt: string;
  id: string;
}

/**
 * Feed social — fanout-on-read: self + amigos ACEPTADOS ACTUALES. Como la
 * lista de actores se recalcula en cada lectura, un unfriend/block hace
 * que los eventos de esa persona desaparezcan de inmediato, sin tocar
 * `SocialEvent` (no se borra nada — sólo deja de estar en el conjunto
 * visible).
 */
export async function getSocialFeed(
  viewerId: string,
  opts: { cursor?: string | null } = {},
): Promise<FeedPage> {
  const friendRows = await db.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: viewerId }, { addresseeId: viewerId }],
    },
    select: { requesterId: true, addresseeId: true },
  });
  const actorIds = [
    viewerId,
    ...friendRows.map((r) => (r.requesterId === viewerId ? r.addresseeId : r.requesterId)),
  ];

  let cursor: CursorPayload | null = null;
  if (opts.cursor) {
    cursor = decodeSignedToken<CursorPayload>(opts.cursor);
  }

  const rows = await db.socialEvent.findMany({
    where: {
      actorId: { in: actorIds },
      ...(cursor
        ? {
            OR: [
              { occurredAt: { lt: new Date(cursor.occurredAt) } },
              { occurredAt: new Date(cursor.occurredAt), id: { lt: cursor.id } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      kind: true,
      value: true,
      occurredAt: true,
      actor: { select: { id: true, username: true, name: true, image: true } },
      unit: { select: { title: true } },
      course: { select: { title: true } },
      kudos: { select: { userId: true } },
    },
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
    take: FEED_PAGE_SIZE + 1,
  });

  const hasMore = rows.length > FEED_PAGE_SIZE;
  const page = rows.slice(0, FEED_PAGE_SIZE);

  const events: FeedEvent[] = page.map((row) => ({
    id: row.id,
    actor: row.actor,
    kind: row.kind,
    unitTitle: row.unit?.title ?? null,
    courseTitle: row.course?.title ?? null,
    value: row.value,
    occurredAt: row.occurredAt,
    kudosCount: row.kudos.length,
    kudosByMe: row.kudos.some((k) => k.userId === viewerId),
  }));

  const last = page.at(-1);
  const nextCursor =
    hasMore && last
      ? encodeSignedToken({ occurredAt: last.occurredAt.toISOString(), id: last.id } satisfies CursorPayload)
      : null;

  return { events, nextCursor };
}
