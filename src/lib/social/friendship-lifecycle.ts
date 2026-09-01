import type { FriendRequestSource, FriendshipEndReason, Prisma } from "@prisma/client";

import { canonicalPair, pairKeyOf } from "./pair";

/** Datos comunes de una fila `Friendship` nueva — SIEMPRE trae `pairKey`. */
export function friendshipCreateData(
  requesterId: string,
  addresseeId: string,
  source: FriendRequestSource | null,
  sourceContextKey: string | null,
): {
  requesterId: string;
  addresseeId: string;
  pairKey: string;
  requestSource: FriendRequestSource | null;
  sourceContextKey: string | null;
} {
  return {
    requesterId,
    addresseeId,
    pairKey: pairKeyOf(requesterId, addresseeId),
    requestSource: source,
    sourceContextKey,
  };
}

/**
 * Abre un período de amistad para el par. Idempotente: la unique parcial
 * `friendship_period_open_pair_key` (`WHERE "endedAt" IS NULL`) hace que
 * `skipDuplicates` no duplique un período ya abierto para este par.
 */
export async function openFriendshipPeriod(
  tx: Prisma.TransactionClient,
  userA: string,
  userB: string,
  source: FriendRequestSource | null,
  sourceContextKey: string | null,
  startedAt: Date = new Date(),
): Promise<void> {
  const { lowId, highId } = canonicalPair(userA, userB);
  await tx.friendshipPeriod.createMany({
    data: [
      {
        userLowId: lowId,
        userHighId: highId,
        source,
        sourceContextKey,
        startedAt,
        endedAt: null,
      },
    ],
    skipDuplicates: true,
  });
}

/** Cierra el período abierto del par (si lo hay) — no-op si ya estaba cerrado. */
export async function closeFriendshipPeriod(
  tx: Prisma.TransactionClient,
  userA: string,
  userB: string,
  endReason: FriendshipEndReason,
  endedAt: Date = new Date(),
): Promise<void> {
  const { lowId, highId } = canonicalPair(userA, userB);
  await tx.friendshipPeriod.updateMany({
    where: { userLowId: lowId, userHighId: highId, endedAt: null },
    data: { endedAt, endReason },
  });
}
