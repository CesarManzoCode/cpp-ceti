import type { ProductEventName } from "@prisma/client";

import { db } from "@/lib/db";

import {
  activeUsersByDay,
  computeExerciseFriction,
  computeFunnel,
  computeHintUsage,
  computeRunToSubmit,
  computeStepDropoff,
  countActiveUsers,
  countByCategory,
  firstActivityByUser,
  rankFriction,
  summarizeStudySessions,
  weeklyRetention,
  type ActivityRow,
  type AttemptRow,
  type CohortRetention,
  type ExerciseFrictionRow,
  type FunnelRow,
  type HintUsageRow,
  type RunToSubmitRow,
  type StepDropoffRow,
  type StudySessionSummary,
} from "./metrics";

/**
 * Capa de consulta del panel interno.
 *
 * Estrategia: traer filas ACOTADAS POR VENTANA con `select` mínimo y agregar
 * en `metrics.ts` (funciones puras y probadas). A la escala de un plantel del
 * CETI eso es más simple y mucho más testeable que SQL a mano; `MAX_ROWS`
 * evita que una ventana enorme se coma la memoria. OJO: al alcanzar el tope
 * el resultado queda truncado SIN aviso — está documentado como limitación
 * conocida en `docs/product-analytics.md`; si el plantel crece hasta ahí, hay
 * que mover estas agregaciones a SQL.
 *
 * Nada aquí hace N+1: los títulos se resuelven con UNA consulta por conjunto
 * de ids, nunca dentro de un bucle.
 */

/** Tope de filas por consulta. Si se alcanza, la métrica está truncada. */
export const MAX_ROWS = 50_000;

export interface AnalyticsRange {
  from: Date;
  to: Date;
}

/** Ventana relativa en días, alineada al momento actual. */
export function rangeFromDays(days: number, now = new Date()): AnalyticsRange {
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to: now };
}

/**
 * Eventos que cuentan como ACTIVIDAD SIGNIFICATIVA.
 * Abrir una lección (`lesson_view`) NO cuenta: mirar no es usar.
 */
export const ACTIVE_EVENT_NAMES: ProductEventName[] = [
  "lesson_engaged",
  "practice_engaged",
  "lesson_step_attempt",
  "lesson_step_answer_revealed",
  "code_run",
];

/**
 * Filas de actividad significativa: eventos de producto "de uso" + envíos
 * calificados (que viven en las tablas de dominio y no se duplican como
 * eventos).
 */
async function fetchActivity(range: AnalyticsRange): Promise<ActivityRow[]> {
  const [events, exerciseAttempts, practiceAttempts] = await Promise.all([
    db.productEvent.findMany({
      where: {
        name: { in: ACTIVE_EVENT_NAMES },
        occurredAt: { gte: range.from, lte: range.to },
      },
      select: { userId: true, occurredAt: true },
      take: MAX_ROWS,
    }),
    db.userExerciseAttempt.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { userId: true, createdAt: true },
      take: MAX_ROWS,
    }),
    db.userPracticeAttempt.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { userId: true, createdAt: true },
      take: MAX_ROWS,
    }),
  ]);

  return [
    ...events.map((e) => ({ userId: e.userId, at: e.occurredAt })),
    ...exerciseAttempts.map((a) => ({ userId: a.userId, at: a.createdAt })),
    ...practiceAttempts.map((a) => ({ userId: a.userId, at: a.createdAt })),
  ];
}

export interface OverviewMetrics {
  range: AnalyticsRange;
  activeUsers: number;
  activeByDay: { day: string; users: number }[];
  /** Usuarios registrados dentro de la ventana. */
  newUsers: number;
  /** Usuarios cuya PRIMERA actividad significativa cayó en la ventana. */
  newlyActiveUsers: number;
  /** Usuarios registrados en la ventana que nunca hicieron nada. */
  registeredWithoutActivity: number;
  sessions: StudySessionSummary;
  openBugReports: number;
  openFeedback: number;
}

