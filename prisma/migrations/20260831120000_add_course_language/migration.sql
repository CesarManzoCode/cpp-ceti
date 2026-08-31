-- =====================================================================
--  Curso multilenguaje: metadatos de lenguaje/runtime + propiedad de
--  las prácticas por curso.
--
--  ZONA CRÍTICA. Esta migración corre sobre datos reales de alumnos.
--  Reglas que sigue, en orden:
--    1. Agrega columnas NULLABLE (nunca NOT NULL de golpe).
--    2. Rellena (backfill) el curso legacy por su slug ESTABLE.
--    3. Verifica conteos y ausencia de huérfanos; ABORTA si algo no cuadra.
--    4. Recién entonces endurece a NOT NULL y agrega llaves/índices.
--  No borra ni recrea ninguna fila. Todos los IDs se preservan.
--
--  Si la base tiene otro slug legacy o varios cursos publicados, la
--  migración FALLA con un mensaje explicativo y exige un mapeo explícito.
--  Adivinar aquí significa colgar el progreso de un alumno del curso
--  equivocado.
-- =====================================================================

-- Slug estable del curso C++ existente. Es identidad histórica: si cambia,
-- cambia también el backfill (y hay que documentarlo).
-- Ver `prisma/content/index.ts` → cursoCpp.slug.

-- ---------------------------------------------------------------------
-- 1. Enum de lenguajes
-- ---------------------------------------------------------------------
CREATE TYPE "ProgrammingLanguage" AS ENUM ('cpp', 'csharp');

-- ---------------------------------------------------------------------
-- 2. Metadatos del curso — nullable primero
-- ---------------------------------------------------------------------
ALTER TABLE "course" ADD COLUMN "subjectName" TEXT;
ALTER TABLE "course" ADD COLUMN "academicContext" TEXT;
ALTER TABLE "course" ADD COLUMN "language" "ProgrammingLanguage";
ALTER TABLE "course" ADD COLUMN "executionProfile" TEXT;

-- ---------------------------------------------------------------------
-- 3. Backfill del curso legacy C++ (o base vacía)
-- ---------------------------------------------------------------------
DO $$
DECLARE
  legacy_id     TEXT;
  total_courses BIGINT;
  other_courses BIGINT;
  updated       BIGINT;
BEGIN
  SELECT count(*) INTO total_courses FROM "course";

  -- Base nueva: no hay nada que rellenar; el seed crea el curso completo.
  IF total_courses = 0 THEN
    RAISE NOTICE 'course vacío: sin backfill (base nueva).';
    RETURN;
  END IF;

  SELECT id INTO legacy_id FROM "course" WHERE slug = 'cpp-desde-cero';

  IF legacy_id IS NULL THEN
    RAISE EXCEPTION
      'Migración abortada: hay % curso(s) pero ninguno con el slug legacy "cpp-desde-cero". '
      'Esta migración NO adivina a qué curso pertenece el contenido C++ histórico. '
      'Define el mapeo explícito antes de continuar.', total_courses;
  END IF;

  SELECT count(*) INTO other_courses FROM "course" WHERE slug <> 'cpp-desde-cero';
  IF other_courses > 0 THEN
    RAISE EXCEPTION
      'Migración abortada: además del curso legacy existen % curso(s) sin metadatos de '
      'lenguaje. Asigna language/executionProfile explícitamente a cada uno antes de '
      'correr esta migración.', other_courses;
  END IF;

  UPDATE "course"
     SET "subjectName"      = 'Programación en C++',
         "academicContext"  = 'Curso introductorio CETI',
         "language"         = 'cpp',
         "executionProfile" = 'cpp17-wandbox'
   WHERE id = legacy_id;
  GET DIAGNOSTICS updated = ROW_COUNT;

  IF updated <> 1 THEN
    RAISE EXCEPTION 'Migración abortada: el backfill del curso legacy afectó % filas (esperaba 1).', updated;
  END IF;

  RAISE NOTICE 'Curso legacy % marcado como cpp / cpp17-wandbox.', legacy_id;
END $$;

-- Ninguna fila puede quedar sin metadatos.
DO $$
DECLARE
  missing BIGINT;
BEGIN
  SELECT count(*) INTO missing
    FROM "course"
   WHERE "subjectName" IS NULL
      OR "academicContext" IS NULL
      OR "language" IS NULL
      OR "executionProfile" IS NULL;
  IF missing > 0 THEN
    RAISE EXCEPTION 'Migración abortada: % curso(s) sin metadatos de lenguaje tras el backfill.', missing;
  END IF;
