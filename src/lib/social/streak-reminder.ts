import { ActionError } from "@/lib/action-error";
import { db } from "@/lib/db";
import { hadSignificantActivity } from "@/lib/social/friend-streak";
import { mxDateOnly, mxDayRangeForDateOnly } from "@/lib/social/time";

/** Máximo global de recordatorios que un usuario puede MANDAR en un día. */
const MAX_REMINDERS_PER_SENDER_PER_DAY = 3;
const REMINDER_TTL_MS = 48 * 60 * 60 * 1000;

/**
 * Manda un recordatorio de Friend Streak. Elegibilidad estricta:
 *   - streak activo, sender es participant
 *   - sender YA estudió hoy, recipient NO
 *   - <=1 por (streak, sender, día) — UNIQUE
 *   - <=3 recordatorios TOTALES por sender por día
 */
export async function sendStreakReminder(
  senderId: string,
  streakId: string,
): Promise<{ sent: true }> {
  const streak = await db.friendStreak.findUnique({ where: { id: streakId } });
  if (!streak || streak.status !== "active") throw new ActionError("Esa racha ya no está activa");
  if (senderId !== streak.userLowId && senderId !== streak.userHighId) {
    throw new ActionError("No autorizado");
  }
  const recipientId = senderId === streak.userLowId ? streak.userHighId : streak.userLowId;

  const today = mxDateOnly(new Date());
  const { start, end } = mxDayRangeForDateOnly(today);
  const [senderStudied, recipientStudied] = await Promise.all([
    hadSignificantActivity(db, senderId, start, end),
    hadSignificantActivity(db, recipientId, start, end),
  ]);
  if (!senderStudied) throw new ActionError("Estudia hoy antes de mandar el recordatorio");
  if (recipientStudied) throw new ActionError("Tu amigo ya estudió hoy");

  const sentToday = await db.streakReminder.count({ where: { senderId, day: today } });
  if (sentToday >= MAX_REMINDERS_PER_SENDER_PER_DAY) {
    throw new ActionError("Ya mandaste el máximo de recordatorios de hoy");
  }

  const inserted = await db.streakReminder.createMany({
    data: [
      {
        streakId,
        senderId,
        recipientId,
        day: today,
        expiresAt: new Date(Date.now() + REMINDER_TTL_MS),
      },
    ],
    skipDuplicates: true,
  });
  if (inserted.count === 0) {
    throw new ActionError("Ya le mandaste un recordatorio de esta racha hoy");
  }
  return { sent: true };
}

/** Marca un recordatorio como leído — sólo el recipient puede hacerlo. */
export async function markReminderRead(recipientId: string, reminderId: string): Promise<void> {
  await db.streakReminder.updateMany({
    where: { id: reminderId, recipientId, readAt: null },
    data: { readAt: new Date() },
  });
}
