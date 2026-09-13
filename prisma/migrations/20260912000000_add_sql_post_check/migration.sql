-- Verificación posterior a la ejecución para retos SQL (bases-de-datos):
-- el post-check corre DESPUÉS del código del alumno, en la misma sesión/
-- base efímera, para confirmar el estado real de la BD (tabla, UNIQUE,
-- CHECK, FK, trigger, vista) en vez de confiar sólo en el stdout que el
-- alumno decidió imprimir. Ambas columnas van juntas (o las dos NULL, o
-- las dos con valor) y nunca se muestran al alumno.

ALTER TABLE "test_case" ADD COLUMN "postCheckSql" TEXT;
ALTER TABLE "test_case" ADD COLUMN "postCheckExpectedStdout" TEXT;

ALTER TABLE "practice_test_case" ADD COLUMN "postCheckSql" TEXT;
ALTER TABLE "practice_test_case" ADD COLUMN "postCheckExpectedStdout" TEXT;
