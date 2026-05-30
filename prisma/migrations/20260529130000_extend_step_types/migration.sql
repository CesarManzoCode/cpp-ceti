-- Sprint 2: dos tipos de paso interactivos nuevos.
-- ALTER TYPE ... ADD VALUE es seguro (idempotente con IF NOT EXISTS) y los
-- valores nuevos no se usan en esta misma migración.

ALTER TYPE "LessonStepType" ADD VALUE IF NOT EXISTS 'matching';
ALTER TYPE "LessonStepType" ADD VALUE IF NOT EXISTS 'code_completion';
