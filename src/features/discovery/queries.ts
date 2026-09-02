import { Prisma } from "@prisma/client";

import { ActionError } from "@/lib/action-error";
import { db } from "@/lib/db";
import { decodeSignedToken, encodeSignedToken } from "@/lib/social/signed-token";

export const DISCOVERY_PAGE_MAX = 40;
const CURSOR_TTL_MS = 60 * 60 * 1000;
/** TTL del context token que correlaciona "vi este candidato en discovery" con la solicitud que mande. */
const CONTEXT_TOKEN_TTL_MS = 30 * 60 * 1000;

export type DiscoveryBucket = 1 | 2 | 3 | 4 | 5;

export interface DiscoveryCandidate {
  id: string;
  username: string;
  name: string;
  image: string | null;
  bucket: DiscoveryBucket;
  mutualCount: number;
  /** Texto ya resuelto — NUNCA revela el grupo exacto a un no-amigo. */
  reason: string;
  /** Token firmado: correlaciona un `sendFriendRequest(source:"discovery")` con ESTE resultado. */
  contextToken: string;
}

export interface DiscoveryPage {
  candidates: DiscoveryCandidate[];
  nextCursor: string | null;
}

interface CursorPayload {
  bucket: number;
  negMutual: number;
  negLastSig: number;
  username: string;
  id: string;
  snapshotAt: string;
}

interface Row {
  id: string;
  username: string;
  name: string;
  image: string | null;
  bucket: number;
  mutual_count: number;
  program_name: string | null;
  semester: number | null;
  last_significant_epoch: string | null;
}

const NULL_LAST_SIG_SENTINEL = 9e18;

function contextTokenFor(viewerId: string, candidateId: string, bucket: DiscoveryBucket): string {
  return encodeSignedToken(
    { viewerId, candidateId, bucket: String(bucket) },
    CONTEXT_TOKEN_TTL_MS,
  );
}

function reasonFor(bucket: DiscoveryBucket, row: Row, courseTitle: string | null): string {
  switch (bucket) {
    case 1:
      return `${row.mutual_count} ${row.mutual_count === 1 ? "amigo en común" : "amigos en común"}`;
    case 2:
      return "Mismo grupo";
    case 3:
      // El semestre va primero: en móvil la razón se recorta por la
      // derecha y el nombre largo de la carrera se comía el dato corto.
      return row.program_name && row.semester
        ? `${row.semester}.º semestre · ${row.program_name}`
        : "Misma carrera y semestre";
    case 4:
      return courseTitle ? `También estudia ${courseTitle}` : "También estudia este curso";
    case 5:
      return "Mismo plantel";
  }
}

/**
 * Descubrimiento de compañeros — 5 buckets EXACTOS, primer match gana,
 * orden `bucket ASC, mutualCount DESC (bucket1), lastSignificantAt DESC
 * NULLS LAST, username ASC, id ASC`. Implementado con UNA consulta SQL
 * parametrizada (CTEs) para mantener esa semántica sin concatenar 5
 * arrays ni hacer N+1: cada candidato se evalúa una sola vez contra los 5
 * criterios, en el orden de precedencia del contrato.
 *
 * `courseId` es el curso SELECCIONADO actualmente por el viewer (o `null`
 * si no hay uno válido — bucket4 se omite entonces). `snapshotAt` viene
 * del cursor (si lo hay) para que `lastSignificantAt` no cambie de
 * significado entre páginas de la misma sesión de scroll.
 */
