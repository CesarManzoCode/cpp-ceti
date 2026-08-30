/**
 * CÁLCULO DE MÉTRICAS DE PRODUCTO
 * ===============================
 * Funciones puras sobre filas ya traídas de la BD. Viven aquí, y no dentro
 * de componentes React, por dos razones: se pueden probar, y la definición
 * de cada métrica queda en UN solo lugar (ver `docs/product-analytics.md`).
 *
 * Todas las funciones asumen que las filas ya vienen filtradas por ventana
 * temporal: la ventana la aplica la capa de queries, en SQL.
 */

// =====================================================================
//  Usuarios activos y nuevos
// =====================================================================

export interface ActivityRow {
  userId: string;
  at: Date;
}

/** Día UTC en formato YYYY-MM-DD (clave estable para agrupar). */
export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Semana ISO-ish: lunes de la semana en UTC, como YYYY-MM-DD. */
export function weekKey(date: Date): string {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayOfWeek = (d.getUTCDay() + 6) % 7; // lunes = 0
  d.setUTCDate(d.getUTCDate() - dayOfWeek);
  return d.toISOString().slice(0, 10);
}

/**
 * Usuarios activos = usuarios con al menos UNA actividad significativa.
 * Iniciar sesión no cuenta; abrir una lección tampoco (ver `docs`).
 */
export function countActiveUsers(rows: readonly ActivityRow[]): number {
  return new Set(rows.map((r) => r.userId)).size;
}

/** Activos por día, ordenado ascendente. */
export function activeUsersByDay(
  rows: readonly ActivityRow[],
): { day: string; users: number }[] {
  const byDay = new Map<string, Set<string>>();
  for (const row of rows) {
    const key = dayKey(row.at);
    let set = byDay.get(key);
    if (!set) {
      set = new Set();
      byDay.set(key, set);
    }
    set.add(row.userId);
  }
  return [...byDay.entries()]
    .map(([day, users]) => ({ day, users: users.size }))
    .sort((a, b) => (a.day < b.day ? -1 : 1));
}

/**
 * Primera actividad significativa de cada usuario (no su fecha de registro).
 * Un usuario que se registró y nunca hizo nada NO tiene primera actividad.
 */
export function firstActivityByUser(
  rows: readonly ActivityRow[],
): Map<string, Date> {
  const first = new Map<string, Date>();
  for (const row of rows) {
    const current = first.get(row.userId);
    if (!current || row.at < current) first.set(row.userId, row.at);
  }
  return first;
}

// =====================================================================
//  Retención por cohortes
// =====================================================================

