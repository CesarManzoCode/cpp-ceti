"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { withActionErrorHandling } from "@/lib/action-error";
import { requireConfirmedUsername } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  acceptFriendStreakRequest,
  cancelOrDeclineFriendStreakRequest,
  createFriendStreakRequest,
} from "@/lib/social/friend-streak";
import { markReminderRead, sendStreakReminder } from "@/lib/social/streak-reminder";
import { cuidSchema, parseOrThrow } from "@/lib/validation";

const byUserIdSchema = z.object({ userId: cuidSchema });
const byStreakIdSchema = z.object({ streakId: cuidSchema });

export const requestFriendStreak = withActionErrorHandling(
  "requestFriendStreak",
  async (input: { userId: string }): Promise<{ id: string }> => {
    const session = await requireConfirmedUsername();
    const { userId } = parseOrThrow(byUserIdSchema, input);
    const result = await createFriendStreakRequest(session.user.id, userId);
    revalidatePath("/app/amigos");
    return result;
  },
);

export const acceptFriendStreak = withActionErrorHandling(
  "acceptFriendStreak",
  async (input: { streakId: string }): Promise<{ ok: true }> => {
    const session = await requireConfirmedUsername();
    const { streakId } = parseOrThrow(byStreakIdSchema, input);
    await acceptFriendStreakRequest(session.user.id, streakId);
    revalidatePath("/app/amigos");
    return { ok: true };
  },
);

export const declineFriendStreak = withActionErrorHandling(
  "declineFriendStreak",
  async (input: { streakId: string }): Promise<{ ok: true }> => {
    const session = await requireConfirmedUsername();
    const { streakId } = parseOrThrow(byStreakIdSchema, input);
    await cancelOrDeclineFriendStreakRequest(session.user.id, streakId);
    revalidatePath("/app/amigos");
    return { ok: true };
  },
);

export const sendFriendStreakReminder = withActionErrorHandling(
  "sendFriendStreakReminder",
  async (input: { streakId: string }): Promise<{ sent: true }> => {
    const session = await requireConfirmedUsername();
    const { streakId } = parseOrThrow(byStreakIdSchema, input);
    await enforceRateLimit(session.user.id, "streak-reminder");
    return sendStreakReminder(session.user.id, streakId);
  },
);

const byReminderIdSchema = z.object({ reminderId: cuidSchema });

export const markStreakReminderRead = withActionErrorHandling(
  "markStreakReminderRead",
  async (input: { reminderId: string }): Promise<{ ok: true }> => {
    const session = await requireConfirmedUsername();
    const { reminderId } = parseOrThrow(byReminderIdSchema, input);
    await markReminderRead(session.user.id, reminderId);
    return { ok: true };
  },
);
