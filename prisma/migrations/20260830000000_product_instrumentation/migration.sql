-- =====================================================================
-- PRODUCT INSTRUMENTATION + PRODUCT FEEDBACK
-- =====================================================================
--  Aditiva y segura: no borra ni reescribe datos existentes.
--  Los dos únicos cambios "destructivos" son renombres que PRESERVAN
--  los datos (RENAME COLUMN / RENAME TYPE).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Estado compartido de reportes (bug reports + feedback general).
--    RENAME preserva valores y filas existentes.
-- ---------------------------------------------------------------------
ALTER TYPE "BugReportStatus" RENAME TO "ReportStatus";

-- ---------------------------------------------------------------------
-- 2) Rol de producto. La autorización de /app/admin se resuelve leyendo
--    esta columna en el servidor.
-- ---------------------------------------------------------------------
CREATE TYPE "UserRole" AS ENUM ('student', 'admin');

ALTER TABLE "user"
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'student';

-- ---------------------------------------------------------------------
-- 3) UserStepProgress.attempts → completionCount
--    El campo NUNCA significó "intentos del estudiante": lo incrementa
--    cada llamada a completeStep. Renombrarlo preserva los datos y quita
--    la métrica pedagógica falsa.
-- ---------------------------------------------------------------------
ALTER TABLE "user_step_progress"
  RENAME COLUMN "attempts" TO "completionCount";

-- ---------------------------------------------------------------------
-- 4) StudySession — lifecycle real
-- ---------------------------------------------------------------------
CREATE TYPE "StudySessionEndReason" AS ENUM ('closed', 'expired');

ALTER TABLE "study_session"
  ADD COLUMN "clientKey"   TEXT,
  ADD COLUMN "endedReason" "StudySessionEndReason",
  ADD COLUMN "engagedMs"   INTEGER NOT NULL DEFAULT 0;

-- Idempotencia del arranque: un montaje del reproductor = una sesión,
-- aunque React StrictMode invoque el efecto dos veces o la red reintente.
CREATE UNIQUE INDEX "study_session_userId_clientKey_key"
  ON "study_session"("userId", "clientKey");

CREATE INDEX "study_session_surface_startedAt_idx"
  ON "study_session"("surface", "startedAt");

-- Barrido de sesiones huérfanas.
CREATE INDEX "study_session_lastPingAt_idx"
  ON "study_session"("lastPingAt");

-- Defensa a nivel BD: el tiempo activo nunca es negativo, y no puede
-- exceder el tiempo de pared transcurrido desde el inicio (+1 min de
-- holgura por el crédito del último heartbeat).
ALTER TABLE "study_session"
  ADD CONSTRAINT "study_session_engagedMs_nonnegative" CHECK ("engagedMs" >= 0);

ALTER TABLE "study_session"
  ADD CONSTRAINT "study_session_ended_after_started"
  CHECK ("endedAt" IS NULL OR "endedAt" >= "startedAt");

-- ---------------------------------------------------------------------
-- 5) Pistas — enlace con la sesión de estudio y la revisión de contenido
-- ---------------------------------------------------------------------
ALTER TABLE "user_hint_viewed"
  ADD COLUMN "studySessionId"  TEXT,
  ADD COLUMN "contentRevision" TEXT;

ALTER TABLE "user_hint_viewed"
  ADD CONSTRAINT "user_hint_viewed_studySessionId_fkey"
  FOREIGN KEY ("studySessionId") REFERENCES "study_session"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------
-- 6) Revisiones de contenido
-- ---------------------------------------------------------------------
ALTER TABLE "lesson"
  ADD COLUMN "contentRevision"   TEXT,
  ADD COLUMN "contentRevisionAt" TIMESTAMP(3);

ALTER TABLE "lesson_step"
  ADD COLUMN "contentRevision"   TEXT,
  ADD COLUMN "contentRevisionAt" TIMESTAMP(3);

ALTER TABLE "exercise"
  ADD COLUMN "contentRevision"   TEXT,
  ADD COLUMN "contentRevisionAt" TIMESTAMP(3);

ALTER TABLE "practice_exercise"
  ADD COLUMN "contentRevision"   TEXT,
  ADD COLUMN "contentRevisionAt" TIMESTAMP(3);

ALTER TABLE "user_exercise_attempt"
  ADD COLUMN "contentRevision" TEXT;

ALTER TABLE "user_practice_attempt"
  ADD COLUMN "contentRevision" TEXT;

CREATE TYPE "ContentTargetType" AS ENUM ('lesson', 'lesson_step', 'exercise', 'practice_exercise');

CREATE TABLE "content_revision" (
  "id"          TEXT NOT NULL,
  "targetType"  "ContentTargetType" NOT NULL,
  "targetId"    TEXT NOT NULL,
  "revision"    TEXT NOT NULL,
  "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "content_revision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "content_revision_targetType_targetId_revision_key"
  ON "content_revision"("targetType", "targetId", "revision");

CREATE INDEX "content_revision_targetType_targetId_firstSeenAt_idx"
  ON "content_revision"("targetType", "targetId", "firstSeenAt");

-- ---------------------------------------------------------------------
-- 7) Workflow de bug reports (triage + evidencia del cierre)
-- ---------------------------------------------------------------------
ALTER TABLE "bug_report"
  ADD COLUMN "resolutionNote" TEXT,
  ADD COLUMN "issueUrl"       TEXT,
  ADD COLUMN "prUrl"          TEXT,
  ADD COLUMN "triagedAt"      TIMESTAMP(3),
  ADD COLUMN "resolvedAt"     TIMESTAMP(3),
  ADD COLUMN "handledById"    TEXT;