export interface CohortRetention {
  /** Lunes de la semana de la primera actividad (UTC). */
  cohort: string;
  /** Usuarios cuya primera actividad cayó en esa semana. */
  size: number;
  /**
   * `returned[i]` = usuarios de la cohorte con actividad en la semana i
   * posterior. `returned[0]` es la semana de arranque (siempre = size).
   */
  returned: number[];
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Retención semanal por cohorte de PRIMERA ACTIVIDAD (no de registro).
 *
 * Un usuario cuenta como retenido en la semana N si tuvo actividad
 * significativa en esa semana. Las semanas que aún no terminaron quedan
 * incompletas por definición: la capa de UI las marca.
 */
export function weeklyRetention(
  firstActivity: ReadonlyMap<string, Date>,
  activity: readonly ActivityRow[],
  weeks = 4,
): CohortRetention[] {
  const cohorts = new Map<string, { users: Set<string>; start: number }>();
  for (const [userId, at] of firstActivity) {
    const key = weekKey(at);
    let cohort = cohorts.get(key);
    if (!cohort) {
      cohort = { users: new Set(), start: Date.parse(`${key}T00:00:00.000Z`) };
      cohorts.set(key, cohort);
    }
    cohort.users.add(userId);
  }

  // Semanas en las que cada usuario estuvo activo (offset respecto a su cohorte).
  const activeWeeks = new Map<string, Set<number>>();
  for (const row of activity) {
    const first = firstActivity.get(row.userId);
    if (!first) continue;
    const cohortStart = Date.parse(`${weekKey(first)}T00:00:00.000Z`);
    const offset = Math.floor((row.at.getTime() - cohortStart) / WEEK_MS);
    if (offset < 0) continue;
    let set = activeWeeks.get(row.userId);
    if (!set) {
      set = new Set();
      activeWeeks.set(row.userId, set);
    }
    set.add(offset);
  }

  return [...cohorts.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([cohort, { users }]) => ({
      cohort,
      size: users.size,
      returned: Array.from({ length: weeks }, (_, week) =>
        [...users].filter((u) => activeWeeks.get(u)?.has(week)).length,
      ),
    }));
}

// =====================================================================
//  Sesiones de estudio
// =====================================================================

export interface StudySessionRow {
  userId: string;
  surface: string;
  startedAt: Date;
  endedAt: Date | null;
  lastPingAt: Date;
  engagedMs: number;
}

export interface StudySessionSummary {
  sessions: number;
  users: number;
  /** Suma de tiempo activo aproximado. NO es tiempo de pared. */
  engagedMsTotal: number;
  medianEngagedMs: number;
  p90EngagedMs: number;
  /** Sesiones sin cerrar todavía (se miden hasta su último latido). */
  openSessions: number;
  /** Sesiones con 0 ms activos: se abrieron y nunca hubo interacción. */
  zeroEngagementSessions: number;
}

export function summarizeStudySessions(
  rows: readonly StudySessionRow[],
): StudySessionSummary {
  const engaged = rows.map((r) => r.engagedMs).sort((a, b) => a - b);
  return {
    sessions: rows.length,
    users: new Set(rows.map((r) => r.userId)).size,
    engagedMsTotal: engaged.reduce((sum, ms) => sum + ms, 0),
    medianEngagedMs: percentile(engaged, 0.5),
    p90EngagedMs: percentile(engaged, 0.9),
    openSessions: rows.filter((r) => r.endedAt === null).length,
    zeroEngagementSessions: rows.filter((r) => r.engagedMs === 0).length,
  };
}

/** Percentil por interpolación baja (índice truncado). Lista ya ordenada. */
export function percentile(sorted: readonly number[], q: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor(q * (sorted.length - 1))),
  );
  return sorted[index];
}

// =====================================================================
//  Funnel de lecciones y práctica
// =====================================================================

export interface FunnelInput {
  /** Usuarios distintos que abrieron el recurso (`*_view`). */
  viewers: readonly { resourceId: string; userId: string }[];
  /** Usuarios distintos que interactuaron (`*_engaged`). */
  engaged: readonly { resourceId: string; userId: string }[];
  /** Usuarios distintos que completaron (tabla de dominio, no eventos). */
  completed: readonly { resourceId: string; userId: string }[];
}

export interface FunnelRow {
  resourceId: string;
  viewers: number;
  engaged: number;
  completed: number;
  /** engaged / viewers */
  engagementRate: number;
  /** completed / viewers */
  completionRate: number;
  /** viewers que nunca interactuaron: abrieron y se fueron. */
  bouncedViewers: number;
  /** engaged que no completaron: empezaron y abandonaron. */
  abandonedAfterEngaging: number;
}

/**
 * Funnel con denominadores correctos: TODO se cuenta en usuarios distintos,
 * no en eventos. Abrir dos veces la misma lección no infla nada.
 *
 * Un usuario "completó" según la tabla de dominio (`UserLessonProgress` /
 * `UserPracticeCompletion`), no según un evento: el progreso académico no se
 * inventa desde analytics.
 */
export function computeFunnel(input: FunnelInput): FunnelRow[] {
  const viewers = groupUsers(input.viewers);
  const engaged = groupUsers(input.engaged);
  const completed = groupUsers(input.completed);

  const resourceIds = new Set([
    ...viewers.keys(),
    ...engaged.keys(),
    ...completed.keys(),
  ]);

  return [...resourceIds]
    .map((resourceId) => {
      const v = viewers.get(resourceId) ?? new Set<string>();
      const e = engaged.get(resourceId) ?? new Set<string>();
      const c = completed.get(resourceId) ?? new Set<string>();
      return {
        resourceId,
        viewers: v.size,
        engaged: e.size,
        completed: c.size,
        engagementRate: ratio(e.size, v.size),
        completionRate: ratio(c.size, v.size),
        bouncedViewers: [...v].filter((u) => !e.has(u)).length,
        abandonedAfterEngaging: [...e].filter((u) => !c.has(u)).length,
      };
    })
    .sort((a, b) => b.viewers - a.viewers);
}