export async function getOverview(
  range: AnalyticsRange,
): Promise<OverviewMetrics> {
  const [activity, allTimeActivity, newUserRows, sessions, bugs, feedback] =
    await Promise.all([
      fetchActivity(range),
      fetchActivityForFirstTouch(range.to),
      db.user.findMany({
        where: { createdAt: { gte: range.from, lte: range.to } },
        select: { id: true },
        take: MAX_ROWS,
      }),
      db.studySession.findMany({
        where: { startedAt: { gte: range.from, lte: range.to } },
        select: {
          userId: true,
          surface: true,
          startedAt: true,
          endedAt: true,
          lastPingAt: true,
          engagedMs: true,
        },
        take: MAX_ROWS,
      }),
      db.bugReport.count({ where: { status: { in: ["open", "triaged"] } } }),
      db.feedback.count({ where: { status: { in: ["open", "triaged"] } } }),
    ]);

  const firstTouch = firstActivityByUser(allTimeActivity);
  const newUserIds = new Set(newUserRows.map((u) => u.id));

  let newlyActiveUsers = 0;
  for (const at of firstTouch.values()) {
    if (at >= range.from && at <= range.to) newlyActiveUsers++;
  }

  let registeredWithoutActivity = 0;
  for (const id of newUserIds) {
    if (!firstTouch.has(id)) registeredWithoutActivity++;
  }

  return {
    range,
    activeUsers: countActiveUsers(activity),
    activeByDay: activeUsersByDay(activity),
    newUsers: newUserIds.size,
    newlyActiveUsers,
    registeredWithoutActivity,
    sessions: summarizeStudySessions(sessions),
    openBugReports: bugs,
    openFeedback: feedback,
  };
}