ALTER TABLE "bug_report"
  ADD CONSTRAINT "bug_report_handledById_fkey"
  FOREIGN KEY ("handledById") REFERENCES "user"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------
-- 8) Feedback general
-- ---------------------------------------------------------------------
CREATE TYPE "FeedbackKind" AS ENUM ('confusing', 'idea', 'praise', 'other');
CREATE TYPE "ProductSurface" AS ENUM ('lesson', 'practice', 'playground', 'app');

CREATE TABLE "feedback" (
  "id"                 TEXT NOT NULL,
  "userId"             TEXT NOT NULL,
  "kind"               "FeedbackKind" NOT NULL,
  "message"            TEXT NOT NULL,
  "path"               TEXT,
  "surface"            "ProductSurface",
  "lessonId"           TEXT,
  "practiceExerciseId" TEXT,
  "status"             "ReportStatus" NOT NULL DEFAULT 'open',
  "resolutionNote"     TEXT,
  "issueUrl"           TEXT,
  "prUrl"              TEXT,
  "triagedAt"          TIMESTAMP(3),
  "resolvedAt"         TIMESTAMP(3),
  "handledById"        TEXT,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL,
  CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "feedback_status_createdAt_idx"  ON "feedback"("status", "createdAt");
CREATE INDEX "feedback_userId_createdAt_idx"  ON "feedback"("userId", "createdAt");

ALTER TABLE "feedback"
  ADD CONSTRAINT "feedback_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "feedback"
  ADD CONSTRAINT "feedback_lessonId_fkey"
  FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "feedback"
  ADD CONSTRAINT "feedback_practiceExerciseId_fkey"
  FOREIGN KEY ("practiceExerciseId") REFERENCES "practice_exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "feedback"
  ADD CONSTRAINT "feedback_handledById_fkey"
  FOREIGN KEY ("handledById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------
-- 9) Event stream de producto (append-only)
-- ---------------------------------------------------------------------
CREATE TYPE "ProductEventName" AS ENUM (
  'lesson_view',
  'lesson_engaged',
  'lesson_step_view',
  'lesson_step_attempt',
  'lesson_step_answer_revealed',
  'practice_view',
  'practice_engaged',
  'code_run'
);

CREATE TABLE "product_event" (
  "id"                 TEXT NOT NULL,
  "userId"             TEXT NOT NULL,
  "name"               "ProductEventName" NOT NULL,
  "surface"            "ProductSurface" NOT NULL,
  "lessonId"           TEXT,
  "lessonStepId"       TEXT,
  "exerciseId"         TEXT,
  "practiceExerciseId" TEXT,
  "studySessionId"     TEXT,
  "contentRevision"    TEXT,
  "dedupeKey"          TEXT,
  "occurredAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "props"              JSONB NOT NULL DEFAULT '{}',
  CONSTRAINT "product_event_pkey" PRIMARY KEY ("id")
);

-- Idempotencia: (userId, dedupeKey). En Postgres los NULL son distintos
-- entre sí, así que los eventos sin dedupe no compiten por el índice.
CREATE UNIQUE INDEX "product_event_userId_dedupeKey_key"
  ON "product_event"("userId", "dedupeKey");

CREATE INDEX "product_event_name_occurredAt_idx"
  ON "product_event"("name", "occurredAt");
CREATE INDEX "product_event_userId_occurredAt_idx"
  ON "product_event"("userId", "occurredAt");
CREATE INDEX "product_event_lessonId_name_occurredAt_idx"
  ON "product_event"("lessonId", "name", "occurredAt");
CREATE INDEX "product_event_exerciseId_name_occurredAt_idx"
  ON "product_event"("exerciseId", "name", "occurredAt");
CREATE INDEX "product_event_practiceExerciseId_name_occurredAt_idx"
  ON "product_event"("practiceExerciseId", "name", "occurredAt");
CREATE INDEX "product_event_studySessionId_idx"
  ON "product_event"("studySessionId");

ALTER TABLE "product_event"
  ADD CONSTRAINT "product_event_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_event"
  ADD CONSTRAINT "product_event_lessonId_fkey"
  FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "product_event"
  ADD CONSTRAINT "product_event_lessonStepId_fkey"
  FOREIGN KEY ("lessonStepId") REFERENCES "lesson_step"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "product_event"
  ADD CONSTRAINT "product_event_exerciseId_fkey"
  FOREIGN KEY ("exerciseId") REFERENCES "exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "product_event"
  ADD CONSTRAINT "product_event_practiceExerciseId_fkey"
  FOREIGN KEY ("practiceExerciseId") REFERENCES "practice_exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "product_event"
  ADD CONSTRAINT "product_event_studySessionId_fkey"
  FOREIGN KEY ("studySessionId") REFERENCES "study_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
