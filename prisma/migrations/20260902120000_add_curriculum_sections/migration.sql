-- =====================================================================
--  Agrupaciones curriculares (CurriculumSection) dentro de un Course.
--
--  100% ADITIVA: crea una tabla nueva y una columna nullable en `unit`.
--  No toca ninguna identidad/unicidad existente, no borra ni recrea
--  ninguna fila. El backfill semántico (qué Unit pertenece a qué
--  sección) NO vive aquí — lo hace el seed (`prisma/seed-content.ts`),
--  que es la fuente de verdad del contenido.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tabla curriculum_section
-- ---------------------------------------------------------------------
CREATE TABLE "curriculum_section" (
    "id"          TEXT NOT NULL,
    "courseId"    TEXT NOT NULL,
    "key"         TEXT NOT NULL,
    "semester"    INTEGER NOT NULL,
    "subjectName" TEXT NOT NULL,
    "order"       INTEGER NOT NULL,

    CONSTRAINT "curriculum_section_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "curriculum_section_semester_check" CHECK ("semester" > 0),
    CONSTRAINT "curriculum_section_order_check" CHECK ("order" > 0)
);

-- ---------------------------------------------------------------------
-- 2. Unicidad e índices
-- ---------------------------------------------------------------------
CREATE UNIQUE INDEX "curriculum_section_courseId_key_key"
  ON "curriculum_section"("courseId", "key");

CREATE INDEX "curriculum_section_courseId_order_idx"
  ON "curriculum_section"("courseId", "order");

-- ---------------------------------------------------------------------
-- 3. FK courseId -> course.id
-- ---------------------------------------------------------------------
ALTER TABLE "curriculum_section"
  ADD CONSTRAINT "curriculum_section_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "course"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------
-- 4. unit.curriculumSectionId — nullable, sin backfill (lo hace el seed)
-- ---------------------------------------------------------------------
ALTER TABLE "unit" ADD COLUMN "curriculumSectionId" TEXT;

CREATE INDEX "unit_curriculumSectionId_idx"
  ON "unit"("curriculumSectionId");

ALTER TABLE "unit"
  ADD CONSTRAINT "unit_curriculumSectionId_fkey"
  FOREIGN KEY ("curriculumSectionId") REFERENCES "curriculum_section"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