/** Actividad histórica (hasta `to`) para ubicar la primera vez de cada quien. */
async function fetchActivityForFirstTouch(to: Date): Promise<ActivityRow[]> {
  const [events, exerciseAttempts, practiceAttempts] = await Promise.all([
    db.productEvent.findMany({
      where: { name: { in: ACTIVE_EVENT_NAMES }, occurredAt: { lte: to } },
      select: { userId: true, occurredAt: true },
      orderBy: { occurredAt: "asc" },
      take: MAX_ROWS,
    }),
    db.userExerciseAttempt.findMany({
      where: { createdAt: { lte: to } },
      select: { userId: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: MAX_ROWS,
    }),
    db.userPracticeAttempt.findMany({
      where: { createdAt: { lte: to } },
      select: { userId: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: MAX_ROWS,
    }),
  ]);
  return [
    ...events.map((e) => ({ userId: e.userId, at: e.occurredAt })),
    ...exerciseAttempts.map((a) => ({ userId: a.userId, at: a.createdAt })),
    ...practiceAttempts.map((a) => ({ userId: a.userId, at: a.createdAt })),
  ];
}

/**
 * Retención por cohorte de primera actividad. Usa TODO el histórico hasta
 * `to`: una cohorte se define por cuándo empezó la persona, no por la ventana
 * que esté mirando el dashboard.
 */
export async function getRetention(
  to: Date,
  weeks = 4,
): Promise<CohortRetention[]> {
  const activity = await fetchActivityForFirstTouch(to);
  return weeklyRetention(firstActivityByUser(activity), activity, weeks);
}

export interface NamedFunnelRow extends FunnelRow {
  title: string;
  href: string | null;
}

/** Funnel de lecciones: abrió → interactuó → completó. */
export async function getLessonFunnel(
  range: AnalyticsRange,
): Promise<NamedFunnelRow[]> {
  const [views, engaged, completions] = await Promise.all([
    db.productEvent.findMany({
      where: {
        name: "lesson_view",
        occurredAt: { gte: range.from, lte: range.to },
        lessonId: { not: null },
      },
      select: { userId: true, lessonId: true },
      take: MAX_ROWS,
    }),
    db.productEvent.findMany({
      where: {
        name: "lesson_engaged",
        occurredAt: { gte: range.from, lte: range.to },
        lessonId: { not: null },
      },
      select: { userId: true, lessonId: true },
      take: MAX_ROWS,
    }),
    db.userLessonProgress.findMany({
      where: {
        status: "completed",
        completedAt: { gte: range.from, lte: range.to },
      },
      select: { userId: true, lessonId: true },
      take: MAX_ROWS,
    }),
  ]);

  const rows = computeFunnel({
    viewers: views.map((v) => ({ userId: v.userId, resourceId: v.lessonId! })),
    engaged: engaged.map((v) => ({
      userId: v.userId,
      resourceId: v.lessonId!,
    })),
    completed: completions.map((c) => ({
      userId: c.userId,
      resourceId: c.lessonId,
    })),
  });

  // Un solo SELECT para todos los títulos (nada de una consulta por fila).
  const lessons = await db.lesson.findMany({
    where: { id: { in: rows.map((r) => r.resourceId) } },
    select: { id: true, title: true, slug: true, unit: { select: { slug: true } } },
  });
  const byId = new Map(lessons.map((l) => [l.id, l]));

  return rows.map((row) => {
    const lesson = byId.get(row.resourceId);
    return {
      ...row,
      title: lesson?.title ?? row.resourceId,
      href: lesson ? `/app/u/${lesson.unit.slug}/${lesson.slug}` : null,
    };
  });
}

/** Funnel de práctica: abrió → interactuó → aprobó. */
export async function getPracticeFunnel(
  range: AnalyticsRange,
): Promise<NamedFunnelRow[]> {
  const [views, engaged, completions] = await Promise.all([
    db.productEvent.findMany({
      where: {
        name: "practice_view",
        occurredAt: { gte: range.from, lte: range.to },
        practiceExerciseId: { not: null },
      },
      select: { userId: true, practiceExerciseId: true },
      take: MAX_ROWS,
    }),
    db.productEvent.findMany({
      where: {
        name: "practice_engaged",
        occurredAt: { gte: range.from, lte: range.to },
        practiceExerciseId: { not: null },
      },
      select: { userId: true, practiceExerciseId: true },
      take: MAX_ROWS,
    }),
    db.userPracticeCompletion.findMany({
      where: { completedAt: { gte: range.from, lte: range.to } },
      select: { userId: true, exerciseId: true },
      take: MAX_ROWS,
    }),
  ]);

  const rows = computeFunnel({
    viewers: views.map((v) => ({
      userId: v.userId,
      resourceId: v.practiceExerciseId!,
    })),
    engaged: engaged.map((v) => ({
      userId: v.userId,
      resourceId: v.practiceExerciseId!,
    })),
    completed: completions.map((c) => ({
      userId: c.userId,
      resourceId: c.exerciseId,
    })),
  });

  const exercises = await db.practiceExercise.findMany({
    where: { id: { in: rows.map((r) => r.resourceId) } },
    select: { id: true, title: true, slug: true },
  });
  const byId = new Map(exercises.map((e) => [e.id, e]));

  return rows.map((row) => {
    const exercise = byId.get(row.resourceId);
    return {
      ...row,
      title: exercise?.title ?? row.resourceId,
      href: exercise ? `/app/ejercicios/${exercise.slug}` : null,
    };
  });
}

export interface NamedStepDropoffRow extends StepDropoffRow {
  stepType: string;
}

/** Dónde abandona la gente DENTRO de una lección. */
export async function getLessonStepDropoff(
  lessonId: string,
  range: AnalyticsRange,
): Promise<NamedStepDropoffRow[]> {
  const views = await db.productEvent.findMany({
    where: {
      name: "lesson_step_view",
      lessonId,
      occurredAt: { gte: range.from, lte: range.to },
      lessonStepId: { not: null },
    },
    select: { userId: true, lessonStepId: true, props: true },
    take: MAX_ROWS,
  });

  const rows = computeStepDropoff(
    views.map((v) => ({
      userId: v.userId,
      lessonStepId: v.lessonStepId!,
      stepIndex: readNumberProp(v.props, "stepIndex"),
    })),
  );

  const steps = await db.lessonStep.findMany({
    where: { id: { in: rows.map((r) => r.lessonStepId) } },
    select: { id: true, type: true },
  });
  const typeById = new Map(steps.map((s) => [s.id, s.type as string]));

  return rows.map((row) => ({
    ...row,
    stepType: typeById.get(row.lessonStepId) ?? "?",
  }));
}

export interface FrictionReport {
  lessonExercises: (ExerciseFrictionRow & { label: string })[];
  practiceExercises: (ExerciseFrictionRow & { label: string })[];
}

/**
 * Fricción por ejercicio.
 *
 * Ojo con la ventana: se seleccionan los ejercicios con envíos DENTRO del
 * rango, pero el first-pass rate se calcula sobre el historial completo de
 * cada (usuario, ejercicio) hasta `to`. Si no, un alumno que ya lo había
 * aprobado antes contaría como "no lo logró a la primera".
 */
export async function getFriction(
  range: AnalyticsRange,
  limit = 10,
): Promise<FrictionReport> {
  const [lessonAttempts, practiceAttempts] = await Promise.all([
    fetchLessonAttemptHistory(range),
    fetchPracticeAttemptHistory(range),
  ]);

  const lessonRows = rankFriction(computeExerciseFriction(lessonAttempts)).slice(
    0,
    limit,
  );
  const practiceRows = rankFriction(
    computeExerciseFriction(practiceAttempts),
  ).slice(0, limit);

  const [lessonLabels, practiceLabels] = await Promise.all([
    labelLessonExercises(lessonRows.map((r) => r.exerciseId)),
    labelPracticeExercises(practiceRows.map((r) => r.exerciseId)),
  ]);

  return {
    lessonExercises: lessonRows.map((row) => ({
      ...row,
      label: lessonLabels.get(row.exerciseId) ?? row.exerciseId,
    })),
    practiceExercises: practiceRows.map((row) => ({
      ...row,
      label: practiceLabels.get(row.exerciseId) ?? row.exerciseId,
    })),
  };
}

export interface HintReport {
  lesson: (HintUsageRow & { label: string })[];
  practice: (HintUsageRow & { label: string })[];
}

/** Uso de pistas cruzado con el resultado del primer envío. */
export async function getHintUsage(
  range: AnalyticsRange,
  limit = 10,
): Promise<HintReport> {
  const hints = await db.userHintViewed.findMany({
    where: { viewedAt: { gte: range.from, lte: range.to } },
    select: {
      userId: true,
      hintIndex: true,
      exerciseId: true,
      practiceExerciseId: true,
    },
    take: MAX_ROWS,
  });

  // MISMO criterio que `getFriction`: historial completo hasta `to` de los
  // ejercicios activos en la ventana. Si aquí usáramos sólo los intentos de
  // la ventana, "first-pass" significaría dos cosas distintas en dos tablas
  // del mismo panel.
  const [lessonAttempts, practiceAttempts] = await Promise.all([
    fetchLessonAttemptHistory(range),
    fetchPracticeAttemptHistory(range),
  ]);

  const lessonHints = hints
    .filter((h) => h.exerciseId)
    .map((h) => ({
      userId: h.userId,
      exerciseId: h.exerciseId as string,
      hintIndex: h.hintIndex,
    }));
  const practiceHints = hints
    .filter((h) => h.practiceExerciseId)
    .map((h) => ({
      userId: h.userId,
      exerciseId: h.practiceExerciseId as string,
      hintIndex: h.hintIndex,
    }));

  const lessonRows = computeHintUsage(lessonAttempts, lessonHints).slice(
    0,
    limit,
  );
  const practiceRows = computeHintUsage(practiceAttempts, practiceHints).slice(
    0,
    limit,
  );

  const [lessonLabels, practiceLabels] = await Promise.all([
    labelLessonExercises(lessonRows.map((r) => r.exerciseId)),
    labelPracticeExercises(practiceRows.map((r) => r.exerciseId)),
  ]);

  return {
    lesson: lessonRows.map((row) => ({
      ...row,
      label: lessonLabels.get(row.exerciseId) ?? row.exerciseId,
    })),
    practice: practiceRows.map((row) => ({
      ...row,
      label: practiceLabels.get(row.exerciseId) ?? row.exerciseId,
    })),
  };
}

export interface RunReport {
  lesson: (RunToSubmitRow & { label: string })[];
  practice: (RunToSubmitRow & { label: string })[];
  compileErrors: { category: string; count: number }[];
  totalRuns: number;
}

/** Compilar sin calificar: relación run → submit y errores frecuentes. */
export async function getRunReport(
  range: AnalyticsRange,
  limit = 10,
): Promise<RunReport> {
  const [runs, lessonAttempts, practiceAttempts] = await Promise.all([
    db.productEvent.findMany({
      where: {
        name: "code_run",
        occurredAt: { gte: range.from, lte: range.to },
      },
      select: {
        userId: true,
        exerciseId: true,
        practiceExerciseId: true,
        occurredAt: true,
        props: true,
      },
      take: MAX_ROWS,
    }),
    db.userExerciseAttempt.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { userId: true, exerciseId: true, passed: true, createdAt: true },
      take: MAX_ROWS,
    }),
    db.userPracticeAttempt.findMany({
      where: { createdAt: { gte: range.from, lte: range.to } },
      select: { userId: true, exerciseId: true, passed: true, createdAt: true },
      take: MAX_ROWS,
    }),
  ]);

  const lessonRuns = runs
    .filter((r) => r.exerciseId)
    .map((r) => ({
      userId: r.userId,
      exerciseId: r.exerciseId as string,
      at: r.occurredAt,
      outcome: readStringProp(r.props, "outcome"),
    }));
  const practiceRuns = runs
    .filter((r) => r.practiceExerciseId)
    .map((r) => ({
      userId: r.userId,
      exerciseId: r.practiceExerciseId as string,
      at: r.occurredAt,
      outcome: readStringProp(r.props, "outcome"),
    }));

  const lessonRows = computeRunToSubmit(lessonRuns, lessonAttempts).slice(
    0,
    limit,
  );
  const practiceRows = computeRunToSubmit(practiceRuns, practiceAttempts).slice(
    0,
    limit,
  );

  const [lessonLabels, practiceLabels] = await Promise.all([
    labelLessonExercises(lessonRows.map((r) => r.exerciseId)),
    labelPracticeExercises(practiceRows.map((r) => r.exerciseId)),
  ]);

  return {
    lesson: lessonRows.map((row) => ({
      ...row,
      label: lessonLabels.get(row.exerciseId) ?? row.exerciseId,
    })),
    practice: practiceRows.map((row) => ({
      ...row,
      label: practiceLabels.get(row.exerciseId) ?? row.exerciseId,
    })),
    compileErrors: countByCategory(
      runs.map((r) => ({
        outcome: readStringProp(r.props, "outcome"),
        errorCategory: readStringProp(r.props, "errorCategory") || null,
      })),
    ),
    totalRuns: runs.length,
  };
}