END $$;

ALTER TABLE "course" ALTER COLUMN "subjectName" SET NOT NULL;
ALTER TABLE "course" ALTER COLUMN "academicContext" SET NOT NULL;
ALTER TABLE "course" ALTER COLUMN "language" SET NOT NULL;
ALTER TABLE "course" ALTER COLUMN "executionProfile" SET NOT NULL;

-- ---------------------------------------------------------------------
-- 4. Propiedad de las prácticas por curso — nullable primero
-- ---------------------------------------------------------------------
ALTER TABLE "practice_exercise" ADD COLUMN "courseId" TEXT;

DO $$
DECLARE
  legacy_id       TEXT;
  before_practice BIGINT;
  backfilled      BIGINT;
  still_null      BIGINT;
  orphans         BIGINT;
  orphan_sample   TEXT;
BEGIN
  SELECT count(*) INTO before_practice FROM "practice_exercise";

  IF before_practice = 0 THEN
    RAISE NOTICE 'practice_exercise vacío: sin backfill.';
    RETURN;
  END IF;

  SELECT id INTO legacy_id FROM "course" WHERE slug = 'cpp-desde-cero';
  IF legacy_id IS NULL THEN
    RAISE EXCEPTION
      'Migración abortada: hay % práctica(s) pero no existe el curso legacy '
      '"cpp-desde-cero" al que pertenecen.', before_practice;
  END IF;

  -- Toda práctica histórica es del curso C++: era el único curso que existía.
  UPDATE "practice_exercise" SET "courseId" = legacy_id WHERE "courseId" IS NULL;
  GET DIAGNOSTICS backfilled = ROW_COUNT;

  IF backfilled <> before_practice THEN
    RAISE EXCEPTION
      'Migración abortada: el backfill tocó % de % prácticas.', backfilled, before_practice;
  END IF;

  SELECT count(*) INTO still_null FROM "practice_exercise" WHERE "courseId" IS NULL;
  IF still_null > 0 THEN
    RAISE EXCEPTION 'Migración abortada: quedaron % prácticas sin curso.', still_null;
  END IF;

  -- La relación compuesta exige que (courseId, unitSlug) exista en `unit`.
  -- Una práctica cuyo unitSlug no corresponda a ninguna unidad del curso
  -- rompería la FK: mejor abortar con el detalle que fallar con un error
  -- opaco de constraint.
  SELECT count(*), COALESCE(string_agg(DISTINCT pe."unitSlug", ', '), '')
    INTO orphans, orphan_sample
    FROM "practice_exercise" pe
    LEFT JOIN "unit" u
      ON u."courseId" = pe."courseId" AND u."slug" = pe."unitSlug"
   WHERE u."id" IS NULL;

  IF orphans > 0 THEN
    RAISE EXCEPTION
      'Migración abortada: % práctica(s) apuntan a unidades inexistentes en el curso '
      'legacy (unitSlug: %). Corrige el contenido o crea las unidades antes de migrar.',
      orphans, orphan_sample;
  END IF;

  RAISE NOTICE '% prácticas asignadas al curso legacy %.', backfilled, legacy_id;
END $$;

ALTER TABLE "practice_exercise" ALTER COLUMN "courseId" SET NOT NULL;

-- ---------------------------------------------------------------------
-- 5. Unicidad por curso (reemplaza la unicidad global de slug)
--    El índice global se cae SÓLO después de que courseId ya existe y
--    está poblado: el nuevo índice compuesto cubre el mismo invariante
--    dentro del curso.
-- ---------------------------------------------------------------------
CREATE UNIQUE INDEX "practice_exercise_courseId_slug_key"
  ON "practice_exercise"("courseId", "slug");

CREATE INDEX "practice_exercise_courseId_unitSlug_position_idx"
  ON "practice_exercise"("courseId", "unitSlug", "position");

DROP INDEX "practice_exercise_slug_key";

-- ---------------------------------------------------------------------
-- 6. Llaves foráneas
-- ---------------------------------------------------------------------
ALTER TABLE "practice_exercise"
  ADD CONSTRAINT "practice_exercise_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "course"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "practice_exercise"
  ADD CONSTRAINT "practice_exercise_courseId_unitSlug_fkey"
  FOREIGN KEY ("courseId", "unitSlug") REFERENCES "unit"("courseId", "slug")
  ON DELETE CASCADE ON UPDATE CASCADE;
