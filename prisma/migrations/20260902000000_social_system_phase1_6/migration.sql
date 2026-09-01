-- CreateEnum
CREATE TYPE "FriendRequestSource" AS ENUM ('profile', 'search', 'discovery', 'invite');

-- CreateEnum
CREATE TYPE "FriendshipEndReason" AS ENUM ('unfriended', 'blocked');

-- CreateEnum
CREATE TYPE "SocialEventKind" AS ENUM ('unit_completed', 'course_completed', 'streak_milestone', 'league_promoted', 'friend_quest_completed');

-- CreateEnum
CREATE TYPE "XpReason" AS ENUM ('legacy_balance', 'lesson_completed', 'lesson_exercise_first_pass', 'practice_first_pass');

-- CreateEnum
CREATE TYPE "LeagueTier" AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');

-- CreateEnum
CREATE TYPE "LeagueSeasonStatus" AS ENUM ('open', 'closing', 'closed');

-- CreateEnum
CREATE TYPE "LeagueOutcome" AS ENUM ('promoted', 'relegated', 'stayed', 'held_at_ceiling', 'held_at_floor');

-- CreateEnum
CREATE TYPE "FriendStreakStatus" AS ENUM ('pending', 'active', 'ended');

-- CreateEnum
CREATE TYPE "FriendStreakEndReason" AS ENUM ('unfriended', 'blocked', 'expired');

-- CreateEnum
CREATE TYPE "FriendQuestType" AS ENUM ('lessons_completed');

-- CreateEnum
CREATE TYPE "FriendQuestStatus" AS ENUM ('active', 'completed', 'expired', 'cancelled');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductEventName" ADD VALUE 'discovery_impression';
ALTER TYPE "ProductEventName" ADD VALUE 'discovery_profile_open';
ALTER TYPE "ProductEventName" ADD VALUE 'friends_ranking_view';
ALTER TYPE "ProductEventName" ADD VALUE 'league_view';
ALTER TYPE "ProductEventName" ADD VALUE 'invite_link_copied';

-- AlterEnum
ALTER TYPE "ProductSurface" ADD VALUE 'social';