export async function getDiscoveryCandidates(
  viewerId: string,
  opts: { courseId: string | null; cursor?: string | null; pageSize?: number },
): Promise<DiscoveryPage> {
  const pageSize = Math.min(Math.max(opts.pageSize ?? DISCOVERY_PAGE_MAX, 1), DISCOVERY_PAGE_MAX);

  let cursor: CursorPayload | null = null;
  if (opts.cursor) {
    const decoded = decodeSignedToken<CursorPayload>(opts.cursor);
    if (!decoded) throw new ActionError("El cursor de resultados ya no es válido.");
    cursor = decoded;
  }
  const snapshotAt = cursor ? new Date(cursor.snapshotAt) : new Date();
  const courseId = opts.courseId;

  const rows = await db.$queryRaw<Row[]>(Prisma.sql`
    WITH excluded AS (
      SELECT ${viewerId}::text AS id
      UNION
      SELECT CASE WHEN f."requesterId" = ${viewerId} THEN f."addresseeId" ELSE f."requesterId" END
      FROM friendship f
      WHERE f.status IN ('accepted', 'pending', 'blocked')
        AND ${viewerId} IN (f."requesterId", f."addresseeId")
    ),
    viewer_friends AS (
      SELECT CASE WHEN f."requesterId" = ${viewerId} THEN f."addresseeId" ELSE f."requesterId" END AS friend_id
      FROM friendship f
      WHERE f.status = 'accepted' AND ${viewerId} IN (f."requesterId", f."addresseeId")
    ),
    viewer AS (
      SELECT u.id, u."academicOfferingId", u."academicSemester", u."academicGroup",
             ao."programId" AS "programId", ao."campusId" AS "campusId"
      FROM "user" u
      LEFT JOIN academic_offering ao ON ao.id = u."academicOfferingId"
      WHERE u.id = ${viewerId}
    ),
    candidates_base AS (
      SELECT u.id, u.username, u.name, u.image,
             u."academicOfferingId", u."academicSemester", u."academicGroup",
             ao."programId" AS "programId", ao."campusId" AS "campusId"
      FROM "user" u
      LEFT JOIN academic_offering ao ON ao.id = u."academicOfferingId"
      WHERE u."usernameSetupRequired" = false
        AND u.id NOT IN (SELECT id FROM excluded)
    ),
    mutuals AS (
      SELECT cb.id AS candidate_id, COUNT(*)::int AS mutual_count
      FROM candidates_base cb
      JOIN friendship f ON f.status = 'accepted' AND (f."requesterId" = cb.id OR f."addresseeId" = cb.id)
      JOIN viewer_friends vf
        ON vf.friend_id = CASE WHEN f."requesterId" = cb.id THEN f."addresseeId" ELSE f."requesterId" END
      GROUP BY cb.id
    ),
    course_active AS (
      SELECT DISTINCT u.id
      FROM candidates_base u
      WHERE ${courseId}::text IS NOT NULL
        AND (
          EXISTS (
            SELECT 1 FROM user_lesson_progress ulp
            JOIN lesson l ON l.id = ulp."lessonId"
            JOIN unit un ON un.id = l."unitId"
            WHERE ulp."userId" = u.id AND un."courseId" = ${courseId}
          )
          OR EXISTS (
            SELECT 1 FROM user_exercise_attempt uea
            JOIN exercise e ON e.id = uea."exerciseId"
            JOIN lesson_step ls ON ls.id = e."stepId"
            JOIN lesson l2 ON l2.id = ls."lessonId"
            JOIN unit un2 ON un2.id = l2."unitId"
            WHERE uea."userId" = u.id AND un2."courseId" = ${courseId}
          )
          OR EXISTS (
            SELECT 1 FROM user_practice_attempt upa
            JOIN practice_exercise pe ON pe.id = upa."exerciseId"
            WHERE upa."userId" = u.id AND pe."courseId" = ${courseId}
          )
        )
    ),
    last_significant AS (
      SELECT t."userId", MAX(t.at) AS at
      FROM (
        SELECT "userId", "completedAt" AS at FROM user_lesson_progress
        WHERE status = 'completed' AND "completedAt" IS NOT NULL AND "completedAt" <= ${snapshotAt}
        UNION ALL
        SELECT "userId", "createdAt" FROM user_exercise_attempt WHERE "createdAt" <= ${snapshotAt}
        UNION ALL
        SELECT "userId", "createdAt" FROM user_practice_attempt WHERE "createdAt" <= ${snapshotAt}
      ) t
      GROUP BY t."userId"
    ),
    bucketed AS (
      SELECT
        cb.id, cb.username, cb.name, cb.image,
        COALESCE(m.mutual_count, 0) AS mutual_count,
        p.name AS program_name,
        cb."academicSemester" AS semester,
        CASE
          WHEN COALESCE(m.mutual_count, 0) > 0 THEN 1
          WHEN v."academicOfferingId" IS NOT NULL
            AND cb."academicOfferingId" = v."academicOfferingId"
            AND cb."academicSemester" = v."academicSemester"
            AND cb."academicGroup" IS NOT NULL
            AND cb."academicGroup" = v."academicGroup" THEN 2
          WHEN v."programId" IS NOT NULL
            AND cb."programId" = v."programId"
            AND cb."academicSemester" = v."academicSemester" THEN 3
          WHEN ${courseId}::text IS NOT NULL AND ca.id IS NOT NULL THEN 4
          WHEN v."campusId" IS NOT NULL AND cb."campusId" = v."campusId" THEN 5
          ELSE NULL
        END AS bucket
      FROM candidates_base cb
      CROSS JOIN viewer v
      LEFT JOIN mutuals m ON m.candidate_id = cb.id
      LEFT JOIN course_active ca ON ca.id = cb.id
      LEFT JOIN academic_program p ON p.id = cb."programId"
    ),
    final AS (
      SELECT
        b.id, b.username, b.name, b.image, b.bucket, b.mutual_count, b.program_name, b.semester,
        COALESCE(EXTRACT(EPOCH FROM ls.at) * 1000, ${NULL_LAST_SIG_SENTINEL}::float8) AS last_significant_epoch
      FROM bucketed b
      LEFT JOIN last_significant ls ON ls."userId" = b.id
      WHERE b.bucket IS NOT NULL
    )
    SELECT id, username, name, image, bucket, mutual_count, program_name, semester,
           last_significant_epoch::text AS last_significant_epoch
    FROM final
    WHERE ${
      cursor
        ? Prisma.sql`(bucket, -mutual_count, last_significant_epoch, username, id) >
           (${cursor.bucket}, ${cursor.negMutual}, ${-cursor.negLastSig}, ${cursor.username}, ${cursor.id})`
        : Prisma.sql`TRUE`
    }
    ORDER BY bucket ASC, -mutual_count ASC, last_significant_epoch ASC, username ASC, id ASC
    LIMIT ${pageSize + 1}
  `);

  const courseTitle = courseId
    ? (await db.course.findUnique({ where: { id: courseId }, select: { title: true } }))?.title ?? null
    : null;

  const hasMore = rows.length > pageSize;
  const page = rows.slice(0, pageSize);

  const candidates: DiscoveryCandidate[] = page.map((row) => {
    const bucket = row.bucket as DiscoveryBucket;
    return {
      id: row.id,
      username: row.username,
      name: row.name,
      image: row.image,
      bucket,
      mutualCount: row.mutual_count,
      reason: reasonFor(bucket, row, courseTitle),
      contextToken: contextTokenFor(viewerId, row.id, bucket),
    };
  });

  let nextCursor: string | null = null;
  const last = page.at(-1);
  if (hasMore && last) {
    nextCursor = encodeSignedToken(
      {
        bucket: last.bucket,
        negMutual: -last.mutual_count,
        negLastSig: -Number(last.last_significant_epoch),
        username: last.username,
        id: last.id,
        snapshotAt: snapshotAt.toISOString(),
      } satisfies CursorPayload,
      CURSOR_TTL_MS,
    );
  }

  return { candidates, nextCursor };
}
