import type { Prisma } from "@prisma/client";

/**
 * "Reclamo" atómico del PRIMER APROBADO de un ejercicio.
 *
 * Por qué `createMany({ skipDuplicates })` y NO `create()` + try/catch P2002:
 *
 * En PostgreSQL, cualquier error dentro de una transacción (incluida una
 * violación de UNIQUE) marca la transacción entera como abortada. Aunque
 * JavaScript atrape el P2002, el estado del lado del servidor ya quedó en
 * `aborted`, y CUALQUIER consulta posterior dentro de esa misma transacción
 * falla con:
 *
 *   PostgresError 25P02 — current transaction is aborted,
 *   commands ignored until end of transaction block
 *
 * Eso es exactamente lo que rompía `submitPracticeExercise` /
 * `submitExercise` cuando un usuario volvía a aprobar un ejercicio que ya
 * había aprobado: el `create()` de la completion chocaba con el UNIQUE,
 * el catch se lo tragaba, y el `userPracticeAttempt.create(...)` siguiente
 * moría con 25P02.
 *
 * `createMany({ data: [...], skipDuplicates: true })` compila a
 * `INSERT ... ON CONFLICT DO NOTHING`: el conflicto lo resuelve Postgres
 * SIN levantar error, así que la transacción NUNCA queda abortada y sigue
 * siendo usable. El `count` devuelto distingue el caso de forma atómica:
 *
 *   count === 1 → esta llamada insertó la fila  → es el primer aprobado
 *   count === 0 → la fila ya existía            → aprobado repetido
 *
 * También evita el read-then-write (`findUnique` + `create`), que sí sería
 * vulnerable a race conditions entre dos envíos concurrentes: aquí el
 * ganador lo decide el índice UNIQUE, no una lectura previa.
 */

/**
 * Reclama el primer aprobado de un ejercicio DE LECCIÓN.
 * @returns `true` sólo para el envío que insertó la completion.
 */
export async function claimExerciseCompletion(
  tx: Prisma.TransactionClient,
  userId: string,
  exerciseId: string,
): Promise<boolean> {
  const inserted = await tx.userExerciseCompletion.createMany({
    data: [{ userId, exerciseId }],
    skipDuplicates: true,
  });
  return inserted.count === 1;
}

/**
 * Reclama el primer aprobado de un ejercicio de PRÁCTICA (standalone).
 * @returns `true` sólo para el envío que insertó la completion.
 */
export async function claimPracticeCompletion(
  tx: Prisma.TransactionClient,
  userId: string,
  exerciseId: string,
): Promise<boolean> {
  const inserted = await tx.userPracticeCompletion.createMany({
    data: [{ userId, exerciseId }],
    skipDuplicates: true,
  });
  return inserted.count === 1;
}
