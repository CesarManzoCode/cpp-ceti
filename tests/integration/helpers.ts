import { db } from "@/lib/db";

let seq = 0;

/** Crea un usuario mínimo para tests de integración. Username único por llamada. */
export async function createTestUser(namePrefix = "u"): Promise<{ id: string; username: string }> {
  seq++;
  const suffix = `${Date.now().toString(36)}${seq}`;
  const user = await db.user.create({
    data: {
      email: `${namePrefix}${suffix}@integration.test`,
      name: `${namePrefix}${suffix}`,
      username: `${namePrefix}_${suffix}`.slice(0, 20),
    },
    select: { id: true, username: true },
  });
  return user;
}

/** Borra TODA la data de las tablas sociales — sólo para esta suite, DB de test dedicada. */
export async function resetSocialTables(): Promise<void> {
  await db.$transaction([
    db.kudos.deleteMany({}),
    db.socialEvent.deleteMany({}),
    db.streakReminder.deleteMany({}),
    db.friendStreakDay.deleteMany({}),
    db.friendStreak.deleteMany({}),
    db.friendQuestParticipant.deleteMany({}),
    db.friendQuest.deleteMany({}),
    db.leagueMembership.deleteMany({}),
    db.leagueDivision.deleteMany({}),
    db.leagueSeason.deleteMany({}),
    db.xpAward.deleteMany({}),
    db.inviteAttribution.deleteMany({}),
    db.friendshipPeriod.deleteMany({}),
    db.friendship.deleteMany({}),
    db.userStreak.deleteMany({}),
    db.user.deleteMany({}),
  ]);
}
