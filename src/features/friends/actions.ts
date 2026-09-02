"use server";

import { FriendStatus, type FriendRequestSource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";
import { logger } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  closeFriendshipPeriod,
  friendshipCreateData,
  openFriendshipPeriod,
} from "@/lib/social/friendship-lifecycle";
import { decodeSignedToken } from "@/lib/social/signed-token";
import { endFriendStreakForPair } from "@/lib/social/friend-streak";
import { cuidSchema, parseOrThrow, usernameSchema } from "@/lib/validation";

/** Máximo de solicitudes salientes pendientes al mismo tiempo. */
const MAX_PENDING_OUTGOING = 50;

interface DiscoveryTokenPayload {
  viewerId: string;
  candidateId: string;
  bucket: string;
}

const friendRequestSourceSchema = z.enum(["profile", "search", "discovery", "invite"]);

const sendByUsernameSchema = z.object({
  username: usernameSchema,
  source: friendRequestSourceSchema,
  /** Sólo cuando `source === "discovery"` — token firmado del resultado. */
  discoveryToken: z.string().optional(),
});
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
 *
 * `source` lo elige el COMPONENTE que llama (cada superficie pasa su propio
 * literal fijo) — el cliente nunca manda una cadena libre. Para
 * `source: "discovery"`, `discoveryToken` es el token firmado que
 * `getDiscoveryCandidates` emitió para ESE candidato: sin uno válido que
 * corresponda a (viewer, target), la solicitud se rechaza.
 */
export const sendFriendRequest = withActionErrorHandling(
  "sendFriendRequest",
  async (input: {
    username: string;
    source: FriendRequestSource;
    discoveryToken?: string;
  }): Promise<{ status: "sent" | "accepted" | "already" }> => {
    const session = await requireSession();
    const me = session.user.id;
    if (session.user.usernameSetupRequired) {
      throw new ActionError("Confirma tu nombre de usuario antes de agregar amigos");
    }
    const { username, source, discoveryToken } = parseOrThrow(sendByUsernameSchema, input);
    await enforceRateLimit(me, "friend-request");

    const target = await db.user.findUnique({
      where: { username },
      select: { id: true, usernameSetupRequired: true },
    });
    if (!target || target.usernameSetupRequired) {
      throw new ActionError("No encontramos ese usuario");
    }
    if (target.id === me) throw new ActionError("No puedes agregarte a ti mismo");

    let sourceContextKey: string | null = null;
    if (source === "discovery") {
      const payload = decodeSignedToken<DiscoveryTokenPayload>(discoveryToken);
      if (!payload || payload.viewerId !== me || payload.candidateId !== target.id) {
        throw new ActionError("Ese resultado ya no es válido. Actualiza la página.");
      }
      sourceContextKey = payload.bucket;
    }

    const pendingOutgoing = await db.friendship.count({
      where: { requesterId: me, status: FriendStatus.pending },
    });
    if (pendingOutgoing >= MAX_PENDING_OUTGOING) {
      throw new ActionError("Tienes demasiadas solicitudes pendientes. Espera a que respondan.");
    }

    return db
      .$transaction(async (tx) => {
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
          // Crossed requests → auto-aceptar la entrante. El período usa el
          // source/contexto de la solicitud ORIGINAL (la que ya existía).
          const acceptedAt = new Date();
          await tx.friendship.update({
            where: { id: incomingPending.id },
            data: { status: FriendStatus.accepted, acceptedAt },
          });
          await openFriendshipPeriod(
            tx,
            me,
            target.id,
            incomingPending.requestSource,
            incomingPending.sourceContextKey,
            acceptedAt,
          );
          logger.info({ me, other: target.id }, "friendship auto-accepted (crossed)");
          return { status: "accepted" as const };
        }

        // `createMany({ skipDuplicates })` = INSERT ... ON CONFLICT DO NOTHING:
        // resuelve la race (alguien creó la fila entre el findMany y esto) sin
        // lanzar P2002, que dejaría la transacción de Postgres abortada.
        const inserted = await tx.friendship.createMany({
          data: [
            {
              ...friendshipCreateData(me, target.id, source, sourceContextKey),
              status: FriendStatus.pending,
            },
          ],
          skipDuplicates: true,
        });
        if (inserted.count === 0) return { status: "already" as const };

        logger.info({ me, other: target.id, source }, "friend request sent");
        return { status: "sent" as const };
      })
      .then((result) => {
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
      select: {
        addresseeId: true,
        requesterId: true,
        status: true,
        requestSource: true,
        sourceContextKey: true,
      },
    });
    if (!row || row.addresseeId !== me) {
      throw new ActionError("Solicitud no encontrada");
    }
    if (row.status !== FriendStatus.pending) {
      throw new ActionError("Esa solicitud ya fue respondida");
    }

    if (accept) {
      const acceptedAt = new Date();
      await db.$transaction(async (tx) => {
        await tx.friendship.update({
          where: { id: friendshipId },
          data: { status: FriendStatus.accepted, acceptedAt },
        });
        await openFriendshipPeriod(
          tx,
          row.requesterId,
          me,
          row.requestSource,
          row.sourceContextKey,
          acceptedAt,
        );
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
 * accepted; sin notificación a la otra parte (es ghost-friendly). Cierra el
 * período de amistad y cualquier Friend Streak activo en la MISMA operación.
 */
export const removeFriend = withActionErrorHandling(
  "removeFriend",
  async (input: { userId: string }): Promise<{ ok: true }> => {
    const session = await requireSession();
    const me = session.user.id;
    const { userId } = parseOrThrow(byUserIdSchema, input);

    await db.$transaction(async (tx) => {
      const result = await tx.friendship.deleteMany({
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
      await closeFriendshipPeriod(tx, me, userId, "unfriended");
      await endFriendStreakForPair(tx, me, userId, "unfriended");
    });

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
          ...friendshipCreateData(me, userId, null, null),
          status: FriendStatus.blocked,
        },
      });
      await closeFriendshipPeriod(tx, me, userId, "blocked");
      await endFriendStreakForPair(tx, me, userId, "blocked");
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