/**
 * Dónde se cae la gente dentro de una lección: por cada paso, cuántos
 * usuarios lo vieron y cuántos no llegaron al siguiente.
 */
export interface StepViewRow {
  lessonStepId: string;
  userId: string;
  stepIndex: number;
}

export interface StepDropoffRow {
  lessonStepId: string;
  stepIndex: number;
  viewers: number;
  /** Usuarios que vieron este paso y ningún paso posterior. */
  droppedHere: number;
  dropRate: number;
}

export function computeStepDropoff(
  views: readonly StepViewRow[],
): StepDropoffRow[] {
  const maxIndexByUser = new Map<string, number>();
  for (const view of views) {
    const current = maxIndexByUser.get(view.userId);
    if (current === undefined || view.stepIndex > current) {
      maxIndexByUser.set(view.userId, view.stepIndex);
    }
  }

  const byStep = new Map<
    string,
    { stepIndex: number; viewers: Set<string>; dropped: Set<string> }
  >();
  for (const view of views) {
    let entry = byStep.get(view.lessonStepId);
    if (!entry) {
      entry = {
        stepIndex: view.stepIndex,
        viewers: new Set(),
        dropped: new Set(),
      };
      byStep.set(view.lessonStepId, entry);
    }
    entry.viewers.add(view.userId);
    if (maxIndexByUser.get(view.userId) === view.stepIndex) {
      entry.dropped.add(view.userId);
    }
  }

  return [...byStep.entries()]
    .map(([lessonStepId, entry]) => ({
      lessonStepId,
      stepIndex: entry.stepIndex,
      viewers: entry.viewers.size,
      droppedHere: entry.dropped.size,
      dropRate: ratio(entry.dropped.size, entry.viewers.size),
    }))
    .sort((a, b) => a.stepIndex - b.stepIndex);
}

// =====================================================================
//  Fricción por ejercicio
// =====================================================================

export interface AttemptRow {
  userId: string;
  exerciseId: string;
  passed: boolean;
  createdAt: Date;
}

export interface ExerciseFrictionRow {
  exerciseId: string;
  /** Usuarios con al menos un envío calificado. */
  users: number;
  /** Usuarios cuyo PRIMER envío pasó. */
  firstPassUsers: number;
  firstPassRate: number;
  /** Mediana de envíos hasta el primero aprobado (sólo quienes aprobaron). */
  medianAttemptsToPass: number;
  /** Usuarios que enviaron y nunca aprobaron en la ventana. */
  unsolvedUsers: number;
  totalAttempts: number;
}

/**
 * First-pass rate y envíos-hasta-aprobar por ejercicio.
 *
 * Ojo con la ventana: si un usuario ya había aprobado ANTES del rango, sus
 * envíos dentro del rango se ven como "no aprobó a la primera". La capa de
 * queries pide los intentos completos por usuario y ejercicio para evitarlo.
 */
export function computeExerciseFriction(
  attempts: readonly AttemptRow[],
): ExerciseFrictionRow[] {
  const byExercise = new Map<string, Map<string, AttemptRow[]>>();
  for (const attempt of attempts) {
    let users = byExercise.get(attempt.exerciseId);
    if (!users) {
      users = new Map();
      byExercise.set(attempt.exerciseId, users);
    }
    const list = users.get(attempt.userId);
    if (list) list.push(attempt);
    else users.set(attempt.userId, [attempt]);
  }

  const rows: ExerciseFrictionRow[] = [];
  for (const [exerciseId, users] of byExercise) {
    let firstPassUsers = 0;
    let unsolvedUsers = 0;
    let totalAttempts = 0;
    const attemptsToPass: number[] = [];

    for (const list of users.values()) {
      const ordered = [...list].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
      totalAttempts += ordered.length;
      const passIndex = ordered.findIndex((a) => a.passed);
      if (passIndex === -1) {
        unsolvedUsers++;
        continue;
      }
      if (passIndex === 0) firstPassUsers++;
      attemptsToPass.push(passIndex + 1);
    }

    attemptsToPass.sort((a, b) => a - b);
    rows.push({
      exerciseId,
      users: users.size,
      firstPassUsers,
      firstPassRate: ratio(firstPassUsers, users.size),
      medianAttemptsToPass: percentile(attemptsToPass, 0.5),
      unsolvedUsers,
      totalAttempts,
    });
  }

  return rows.sort((a, b) => a.firstPassRate - b.firstPassRate);
}

