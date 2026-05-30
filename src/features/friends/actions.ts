"use server";

import { FriendStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  ActionError,
  isUniqueViolation,
  withActionErrorHandling,
} from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { cuidSchema, parseOrThrow, usernameSchema } from "@/lib/validation";

const sendByUsernameSchema = z.object({ username: usernameSchema });
const byUserIdSchema = z.object({ userId: cuidSchema });
const byFriendshipIdSchema = z.object({ friendshipId: cuidSchema });
const respondSchema = z.object({
  friendshipId: cuidSchema,
  accept: z.boolean(),
});

/**
 * Envía solicitud de amistad por username. Resuelve los race cases:
 *  - self → error
 *  - bloqueado por viewer o viceversa → error genérico (no revelar bloqueo)
 *  - ya somos amigos → noop
 *  - yo ya tengo solicitud pendiente con esta persona → noop
 *  - la otra persona ya me mandó solicitud → AUTO-ACEPTA (crossed-requests)
 */
export const sendFriendRequest = withActionErrorHandling(
  "sendFriendRequest",
  async (input: { username: string }): Promise<{ status: "sent" | "accepted" | "already" }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { username } = parseOrThrow(sendByUsernameSchema, input);

    const target = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!target) throw new ActionError("No encontramos ese usuario");
    if (target.id === me) throw new ActionError("No puedes agregarte a ti mismo");

    return db.$transaction(async (tx) => {
      const existing = await tx.friendship.findMany({
        where: {
          OR: [
            { requesterId: me, addresseeId: target.id },
            { requesterId: target.id, addresseeId: me },
          ],
        },
      });

      const blocked = existing.find((r) => r.status === FriendStatus.blocked);
      if (blocked) throw new ActionError("No podemos enviar esa solicitud");

      const friends = existing.find((r) => r.status === FriendStatus.accepted);
      if (friends) return { status: "already" as const };

      const outgoingPending = existing.find(
        (r) => r.status === FriendStatus.pending && r.requesterId === me,
      );
      if (outgoingPending) return { status: "already" as const };

      const incomingPending = existing.find(
        (r) => r.status === FriendStatus.pending && r.requesterId === target.id,
      );
      if (incomingPending) {
        // Crossed requests → auto-aceptar la entrante.
        await tx.friendship.update({
          where: { id: incomingPending.id },
          data: { status: FriendStatus.accepted, acceptedAt: new Date() },
        });
        logger.info({ me, other: target.id }, "friendship auto-accepted (crossed)");
        return { status: "accepted" as const };
      }

      try {
        await tx.friendship.create({
          data: {
            requesterId: me,
            addresseeId: target.id,
            status: FriendStatus.pending,
          },
        });
      } catch (err) {
        // Race: alguien creó la fila entre el findMany y el create.
        if (isUniqueViolation(err)) return { status: "already" as const };
        throw err;
      }

      logger.info({ me, other: target.id }, "friend request sent");
      return { status: "sent" as const };
    }).then((result) => {
      revalidatePath("/app/amigos");
      revalidatePath(`/app/perfil/${username}`);
      return result;
    });
  },
);

/**
 * Responde una solicitud recibida. Solo el addressee puede llamarla.
 */
export const respondFriendRequest = withActionErrorHandling(
  "respondFriendRequest",
  async (input: { friendshipId: string; accept: boolean }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { friendshipId, accept } = parseOrThrow(respondSchema, input);

    const row = await db.friendship.findUnique({
      where: { id: friendshipId },
      select: { addresseeId: true, status: true },
    });
    if (!row || row.addresseeId !== me) {
      throw new ActionError("Solicitud no encontrada");
    }
    if (row.status !== FriendStatus.pending) {
      throw new ActionError("Esa solicitud ya fue respondida");
    }

    if (accept) {
      await db.friendship.update({
        where: { id: friendshipId },
        data: { status: FriendStatus.accepted, acceptedAt: new Date() },
      });
      logger.info({ me, friendshipId }, "friend request accepted");
    } else {
      await db.friendship.delete({ where: { id: friendshipId } });
      logger.info({ me, friendshipId }, "friend request declined");
    }

    revalidatePath("/app/amigos");
    return { ok: true };
  },
);

/**
 * Cancela una solicitud pendiente que ENVIÉ. Borra la fila para que la
 * otra persona deje de verla en su lista de entrantes.
 */
export const cancelFriendRequest = withActionErrorHandling(
  "cancelFriendRequest",
  async (input: { friendshipId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { friendshipId } = parseOrThrow(byFriendshipIdSchema, input);

    const result = await db.friendship.deleteMany({
      where: {
        id: friendshipId,
        requesterId: me,
        status: FriendStatus.pending,
      },
    });
    if (result.count === 0) {
      throw new ActionError("Solicitud no encontrada");
    }

    logger.info({ me, friendshipId }, "friend request cancelled");
    revalidatePath("/app/amigos");
    return { ok: true };
  },
);

/**
 * Quita a un amigo (sin importar quién fue requester). Borra la fila
 * accepted; sin notificación a la otra parte (es ghost-friendly).
 */
export const removeFriend = withActionErrorHandling(
  "removeFriend",
  async (input: { userId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { userId } = parseOrThrow(byUserIdSchema, input);

    const result = await db.friendship.deleteMany({
      where: {
        status: FriendStatus.accepted,
        OR: [
          { requesterId: me, addresseeId: userId },
          { requesterId: userId, addresseeId: me },
        ],
      },
    });
    if (result.count === 0) {
      throw new ActionError("Esa amistad ya no existe");
    }

    logger.info({ me, other: userId }, "friend removed");
    revalidatePath("/app/amigos");
    revalidatePath("/app/perfil");
    return { ok: true };
  },
);

/**
 * Bloquea a otro usuario. Limpia cualquier amistad/solicitud previa y deja
 * una fila BLOCKED con `me` como requester. Unidireccional: el bloqueado
 * sigue viendo su propio perfil normalmente, sólo no aparece para mí.
 */
export const blockUser = withActionErrorHandling(
  "blockUser",
  async (input: { userId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { userId } = parseOrThrow(byUserIdSchema, input);
    if (userId === me) throw new ActionError("No puedes bloquearte");

    await db.$transaction(async (tx) => {
      await tx.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: me, addresseeId: userId },
            { requesterId: userId, addresseeId: me },
          ],
        },
      });
      await tx.friendship.create({
        data: {
          requesterId: me,
          addresseeId: userId,
          status: FriendStatus.blocked,
        },
      });
    });

    logger.info({ me, other: userId }, "user blocked");
    revalidatePath("/app/amigos");
    revalidatePath("/app/perfil");
    return { ok: true };
  },
);

/**
 * Quita el bloqueo. Después de esto cualquiera puede volver a mandar
 * solicitud (no reactivamos la amistad anterior — habría sido más invasivo).
 */
export const unblockUser = withActionErrorHandling(
  "unblockUser",
  async (input: { userId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { userId } = parseOrThrow(byUserIdSchema, input);

    const result = await db.friendship.deleteMany({
      where: {
        status: FriendStatus.blocked,
        requesterId: me,
        addresseeId: userId,
      },
    });
    if (result.count === 0) {
      throw new ActionError("No tienes a esa persona bloqueada");
    }

    logger.info({ me, other: userId }, "user unblocked");
    revalidatePath("/app/amigos");
    revalidatePath("/app/perfil");
    return { ok: true };
  },
);
