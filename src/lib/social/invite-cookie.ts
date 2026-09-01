import type { Prisma } from "@prisma/client";

import type { db as prismaDb } from "@/lib/db";
import { logger } from "@/lib/logger";
import { friendshipCreateData } from "@/lib/social/friendship-lifecycle";
import { decodeSignedToken } from "@/lib/social/signed-token";

type Db = Prisma.TransactionClient | typeof prismaDb;

/** Mismo esquema de nombre que `COURSE_COOKIE` (`src/lib/course-selection.ts`). */
export const INVITE_COOKIE_NAME = "cpp-ceti.invite";
export const INVITE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 días

interface InviteCookiePayload {
  inviterId: string;
}

/**
 * Consume la cookie de atribución de invitación para un usuario RECIÉN
 * CREADO (llamado desde `databaseHooks.user.create.after` en `auth.ts` —
 * ese hook sólo dispara en alta nueva, nunca en login, así que "cuenta
 * existente no genera attribution" sale gratis de dónde se llama esto).
 *
 * - Sin cookie, cookie inválida/expirada, o self-invite → no-op.
 * - `InviteAttribution.inviteeId` es UNIQUE: aunque esto se llamara dos
 *   veces (no debería, un `create.after` corre una vez por alta), la
 *   segunda es un no-op vía `skipDuplicates`.
 * - Además crea una solicitud de amistad `source: invite` best-effort —
 *   un fallo ahí NUNCA debe tumbar el registro.
 */
export async function consumeInviteCookieForNewUser(
  db: Db,
  newUserId: string,
  rawCookieValue: string | null | undefined,
): Promise<{ consumed: boolean }> {
  const payload = decodeSignedToken<InviteCookiePayload>(rawCookieValue);
  if (!payload) return { consumed: false };
  if (payload.inviterId === newUserId) return { consumed: false };

  try {
    await db.inviteAttribution.createMany({
      data: [{ inviterId: payload.inviterId, inviteeId: newUserId }],
      skipDuplicates: true,
    });
  } catch (err) {
    logger.error({ err, newUserId }, "invite attribution insert failed");
    return { consumed: false };
  }

  try {
    await db.friendship.createMany({
      data: [
        {
          ...friendshipCreateData(payload.inviterId, newUserId, "invite", null),
          status: "pending",
        },
      ],
      skipDuplicates: true,
    });
  } catch (err) {
    // No debe romper el registro — el usuario ya se creó y la atribución
    // ya se guardó; la solicitud de amistad es un extra.
    logger.error({ err, newUserId }, "invite friend request creation failed");
  }

  return { consumed: true };
}