/**
 * Historial COMPLETO (hasta `to`) de los ejercicios de lección con envíos
 * dentro de la ventana. Dos consultas fijas, sin N+1: primero los ids
 * activos, luego sus intentos.
 *
 * Por qué el historial completo y no sólo la ventana: si un alumno ya había
 * aprobado el ejercicio la semana pasada, sus envíos de esta semana lo harían
 * aparecer como "no lo logró a la primera".
 */
async function fetchLessonAttemptHistory(
  range: AnalyticsRange,
): Promise<AttemptRow[]> {
  const active = await db.userExerciseAttempt.findMany({
    where: { createdAt: { gte: range.from, lte: range.to } },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
    take: 500,
  });
  const ids = active.map((a) => a.exerciseId);
  if (ids.length === 0) return [];
  return db.userExerciseAttempt.findMany({
    where: { exerciseId: { in: ids }, createdAt: { lte: range.to } },
    select: { userId: true, exerciseId: true, passed: true, createdAt: true },
    take: MAX_ROWS,
  });
}

/** Análogo para práctica. Ver `fetchLessonAttemptHistory`. */
async function fetchPracticeAttemptHistory(
  range: AnalyticsRange,
): Promise<AttemptRow[]> {
  const active = await db.userPracticeAttempt.findMany({
    where: { createdAt: { gte: range.from, lte: range.to } },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
    take: 500,
  });
  const ids = active.map((a) => a.exerciseId);
  if (ids.length === 0) return [];
  return db.userPracticeAttempt.findMany({
    where: { exerciseId: { in: ids }, createdAt: { lte: range.to } },
    select: { userId: true, exerciseId: true, passed: true, createdAt: true },
    take: MAX_ROWS,
  });
}

// =====================================================================
//  Etiquetas (una consulta por conjunto de ids — nunca dentro de un bucle)
// =====================================================================

async function labelLessonExercises(
  ids: readonly string[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const exercises = await db.exercise.findMany({
    where: { id: { in: [...ids] } },
    select: {
      id: true,
      step: {
        select: { order: true, lesson: { select: { title: true } } },
      },
    },
  });
  return new Map(
    exercises.map((e) => [
      e.id,
      `${e.step.lesson.title} · paso ${e.step.order}`,
    ]),
  );
}

async function labelPracticeExercises(
  ids: readonly string[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const exercises = await db.practiceExercise.findMany({
    where: { id: { in: [...ids] } },
    select: { id: true, title: true },
  });
  return new Map(exercises.map((e) => [e.id, e.title]));
}

function readNumberProp(props: unknown, key: string): number {
  if (props && typeof props === "object" && key in props) {
    const value = (props as Record<string, unknown>)[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return 0;
}

function readStringProp(props: unknown, key: string): string {
  if (props && typeof props === "object" && key in props) {
    const value = (props as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
  }
  return "";
}

export type { AttemptRow };
