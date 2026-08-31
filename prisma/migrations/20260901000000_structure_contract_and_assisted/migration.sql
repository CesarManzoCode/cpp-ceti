-- Contrato estructural de los retos (LEARN-01) y registro de ayuda
-- revelada (LEARN-02).
--
-- Ambas columnas nuevas de contrato son NULL por defecto: un reto sin
-- contrato sigue evaluándose sólo por comportamiento, exactamente como
-- hasta ahora. Las banderas de ayuda arrancan en `false`, así que ningún
-- progreso existente cambia de significado.

ALTER TABLE "exercise" ADD COLUMN "structureContract" JSONB;
ALTER TABLE "practice_exercise" ADD COLUMN "structureContract" JSONB;

ALTER TABLE "user_step_progress" ADD COLUMN "assisted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_step_progress" ADD COLUMN "helpRevealCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "user_exercise_attempt" ADD COLUMN "assisted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_practice_attempt" ADD COLUMN "assisted" BOOLEAN NOT NULL DEFAULT false;
