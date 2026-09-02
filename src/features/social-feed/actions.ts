"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { cuidSchema, parseOrThrow } from "@/lib/validation";

const byEventIdSchema = z.object({ eventId: cuidSchema });

/**
 * Verifica que `eventId` sea de un evento ACTUALMENTE visible para
 * `viewerId`: el propio viewer o un amigo accepted VIGENTE (recalculado en
 * cada llamada — igual que el feed, fanout-on-read).
 */
async function requireVisibleEvent(viewerId: string, eventId: string) {
  const event = await db.socialEvent.findUnique({
    where: { id: eventId },
    select: { id: true, actorId: true },
  });
  if (!event) throw new ActionError("Ese hito ya no existe");
  if (event.actorId === viewerId) return event;

  const friendship = await db.friendship.findFirst({
    where: {
      status: "accepted",
      OR: [
        { requesterId: viewerId, addresseeId: event.actorId },
        { requesterId: event.actorId, addresseeId: viewerId },
      ],
    },
    select: { id: true },
  });
  if (!friendship) throw new ActionError("Ese hito ya no está disponible");
  return event;
}

/** Da kudos a un hito. No propio, duplicado es no-op, sólo hitos visibles. */
export const giveKudos = withActionErrorHandling(
  "giveKudos",
  async (input: { eventId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { eventId } = parseOrThrow(byEventIdSchema, input);
    await enforceRateLimit(me, "kudos");

    const event = await requireVisibleEvent(me, eventId);
    if (event.actorId === me) throw new ActionError("No puedes darte kudos a ti mismo");

    await db.kudos.createMany({
      data: [{ eventId, userId: me }],
      skipDuplicates: true,
    });

    revalidatePath("/app");
    return { ok: true };
  },
);

/** Quita MI kudos de un hito (no el de nadie más). */
export const removeKudos = withActionErrorHandling(
  "removeKudos",
  async (input: { eventId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { eventId } = parseOrThrow(byEventIdSchema, input);

    await db.kudos.deleteMany({ where: { eventId, userId: me } });

    revalidatePath("/app");
    return { ok: true };
  },
);
