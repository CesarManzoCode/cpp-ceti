"use server";

import { FriendStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  ActionError,
  withActionErrorHandling,
} from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { cuidSchema, parseOrThrow } from "@/lib/validation";

const schema = z.object({ userId: cuidSchema });
const respondSchema = z.object({
  userId: cuidSchema,
  accept: z.boolean(),
});

/**
 * Variante de `cancelFriendRequest` que toma el userId de la otra persona en
 * vez del friendshipId. Útil desde el perfil público donde sólo tenemos
 * el id de usuario.
 */
export const cancelOutgoingFriendRequestByUserId = withActionErrorHandling(
  "cancelOutgoingFriendRequestByUserId",
  async (input: { userId: string }): Promise<{ cancelled: boolean }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { userId } = parseOrThrow(schema, input);
    if (userId === me) throw new ActionError("Operación inválida");

    const result = await db.friendship.deleteMany({
      where: {
        requesterId: me,
        addresseeId: userId,
        status: FriendStatus.pending,
      },
    });

    if (result.count > 0) {
      logger.info({ me, other: userId }, "outgoing request cancelled by userId");
      revalidatePath("/app/amigos");
      revalidatePath(`/app/perfil`);
    }
    return { cancelled: result.count > 0 };
  },
);

/**
 * Variante de `respondFriendRequest` que toma el userId del requester
 * (la persona que me mandó la solicitud). Útil desde el perfil público.
 */
export const respondPendingByRequesterId = withActionErrorHandling(
  "respondPendingByRequesterId",
  async (input: { userId: string; accept: boolean }): Promise<{ responded: boolean }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { userId, accept } = parseOrThrow(respondSchema, input);

    const row = await db.friendship.findFirst({
      where: {
        requesterId: userId,
        addresseeId: me,
        status: FriendStatus.pending,
      },
      select: { id: true },
    });
    if (!row) return { responded: false };

    if (accept) {
      await db.friendship.update({
        where: { id: row.id },
        data: { status: FriendStatus.accepted, acceptedAt: new Date() },
      });
      logger.info({ me, requester: userId }, "request accepted by requesterId");
    } else {
      await db.friendship.delete({ where: { id: row.id } });
      logger.info({ me, requester: userId }, "request declined by requesterId");
    }

    revalidatePath("/app/amigos");
    revalidatePath(`/app/perfil`);
    return { responded: true };
  },
);
