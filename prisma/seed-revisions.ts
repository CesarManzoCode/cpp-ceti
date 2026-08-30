import type { ContentTargetType, PrismaClient } from "@prisma/client";

import { contentRevision } from "../src/lib/content-revision";

/**
 * Registro de revisiones de contenido durante el seed.
 *
 * El seed es la única fuente de verdad del contenido (`prisma/content/*.ts`),
 * así que también es el único lugar donde puede detectarse "esto cambió".
 * Cuando el hash de un paso/ejercicio cambia:
 *   1. se actualiza `contentRevision` + `contentRevisionAt` en la entidad;
 *   2. se agrega una fila a `content_revision` con el momento en que la
 *      revisión apareció por primera vez.
 *
 * Ese segundo paso es el que hace posible un before/after honesto: da la
 * frontera temporal exacta entre "intentos con la versión vieja" y
 * "intentos con la nueva".
 */
export { contentRevision };

export interface RevisionUpdate {
  revision: string;
  changed: boolean;
}

/**
 * Registra la revisión si cambió. `applyEntityUpdate` recibe el hash nuevo
 * y actualiza la entidad correspondiente (cada tabla tiene su propio update).
 */
export async function trackRevision(
  db: PrismaClient,
  targetType: ContentTargetType,
  targetId: string,
  currentRevision: string | null,
  nextRevision: string,
  applyEntityUpdate: (revision: string) => Promise<unknown>,
): Promise<RevisionUpdate> {
  if (currentRevision === nextRevision) {
    return { revision: nextRevision, changed: false };
  }

  await applyEntityUpdate(nextRevision);

  // Append-only e idempotente: si la revisión ya se había visto (p. ej. se
  // revirtió un cambio), conserva su `firstSeenAt` original.
  await db.contentRevision.createMany({
    data: [{ targetType, targetId, revision: nextRevision }],
    skipDuplicates: true,
  });

  return { revision: nextRevision, changed: true };
}
