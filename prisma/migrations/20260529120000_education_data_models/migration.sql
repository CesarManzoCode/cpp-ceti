-- =====================================================================
-- Sprint 1: modelos pedagógicos + completion atómico + checks de xpReward
-- =====================================================================

-- CreateEnum
CREATE TYPE "BugReportStatus" AS ENUM ('open', 'triaged', 'resolved', 'duplicate', 'wontfix');

-- AlterTable: marca atómica del attempt que generó XP (para auditoría).
ALTER TABLE "user_exercise_attempt"
  ADD COLUMN "awardedXp" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_practice_attempt"
  ADD COLUMN "awardedXp" BOOLEAN NOT NULL DEFAULT false;

-- =====================================================================
-- CreateTable: user_exercise_completion
-- =====================================================================
CREATE TABLE "user_exercise_completion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_exercise_completion_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_exercise_completion_userId_exerciseId_key"
  ON "user_exercise_completion"("userId", "exerciseId");
ALTER TABLE "user_exercise_completion"
  ADD CONSTRAINT "user_exercise_completion_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_exercise_completion"
  ADD CONSTRAINT "user_exercise_completion_exerciseId_fkey"
  FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================================
-- CreateTable: user_practice_completion
-- =====================================================================
CREATE TABLE "user_practice_completion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_practice_completion_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_practice_completion_userId_exerciseId_key"
  ON "user_practice_completion"("userId", "exerciseId");
ALTER TABLE "user_practice_completion"
  ADD CONSTRAINT "user_practice_completion_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_practice_completion"
  ADD CONSTRAINT "user_practice_completion_exerciseId_fkey"
  FOREIGN KEY ("exerciseId") REFERENCES "practice_exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================================
-- Backfill: poblar completion + marcar awardedXp en el attempt más temprano
-- =====================================================================
INSERT INTO "user_exercise_completion" ("id", "userId", "exerciseId", "completedAt")
SELECT
  gen_random_uuid()::text,
  a."userId",
  a."exerciseId",
  MIN(a."createdAt")
FROM "user_exercise_attempt" a
WHERE a."passed" = true
GROUP BY a."userId", a."exerciseId"
ON CONFLICT ("userId", "exerciseId") DO NOTHING;

UPDATE "user_exercise_attempt" a
SET "awardedXp" = true
FROM (
  SELECT DISTINCT ON ("userId", "exerciseId") "id"
  FROM "user_exercise_attempt"
  WHERE "passed" = true
  ORDER BY "userId", "exerciseId", "createdAt" ASC
) earliest
WHERE a."id" = earliest."id";

INSERT INTO "user_practice_completion" ("id", "userId", "exerciseId", "completedAt")
SELECT
  gen_random_uuid()::text,
  a."userId",
  a."exerciseId",
  MIN(a."createdAt")
FROM "user_practice_attempt" a
WHERE a."passed" = true
GROUP BY a."userId", a."exerciseId"
ON CONFLICT ("userId", "exerciseId") DO NOTHING;

UPDATE "user_practice_attempt" a
SET "awardedXp" = true
FROM (
  SELECT DISTINCT ON ("userId", "exerciseId") "id"
  FROM "user_practice_attempt"
  WHERE "passed" = true
  ORDER BY "userId", "exerciseId", "createdAt" ASC
) earliest
WHERE a."id" = earliest."id";

-- =====================================================================
-- CreateTable: study_session
-- =====================================================================
CREATE TABLE "study_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "resourceId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastPingAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_session_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "study_session_userId_startedAt_idx"
  ON "study_session"("userId", "startedAt");
CREATE INDEX "study_session_userId_surface_startedAt_idx"
  ON "study_session"("userId", "surface", "startedAt");
ALTER TABLE "study_session"
  ADD CONSTRAINT "study_session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================================
-- CreateTable: user_hint_viewed
-- =====================================================================
CREATE TABLE "user_hint_viewed" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hintIndex" INTEGER NOT NULL,
    "exerciseId" TEXT,
    "practiceExerciseId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_hint_viewed_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_hint_viewed_userId_exerciseId_hintIndex_key"
  ON "user_hint_viewed"("userId", "exerciseId", "hintIndex");
CREATE UNIQUE INDEX "user_hint_viewed_userId_practiceExerciseId_hintIndex_key"
  ON "user_hint_viewed"("userId", "practiceExerciseId", "hintIndex");
CREATE INDEX "user_hint_viewed_userId_viewedAt_idx"
  ON "user_hint_viewed"("userId", "viewedAt");
ALTER TABLE "user_hint_viewed"
  ADD CONSTRAINT "user_hint_viewed_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_hint_viewed"
  ADD CONSTRAINT "user_hint_viewed_exerciseId_fkey"
  FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_hint_viewed"
  ADD CONSTRAINT "user_hint_viewed_practiceExerciseId_fkey"
  FOREIGN KEY ("practiceExerciseId") REFERENCES "practice_exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_hint_viewed"
  ADD CONSTRAINT "user_hint_viewed_exactly_one_target"
  CHECK (
    (("exerciseId" IS NOT NULL)::int + ("practiceExerciseId" IS NOT NULL)::int) = 1
  );

-- =====================================================================
-- CreateTable: bug_report
-- =====================================================================
CREATE TABLE "bug_report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonStepId" TEXT,
    "exerciseId" TEXT,
    "practiceExerciseId" TEXT,
    "message" TEXT NOT NULL,
    "status" "BugReportStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bug_report_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "bug_report_status_createdAt_idx"
  ON "bug_report"("status", "createdAt");
CREATE INDEX "bug_report_userId_createdAt_idx"
  ON "bug_report"("userId", "createdAt");
ALTER TABLE "bug_report"
  ADD CONSTRAINT "bug_report_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bug_report"
  ADD CONSTRAINT "bug_report_lessonStepId_fkey"
  FOREIGN KEY ("lessonStepId") REFERENCES "lesson_step"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "bug_report"
  ADD CONSTRAINT "bug_report_exerciseId_fkey"
  FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "bug_report"
  ADD CONSTRAINT "bug_report_practiceExerciseId_fkey"
  FOREIGN KEY ("practiceExerciseId") REFERENCES "practice_exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "bug_report"
  ADD CONSTRAINT "bug_report_exactly_one_target"
  CHECK (
    (("lessonStepId" IS NOT NULL)::int
     + ("exerciseId" IS NOT NULL)::int
     + ("practiceExerciseId" IS NOT NULL)::int) = 1
  );

-- =====================================================================
-- CHECK constraints: xpReward > 0 (defensa al límite de la BD).
-- =====================================================================
ALTER TABLE "lesson"
  ADD CONSTRAINT "lesson_xpReward_positive" CHECK ("xpReward" > 0);
ALTER TABLE "exercise"
  ADD CONSTRAINT "exercise_xpReward_positive" CHECK ("xpReward" > 0);
ALTER TABLE "practice_exercise"
  ADD CONSTRAINT "practice_exercise_xpReward_positive" CHECK ("xpReward" > 0);
