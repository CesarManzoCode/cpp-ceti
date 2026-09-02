-- Base de Datos I: agrega `sql` al enum de lenguajes soportados.
-- ALTER TYPE ... ADD VALUE es seguro (idempotente con IF NOT EXISTS) y el
-- valor nuevo no se usa en esta misma migración — el seed crea el Course
-- `bases-de-datos` en una corrida posterior.

ALTER TYPE "ProgrammingLanguage" ADD VALUE IF NOT EXISTS 'sql';