/**
 * Ranking de fricción: primero lo que más gente atora. Se exige un mínimo de
 * usuarios para no rankear ruido de una sola persona.
 */
export function rankFriction(
  rows: readonly ExerciseFrictionRow[],
  minUsers = 3,
): ExerciseFrictionRow[] {
  return rows
    .filter((r) => r.users >= minUsers)
    .sort((a, b) => {
      if (a.firstPassRate !== b.firstPassRate) {
        return a.firstPassRate - b.firstPassRate;
      }
      return b.medianAttemptsToPass - a.medianAttemptsToPass;
    });
}

// =====================================================================
//  Pistas
// =====================================================================

export interface HintViewRow {
  userId: string;
  exerciseId: string;
  hintIndex: number;
}

export interface HintUsageRow {
  exerciseId: string;
  /** Usuarios con al menos un envío (denominador). */
  users: number;
  usersWithHints: number;
  hintUsageRate: number;
  /** Promedio de pistas entre quienes usaron al menos una. */
  avgHintsWhenUsed: number;
  /** First-pass rate de quienes vieron pistas antes de aprobar. */
  firstPassRateWithHints: number;
  firstPassRateWithoutHints: number;
}

/**
 * Uso de pistas por ejercicio, cruzado con el resultado.
 *
 * Limitación honesta: `UserHintViewed` guarda una fila por pista (no una por
 * intento), así que "con pistas" significa "vio al menos una pista de este
 * ejercicio", no necesariamente antes de ese envío concreto.
 */
export function computeHintUsage(
  attempts: readonly AttemptRow[],
  hints: readonly HintViewRow[],
): HintUsageRow[] {
  const hintsByExercise = new Map<string, Map<string, number>>();
  for (const hint of hints) {
    let users = hintsByExercise.get(hint.exerciseId);
    if (!users) {
      users = new Map();
      hintsByExercise.set(hint.exerciseId, users);
    }
    users.set(hint.userId, (users.get(hint.userId) ?? 0) + 1);
  }

  const attemptsByExercise = new Map<string, Map<string, AttemptRow[]>>();
  for (const attempt of attempts) {
    let users = attemptsByExercise.get(attempt.exerciseId);
    if (!users) {
      users = new Map();
      attemptsByExercise.set(attempt.exerciseId, users);
    }
    const list = users.get(attempt.userId);
    if (list) list.push(attempt);
    else users.set(attempt.userId, [attempt]);
  }

  const exerciseIds = new Set([
    ...attemptsByExercise.keys(),
    ...hintsByExercise.keys(),
  ]);

  const rows: HintUsageRow[] = [];
  for (const exerciseId of exerciseIds) {
    const users = attemptsByExercise.get(exerciseId) ?? new Map();
    const hintUsers = hintsByExercise.get(exerciseId) ?? new Map();

    let withHints = 0;
    let firstPassWithHints = 0;
    let withoutHints = 0;
    let firstPassWithoutHints = 0;

    for (const [userId, list] of users) {
      const ordered = [...list].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
      const firstPass = ordered[0]?.passed === true;
      if (hintUsers.has(userId)) {
        withHints++;
        if (firstPass) firstPassWithHints++;
      } else {
        withoutHints++;
        if (firstPass) firstPassWithoutHints++;
      }
    }

    const hintCounts = [...hintUsers.values()];
    rows.push({
      exerciseId,
      users: users.size,
      usersWithHints: hintUsers.size,
      hintUsageRate: ratio(withHints, users.size),
      avgHintsWhenUsed:
        hintCounts.length === 0
          ? 0
          : hintCounts.reduce((a, b) => a + b, 0) / hintCounts.length,
      firstPassRateWithHints: ratio(firstPassWithHints, withHints),
      firstPassRateWithoutHints: ratio(firstPassWithoutHints, withoutHints),
    });
  }

  return rows.sort((a, b) => b.usersWithHints - a.usersWithHints);
}

