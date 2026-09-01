"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import { withActionErrorHandling } from "@/lib/action-error";
import { db } from "@/lib/db";
import { env } from "@/env";
import { getSession } from "@/lib/get-session";
import { INVITE_COOKIE_MAX_AGE_SEC, INVITE_COOKIE_NAME } from "@/lib/social/invite-cookie";
import { encodeSignedToken } from "@/lib/social/signed-token";
import { parseOrThrow, usernameSchema } from "@/lib/validation";

const schema = z.object({ inviterUsername: usernameSchema });

/**
 * Captura FIRST-TOUCH la atribución de invitación: se llama desde
 * `/invitar/[username]` cuando NO hay sesión. Idempotente y silenciosa —
 * nunca sobreescribe una cookie ya presente (first-touch), nunca falla
 * visiblemente para el visitante.
 */
export const captureInviteAttribution = withActionErrorHandling(
  "captureInviteAttribution",
  async (input: { inviterUsername: string }): Promise<{ captured: boolean }> => {
    const session = await getSession();
    if (session?.user) return { captured: false };

    const store = await cookies();
    if (store.get(INVITE_COOKIE_NAME)?.value) return { captured: false };

    const { inviterUsername } = parseOrThrow(schema, input);
    const inviter = await db.user.findUnique({
      where: { username: inviterUsername },
      select: { id: true, usernameSetupRequired: true },
    });
    if (!inviter || inviter.usernameSetupRequired) return { captured: false };

    const token = encodeSignedToken(
      { inviterId: inviter.id },
      INVITE_COOKIE_MAX_AGE_SEC * 1000,
    );
    store.set(INVITE_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: INVITE_COOKIE_MAX_AGE_SEC,
    });
    return { captured: true };
  },
);