-- AlterTable
ALTER TABLE "friendship" ADD COLUMN     "pairKey" TEXT,
ADD COLUMN     "requestSource" "FriendRequestSource",
ADD COLUMN     "sourceContextKey" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "academicGroup" VARCHAR(20),
ADD COLUMN     "academicOfferingId" TEXT,
ADD COLUMN     "academicPromptDismissedAt" TIMESTAMP(3),
ADD COLUMN     "academicSemester" INTEGER,
ADD COLUMN     "usernameSetupRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "friendship_period" (
    "id" TEXT NOT NULL,
    "userLowId" TEXT NOT NULL,
    "userHighId" TEXT NOT NULL,
    "source" "FriendRequestSource",
    "sourceContextKey" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "endReason" "FriendshipEndReason",

    CONSTRAINT "friendship_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_attribution" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_attribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_event" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "kind" "SocialEventKind" NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "unitId" TEXT,
    "courseId" TEXT,
    "value" INTEGER,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kudos" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_award" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "XpReason" NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "lessonId" TEXT,
    "exerciseId" TEXT,
    "practiceExerciseId" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league_season" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "LeagueSeasonStatus" NOT NULL DEFAULT 'open',
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "league_season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league_division" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "tier" "LeagueTier" NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "league_division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league_membership" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalXp" INTEGER,
    "finalRank" INTEGER,
    "outcome" "LeagueOutcome",
    "nextTier" "LeagueTier",

    CONSTRAINT "league_membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_streak" (
    "id" TEXT NOT NULL,
    "userLowId" TEXT NOT NULL,
    "userHighId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "status" "FriendStreakStatus" NOT NULL DEFAULT 'pending',
    "pendingExpiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "endReason" "FriendStreakEndReason",
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastQualifiedDay" DATE,
    "lastEvaluatedDay" DATE,

    CONSTRAINT "friend_streak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_streak_day" (
    "id" TEXT NOT NULL,
    "streakId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friend_streak_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streak_reminder" (
    "id" TEXT NOT NULL,
    "streakId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "streak_reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_quest" (
    "id" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "type" "FriendQuestType" NOT NULL,
    "target" INTEGER NOT NULL,
    "status" "FriendQuestStatus" NOT NULL DEFAULT 'active',
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "friend_quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_quest_participant" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,

    CONSTRAINT "friend_quest_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_campus" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "academic_campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_program" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "academic_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_offering" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "semesterCount" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "academic_offering_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friendship_period_userLowId_startedAt_idx" ON "friendship_period"("userLowId", "startedAt");

-- CreateIndex
CREATE INDEX "friendship_period_userHighId_startedAt_idx" ON "friendship_period"("userHighId", "startedAt");

-- CreateIndex
CREATE INDEX "friendship_period_startedAt_idx" ON "friendship_period"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "invite_attribution_inviteeId_key" ON "invite_attribution"("inviteeId");

-- CreateIndex
CREATE INDEX "invite_attribution_inviterId_idx" ON "invite_attribution"("inviterId");

-- CreateIndex
CREATE INDEX "social_event_actorId_occurredAt_id_idx" ON "social_event"("actorId", "occurredAt", "id");

-- CreateIndex
CREATE INDEX "social_event_kind_occurredAt_idx" ON "social_event"("kind", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "social_event_actorId_dedupeKey_key" ON "social_event"("actorId", "dedupeKey");

-- CreateIndex
CREATE UNIQUE INDEX "kudos_eventId_userId_key" ON "kudos"("eventId", "userId");

-- CreateIndex
CREATE INDEX "xp_award_userId_earnedAt_idx" ON "xp_award"("userId", "earnedAt");

-- CreateIndex
CREATE INDEX "xp_award_earnedAt_userId_idx" ON "xp_award"("earnedAt", "userId");

-- CreateIndex
CREATE INDEX "xp_award_reason_earnedAt_idx" ON "xp_award"("reason", "earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "xp_award_userId_dedupeKey_key" ON "xp_award"("userId", "dedupeKey");

-- CreateIndex
CREATE UNIQUE INDEX "league_season_key_key" ON "league_season"("key");

-- CreateIndex
CREATE INDEX "league_season_status_endsAt_idx" ON "league_season"("status", "endsAt");

-- CreateIndex
CREATE INDEX "league_division_seasonId_tier_idx" ON "league_division"("seasonId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "league_division_seasonId_tier_number_key" ON "league_division"("seasonId", "tier", "number");

-- CreateIndex
CREATE INDEX "league_membership_divisionId_userId_idx" ON "league_membership"("divisionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "league_membership_seasonId_userId_key" ON "league_membership"("seasonId", "userId");

-- CreateIndex
CREATE INDEX "friend_streak_userLowId_status_idx" ON "friend_streak"("userLowId", "status");

-- CreateIndex
CREATE INDEX "friend_streak_userHighId_status_idx" ON "friend_streak"("userHighId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "friend_streak_userLowId_userHighId_key" ON "friend_streak"("userLowId", "userHighId");

-- CreateIndex
CREATE UNIQUE INDEX "friend_streak_day_streakId_day_key" ON "friend_streak_day"("streakId", "day");

-- CreateIndex
CREATE INDEX "streak_reminder_recipientId_readAt_createdAt_idx" ON "streak_reminder"("recipientId", "readAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "streak_reminder_streakId_senderId_day_key" ON "streak_reminder"("streakId", "senderId", "day");

-- CreateIndex
CREATE INDEX "friend_quest_weekStart_status_idx" ON "friend_quest"("weekStart", "status");

-- CreateIndex
CREATE UNIQUE INDEX "friend_quest_participant_questId_userId_key" ON "friend_quest_participant"("questId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "friend_quest_participant_userId_weekStart_key" ON "friend_quest_participant"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "academic_campus_code_key" ON "academic_campus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_program_code_key" ON "academic_program"("code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_offering_campusId_programId_key" ON "academic_offering"("campusId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "friendship_pairKey_key" ON "friendship"("pairKey");

-- CreateIndex
CREATE INDEX "user_academicOfferingId_academicSemester_academicGroup_idx" ON "user"("academicOfferingId", "academicSemester", "academicGroup");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_academicOfferingId_fkey" FOREIGN KEY ("academicOfferingId") REFERENCES "academic_offering"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship_period" ADD CONSTRAINT "friendship_period_userLowId_fkey" FOREIGN KEY ("userLowId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship_period" ADD CONSTRAINT "friendship_period_userHighId_fkey" FOREIGN KEY ("userHighId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_attribution" ADD CONSTRAINT "invite_attribution_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_attribution" ADD CONSTRAINT "invite_attribution_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_event" ADD CONSTRAINT "social_event_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_event" ADD CONSTRAINT "social_event_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_event" ADD CONSTRAINT "social_event_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kudos" ADD CONSTRAINT "kudos_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "social_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kudos" ADD CONSTRAINT "kudos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_award" ADD CONSTRAINT "xp_award_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_award" ADD CONSTRAINT "xp_award_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_award" ADD CONSTRAINT "xp_award_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_award" ADD CONSTRAINT "xp_award_practiceExerciseId_fkey" FOREIGN KEY ("practiceExerciseId") REFERENCES "practice_exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_division" ADD CONSTRAINT "league_division_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "league_season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_membership" ADD CONSTRAINT "league_membership_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "league_season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_membership" ADD CONSTRAINT "league_membership_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "league_division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_membership" ADD CONSTRAINT "league_membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_streak" ADD CONSTRAINT "friend_streak_userLowId_fkey" FOREIGN KEY ("userLowId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_streak" ADD CONSTRAINT "friend_streak_userHighId_fkey" FOREIGN KEY ("userHighId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_streak" ADD CONSTRAINT "friend_streak_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_streak_day" ADD CONSTRAINT "friend_streak_day_streakId_fkey" FOREIGN KEY ("streakId") REFERENCES "friend_streak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_reminder" ADD CONSTRAINT "streak_reminder_streakId_fkey" FOREIGN KEY ("streakId") REFERENCES "friend_streak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_reminder" ADD CONSTRAINT "streak_reminder_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_reminder" ADD CONSTRAINT "streak_reminder_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_quest_participant" ADD CONSTRAINT "friend_quest_participant_questId_fkey" FOREIGN KEY ("questId") REFERENCES "friend_quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_quest_participant" ADD CONSTRAINT "friend_quest_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_offering" ADD CONSTRAINT "academic_offering_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "academic_campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_offering" ADD CONSTRAINT "academic_offering_programId_fkey" FOREIGN KEY ("programId") REFERENCES "academic_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- =====================================================================
--  INVARIANTES ADICIONALES (raw SQL — Prisma no las expresa declarativamente)
-- =====================================================================

-- Identidad académica: offering y semester van juntos (ambos null o ambos
-- presentes); group sólo existe con offering+semester; semester en rango
-- amplio (el tope real, semesterCount de la oferta, se valida en el
-- servidor porque un CHECK no puede leer otra tabla).
ALTER TABLE "user"
  ADD CONSTRAINT "user_academic_offering_semester_pair" CHECK (
    ("academicOfferingId" IS NULL AND "academicSemester" IS NULL)
    OR ("academicOfferingId" IS NOT NULL AND "academicSemester" IS NOT NULL)
  ),
  ADD CONSTRAINT "user_academic_group_requires_core" CHECK (
    "academicGroup" IS NULL
    OR ("academicOfferingId" IS NOT NULL AND "academicSemester" IS NOT NULL)
  ),
  ADD CONSTRAINT "user_academic_semester_range" CHECK (
    "academicSemester" IS NULL OR ("academicSemester" BETWEEN 1 AND 12)
  );

-- XpAward: el monto siempre es positivo (el ledger es append-only, nunca
-- resta) y exactamente UN recurso corresponde a cada reason.
ALTER TABLE "xp_award"
  ADD CONSTRAINT "xp_award_amount_positive" CHECK ("amount" > 0),
  ADD CONSTRAINT "xp_award_resource_matches_reason" CHECK (
    ("reason" = 'legacy_balance' AND "lessonId" IS NULL AND "exerciseId" IS NULL AND "practiceExerciseId" IS NULL)
    OR ("reason" = 'lesson_completed' AND "lessonId" IS NOT NULL AND "exerciseId" IS NULL AND "practiceExerciseId" IS NULL)
    OR ("reason" = 'lesson_exercise_first_pass' AND "lessonId" IS NULL AND "exerciseId" IS NOT NULL AND "practiceExerciseId" IS NULL)
    OR ("reason" = 'practice_first_pass' AND "lessonId" IS NULL AND "exerciseId" IS NULL AND "practiceExerciseId" IS NOT NULL)
  );

-- FriendshipPeriod: a lo más UN periodo abierto (endedAt IS NULL) por par
-- canónico. Índice único PARCIAL — Prisma no soporta `WHERE` en `@@index`.
CREATE UNIQUE INDEX "friendship_period_open_pair_key"
  ON "friendship_period" ("userLowId", "userHighId")
  WHERE "endedAt" IS NULL;

-- FriendQuest: la ventana [startsAt, endsAt) de una quest activa nunca está
-- vacía ni invertida.
ALTER TABLE "friend_quest"
  ADD CONSTRAINT "friend_quest_window_valid" CHECK ("endsAt" > "startsAt"),
  ADD CONSTRAINT "friend_quest_target_positive" CHECK ("target" > 0);

-- FriendStreak: los contadores nunca son negativos.
ALTER TABLE "friend_streak"
  ADD CONSTRAINT "friend_streak_counts_nonnegative" CHECK (
    "currentStreak" >= 0 AND "longestStreak" >= 0 AND "currentStreak" <= "longestStreak"
  );

-- LeagueDivision: number es un ordinal positivo dentro del tier.
ALTER TABLE "league_division"
  ADD CONSTRAINT "league_division_number_positive" CHECK ("number" > 0);
