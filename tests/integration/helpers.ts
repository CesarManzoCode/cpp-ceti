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

/**
 * Crea un curso/unidad/lección mínimos — sólo para satisfacer el FK y el
 * CHECK de `XpAward` (`reason='lesson_completed'` exige `lessonId`
 * NOT NULL apuntando a una lección real) en tests que necesitan otorgar
 * XP competitivo sintético sin pasar por `completeStep`.
 */
export async function createTestLesson(): Promise<{ id: string }> {
  seq++;
  const suffix = `${Date.now().toString(36)}${seq}`;
  const course = await db.course.create({
    data: {
      slug: `course-${suffix}`,
      title: `Curso ${suffix}`,
      description: "test",
      subjectName: "test",
      academicContext: "test",
      language: "cpp",
      executionProfile: "cpp17-wandbox",
    },
  });
  const unit = await db.unit.create({
    data: { courseId: course.id, slug: `unit-${suffix}`, title: "Unidad", description: "test" },
  });
  const lesson = await db.lesson.create({
    data: { unitId: unit.id, slug: `lesson-${suffix}`, title: "Lección", description: "test" },
  });
  return { id: lesson.id };
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
    db.course.deleteMany({}),
  ]);
}