// =====================================================================
//  Compilar → Calificar
// =====================================================================

export interface RunRow {
  userId: string;
  exerciseId: string;
  at: Date;
  outcome: string;
}

export interface RunToSubmitRow {
  exerciseId: string;
  runs: number;
  submissions: number;
  /** Usuarios que compilaron alguna vez. */
  usersWhoRan: number;
  /** Usuarios que compilaron y NUNCA enviaron a calificar. */
  usersWhoNeverSubmitted: number;
  /** Promedio de compilaciones antes del primer envío (de quien sí envió). */
  avgRunsBeforeFirstSubmit: number;
  /** runs / submissions. Alto = mucha prueba y error sin calificar. */
  runsPerSubmission: number;
}

export function computeRunToSubmit(
  runs: readonly RunRow[],
  attempts: readonly AttemptRow[],
): RunToSubmitRow[] {
  // Un solo agrupamiento por ejercicio → usuario. Nada de filtrar el arreglo
  // completo dentro del bucle (eso era O(ejercicios × filas)).
  const runsByExercise = new Map<string, Map<string, Date[]>>();
  for (const run of runs) {
    let users = runsByExercise.get(run.exerciseId);
    if (!users) {
      users = new Map();
      runsByExercise.set(run.exerciseId, users);
    }
    const list = users.get(run.userId);
    if (list) list.push(run.at);
    else users.set(run.userId, [run.at]);
  }

  const firstSubmitByExercise = new Map<string, Map<string, Date>>();
  const submissionCounts = new Map<string, number>();
  for (const attempt of attempts) {
    submissionCounts.set(
      attempt.exerciseId,
      (submissionCounts.get(attempt.exerciseId) ?? 0) + 1,
    );
    let users = firstSubmitByExercise.get(attempt.exerciseId);
    if (!users) {
      users = new Map();
      firstSubmitByExercise.set(attempt.exerciseId, users);
    }
    const current = users.get(attempt.userId);
    if (!current || attempt.createdAt < current) {
      users.set(attempt.userId, attempt.createdAt);
    }
  }

  const exerciseIds = new Set([
    ...runsByExercise.keys(),
    ...firstSubmitByExercise.keys(),
  ]);

  const rows: RunToSubmitRow[] = [];
  for (const exerciseId of exerciseIds) {
    const runUsers = runsByExercise.get(exerciseId) ?? new Map<string, Date[]>();
    const submitUsers =
      firstSubmitByExercise.get(exerciseId) ?? new Map<string, Date>();

    let runCount = 0;
    for (const list of runUsers.values()) runCount += list.length;

    const runsBefore: number[] = [];
    for (const [userId, firstSubmit] of submitUsers) {
      const userRuns = runUsers.get(userId) ?? [];
      runsBefore.push(userRuns.filter((at) => at < firstSubmit).length);
    }

    const submissions = submissionCounts.get(exerciseId) ?? 0;
    rows.push({
      exerciseId,
      runs: runCount,
      submissions,
      usersWhoRan: runUsers.size,
      usersWhoNeverSubmitted: [...runUsers.keys()].filter(
        (u) => !submitUsers.has(u),
      ).length,
      avgRunsBeforeFirstSubmit:
        runsBefore.length === 0
          ? 0
          : runsBefore.reduce((a, b) => a + b, 0) / runsBefore.length,
      runsPerSubmission: ratio(runCount, submissions),
    });
  }

  return rows.sort((a, b) => b.runs - a.runs);
}

/** Errores de compilación más frecuentes, por categoría. */
export function countByCategory(
  runs: readonly { outcome: string; errorCategory?: string | null }[],
): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const run of runs) {
    if (run.outcome !== "compile_error") continue;
    const key = run.errorCategory ?? "other_compile_error";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// =====================================================================
//  Utilidades
// =====================================================================

/** División segura: 0 cuando no hay denominador (no NaN, no Infinity). */
export function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}

function groupUsers(
  rows: readonly { resourceId: string; userId: string }[],
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    let set = map.get(row.resourceId);
    if (!set) {
      set = new Set();
      map.set(row.resourceId, set);
    }
    set.add(row.userId);
  }
  return map;
}
