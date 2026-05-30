-- Friends system: añade username/bio al user y crea Friendship.
-- El username se backfillea desde el email antes de aplicar NOT NULL,
-- para no romper a usuarios existentes.

-- =====================================================================
-- USER: username (NOT NULL, UNIQUE, lowercase) + bio
-- =====================================================================

-- 1) Añade columnas nullable
ALTER TABLE "user" ADD COLUMN "username" TEXT;
ALTER TABLE "user" ADD COLUMN "bio" VARCHAR(160);

-- 2) Backfill: usa la parte local del email, lowercase, sólo [a-z0-9_]
UPDATE "user"
SET "username" = LOWER(REGEXP_REPLACE(SPLIT_PART("email", '@', 1), '[^a-z0-9_]', '', 'g'))
WHERE "username" IS NULL;

-- 3) Si el slug quedó vacío o muy corto (<3), usa un prefijo determinista del id
UPDATE "user"
SET "username" = 'u' || LOWER(SUBSTRING("id" FROM 1 FOR 7))
WHERE "username" IS NULL OR LENGTH("username") < 3;

-- 4) Trunca a 20 chars (sin tocar los que ya estaban dentro del límite)
UPDATE "user"
SET "username" = SUBSTRING("username" FROM 1 FOR 20)
WHERE LENGTH("username") > 20;

-- 5) Resuelve colisiones — al duplicado más viejo le dejo el nombre limpio,
--    al resto le pego un sufijo numérico estable (ordenado por createdAt).
--    El sufijo puede empujar el largo a >20 momentáneamente; lo aceptamos
--    porque el límite duro (NOT NULL + validación) sólo aplica desde nuevos
--    registros, y nadie verá esos handles a menos que el usuario los use.
WITH dups AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "username" ORDER BY "createdAt" ASC, "id" ASC) - 1 AS rn
  FROM "user"
)
UPDATE "user" u
SET "username" = u."username" || dups.rn::text
FROM dups
WHERE u."id" = dups."id" AND dups.rn > 0;

-- 6) Constraints finales
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;

-- =====================================================================
-- FRIENDSHIP
-- =====================================================================

CREATE TYPE "FriendStatus" AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE "friendship" (
  "id"          TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "addresseeId" TEXT NOT NULL,
  "status"      "FriendStatus" NOT NULL DEFAULT 'pending',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt"  TIMESTAMP(3),
  CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "friendship"
  ADD CONSTRAINT "friendship_requesterId_fkey"
  FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "friendship"
  ADD CONSTRAINT "friendship_addresseeId_fkey"
  FOREIGN KEY ("addresseeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "friendship_requesterId_addresseeId_key"
  ON "friendship"("requesterId", "addresseeId");

CREATE INDEX "friendship_addresseeId_status_idx"
  ON "friendship"("addresseeId", "status");

CREATE INDEX "friendship_requesterId_status_idx"
  ON "friendship"("requesterId", "status");

-- Bloquea autosolicitud (no dependemos sólo de validación en server actions).
ALTER TABLE "friendship"
  ADD CONSTRAINT "friendship_no_self_check" CHECK ("requesterId" <> "addresseeId");
