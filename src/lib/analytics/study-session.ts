import { Prisma } from "@prisma/client";

import type { db as prismaDb } from "@/lib/db";

/**
 * CICLO DE VIDA DE UNA SESIÓN DE ESTUDIO
 * ======================================
 *
 * 1. `startStudySession` — el reproductor (lección o práctica) la abre al
 *    montarse. Idempotente por `clientKey`: React StrictMode, un reintento
 *    de red o un doble montaje devuelven LA MISMA sesión.
 * 2. `heartbeatStudySession` — cada 30 s, y SÓLO si la pestaña está visible
 *    y hubo actividad real en los últimos 60 s. Acredita el hueco desde el
 *    último ping, acotado a `MAX_HEARTBEAT_CREDIT_MS`.
 * 3. `endStudySession` — al desmontar o al `pagehide`. Idempotente
 *    (`WHERE endedAt IS NULL`).
 * 4. `closeStaleStudySessions` — red de seguridad para cuando el paso 3
 *    nunca ocurre (pestaña cerrada de golpe, batería, pérdida de red). Cierra
 *    la sesión EN `lastPingAt`, no en `now()`: una sesión abandonada no puede
 *    inflar horas de uso.
 *
 * Todo el reloj es del servidor. El cliente no manda duraciones ni
 * timestamps: sólo dice "sigo aquí y estuve activo".
 */

/** Cada cuánto late el cliente mientras hay actividad. */
export const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * Ventana de inactividad del cliente: si no hubo teclado/mouse/scroll en este
 * lapso, el cliente DEJA de latir (aunque la pestaña siga visible).
 */
export const ACTIVITY_WINDOW_MS = 60_000;

/**
 * Tope de crédito por hueco entre latidos. Si el cliente se durmió y volvió
 * 20 minutos después, ese hueco cuenta como 60 s, no como 20 minutos.
 */
export const MAX_HEARTBEAT_CREDIT_MS = 60_000;

/** Sin latidos por más de esto, la sesión se considera huérfana. */
export const SESSION_IDLE_TIMEOUT_MS = 5 * 60_000;

export type StudySurface = "lesson" | "practice";

type Db = typeof prismaDb;

/**
 * Crédito de tiempo activo por un hueco entre dos señales, en ms.
 * Misma regla en heartbeat y en cierre; el servidor la aplica en SQL, esta
 * función es la definición de referencia (y lo que prueban los tests).
 */
export function creditForGap(gapMs: number): number {
  if (!Number.isFinite(gapMs) || gapMs <= 0) return 0;
  return Math.min(Math.round(gapMs), MAX_HEARTBEAT_CREDIT_MS);
}

/**
 * Fin efectivo de una sesión para analytics: si nunca se cerró, vale
 * `lastPingAt` (el último momento en que sabemos que el alumno estaba ahí).
 * Nunca `now()`: eso haría crecer sesiones abandonadas para siempre.
 */
export function effectiveEndedAt(session: {
  endedAt: Date | null;
  lastPingAt: Date;
}): Date {
  return session.endedAt ?? session.lastPingAt;
}

/** ¿Esta sesión abierta ya se quedó huérfana? */
export function isStale(
  session: { endedAt: Date | null; lastPingAt: Date },
  now: Date,
): boolean {
  if (session.endedAt) return false;
  return now.getTime() - session.lastPingAt.getTime() > SESSION_IDLE_TIMEOUT_MS;
}

/**
 * Cierra las sesiones huérfanas de un usuario. Se llama al abrir una sesión
 * nueva: barato, acotado al propio usuario y suficiente para que ninguna
 * sesión quede abierta indefinidamente.
 */
export async function closeStaleStudySessions(
  db: Db,
  userId: string,
): Promise<number> {
  const cutoff = new Date(Date.now() - SESSION_IDLE_TIMEOUT_MS);
  return db.$executeRaw(Prisma.sql`
    UPDATE "study_session"
       SET "endedAt" = GREATEST("lastPingAt", "startedAt"),
           "endedReason" = 'expired'::"StudySessionEndReason"
     WHERE "userId" = ${userId}
       AND "endedAt" IS NULL
       AND "lastPingAt" < ${cutoff}
  `);
}

export interface StartStudySessionInput {
  userId: string;
  surface: StudySurface;
  /** lessonId o practiceExerciseId. */
  resourceId: string;
  /** Clave de idempotencia generada por el cliente (una por montaje). */
  clientKey: string;
}

/**
 * Abre (o recupera) la sesión de estudio de este montaje.
 *
 * Idempotencia real, no "casi": el UNIQUE (userId, clientKey) más
 * `createMany({ skipDuplicates })` — que compila a `INSERT ... ON CONFLICT
 * DO NOTHING` — hacen que dos llamadas concurrentes con la misma clave
 * terminen en una sola fila, sin read-then-write y sin abortar nada.
 */
export async function startStudySession(
  db: Db,
  input: StartStudySessionInput,
): Promise<{ id: string; created: boolean }> {
  await closeStaleStudySessions(db, input.userId);

  const inserted = await db.studySession.createMany({
    data: [
      {
        userId: input.userId,
        surface: input.surface,
        resourceId: input.resourceId,
        clientKey: input.clientKey,
      },
    ],
    skipDuplicates: true,
  });

  const session = await db.studySession.findUnique({
    where: {
      userId_clientKey: { userId: input.userId, clientKey: input.clientKey },
    },
    select: { id: true },
  });

  if (!session) {
    // No debería pasar: acabamos de insertar o ya existía.
    throw new Error("study session not found after upsert");
  }

  return { id: session.id, created: inserted.count === 1 };
}

/**
 * Latido. Acredita `LEAST(now - lastPingAt, MAX_HEARTBEAT_CREDIT_MS)` en una
 * sola sentencia: dos latidos concurrentes no pueden pisarse (nada de
 * read-modify-write en JS). Ignora sesiones ya cerradas o de otro usuario.
 *
 * @returns true si el latido se aplicó a una sesión abierta del usuario.
 */
export async function heartbeatStudySession(
  db: Db,
  userId: string,
  sessionId: string,
): Promise<boolean> {
  const updated = await db.$executeRaw(Prisma.sql`
    UPDATE "study_session"
       SET "engagedMs" = "engagedMs" + ${creditExpression()},
           "lastPingAt" = now()
     WHERE "id" = ${sessionId}
       AND "userId" = ${userId}
       AND "endedAt" IS NULL
  `);
  return updated > 0;
}

/**
 * Cierra la sesión acreditando el último hueco con la misma regla del
 * latido. Idempotente: si ya estaba cerrada, no hace nada.
 */
export async function endStudySession(
  db: Db,
  userId: string,
  sessionId: string,
): Promise<boolean> {
  const updated = await db.$executeRaw(Prisma.sql`
    UPDATE "study_session"
       SET "engagedMs" = "engagedMs" + ${creditExpression()},
           "lastPingAt" = now(),
           "endedAt" = now(),
           "endedReason" = 'closed'::"StudySessionEndReason"
     WHERE "id" = ${sessionId}
       AND "userId" = ${userId}
       AND "endedAt" IS NULL
  `);
  return updated > 0;
}

/**
 * `LEAST(GREATEST(now - lastPingAt, 0), tope)` en milisegundos enteros.
 * Vive en una sola función para que heartbeat y cierre no puedan divergir.
 */
function creditExpression(): Prisma.Sql {
  return Prisma.sql`LEAST(
      GREATEST(EXTRACT(EPOCH FROM (now() - "lastPingAt")) * 1000, 0),
      ${MAX_HEARTBEAT_CREDIT_MS}
    )::int`;
}
