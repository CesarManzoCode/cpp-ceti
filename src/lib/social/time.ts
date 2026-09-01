/**
 * Modelo de tiempo social — ÚNICO para todo lo social (Friend Streaks,
 * ranking semanal, ligas, quests).
 *
 * Zona: America/Mexico_City (IANA — nunca hardcodear un offset como
 * "-06:00": México abolió el horario de verano en 2022, pero resolver la
 * zona vía Intl es correcto sin importar cambios futuros de política).
 *
 * Día social:   [00:00 local, 00:00 local del día siguiente)
 * Semana social: lunes 00:00 local → lunes siguiente 00:00 local
 *
 * Todo instante persistido es UTC (`DateTime`); las etiquetas de día usan
 * columnas `DATE` de Postgres, que Prisma mapea a un `Date` de JS en
 * medianoche UTC (sin conversión de zona) — ver `mxDateOnly`.
 */

export const SOCIAL_TIME_ZONE = "America/Mexico_City";

interface TzParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function partsInTz(date: Date, timeZone: string): TzParts {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour === "24" ? "0" : map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

/** Offset (ms) tal que `UTC-interpretado-como-wall-clock - offset = instante real`. */
function offsetMsAt(date: Date, timeZone: string): number {
  const p = partsInTz(date, timeZone);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUTC - date.getTime();
}

/** Normaliza year/month/day que se salieron de rango (ej. day=32) usando aritmética UTC. */
function normalizeYmd(
  year: number,
  month: number,
  day: number,
): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Instante UTC de las 00:00:00 locales de un Y-M-D dado, resuelto correctamente ante DST. */
function localMidnightUtc(year: number, month: number, day: number, timeZone: string): Date {
  const { year: y, month: m, day: d } = normalizeYmd(year, month, day);
  // Mediodía como sonda: nunca cae en la transición de DST (evita ambigüedad).
  const noonGuess = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const guessOffset = offsetMsAt(noonGuess, timeZone);
  let candidate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - guessOffset);
  const refinedOffset = offsetMsAt(candidate, timeZone);
  if (refinedOffset !== guessOffset) {
    candidate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - refinedOffset);
  }
  return candidate;
}

/** Clave de día local "YYYY-MM-DD" (para logs/dedupe legible, no para columnas DATE). */
export function mxDayKey(date: Date): string {
  const p = partsInTz(date, SOCIAL_TIME_ZONE);
  return `${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/**
 * Representa el día calendario local de `date` como un `Date` a medianoche
 * UTC — la forma en que Prisma serializa/lee una columna `@db.Date`. Úsalo
 * SIEMPRE al escribir o comparar contra `FriendStreakDay.day`,
 * `FriendStreak.lastQualifiedDay`, `FriendQuest.weekStart`, etc.
 */
export function mxDateOnly(date: Date): Date {
  const p = partsInTz(date, SOCIAL_TIME_ZONE);
  return new Date(Date.UTC(p.year, p.month - 1, p.day));
}

/** Día calendario siguiente/anterior de un valor `DATE` (medianoche UTC). */
export function shiftDateOnly(dateOnly: Date, deltaDays: number): Date {
  return new Date(dateOnly.getTime() + deltaDays * 86_400_000);
}

/** true si `b` es exactamente el día calendario siguiente a `a` (ambos DATE-only). */
export function isNextDateOnly(a: Date, b: Date): boolean {
  return shiftDateOnly(a, 1).getTime() === b.getTime();
}

/** [inicio, fin) del día social en UTC que contiene `date`. */
export function mxDayRange(date: Date): { start: Date; end: Date } {
  const p = partsInTz(date, SOCIAL_TIME_ZONE);
  const start = localMidnightUtc(p.year, p.month, p.day, SOCIAL_TIME_ZONE);
  const next = normalizeYmd(p.year, p.month, p.day + 1);
  const end = localMidnightUtc(next.year, next.month, next.day, SOCIAL_TIME_ZONE);
  return { start, end };
}

/** [inicio, fin) de la semana social (lunes→lunes) en UTC que contiene `date`. */
export function mxWeekRange(date: Date): { start: Date; end: Date } {
  const p = partsInTz(date, SOCIAL_TIME_ZONE);
  // Día de la semana local vía una sonda a mediodía UTC del mismo Y-M-D
  // (evita que un borde de zona horaria mueva el día calendario).
  const weekdayProbe = new Date(Date.UTC(p.year, p.month - 1, p.day, 12));
  const isoDow = weekdayProbe.getUTCDay(); // 0=domingo..6=sábado
  const daysSinceMonday = (isoDow + 6) % 7; // lunes=0
  const monday = normalizeYmd(p.year, p.month, p.day - daysSinceMonday);
  const start = localMidnightUtc(monday.year, monday.month, monday.day, SOCIAL_TIME_ZONE);
  const nextMonday = normalizeYmd(monday.year, monday.month, monday.day + 7);
  const end = localMidnightUtc(nextMonday.year, nextMonday.month, nextMonday.day, SOCIAL_TIME_ZONE);
  return { start, end };
}

/** Clave estable de semana ("YYYY-MM-DD" del lunes) — usada como `weekStart`/`key`. */
export function mxWeekKey(date: Date): string {
  const { start } = mxWeekRange(date);
  return mxDayKey(start);
}

/** El lunes de la semana social que contiene `date`, como valor DATE-only. */
export function mxWeekStartDateOnly(date: Date): Date {
  const { start } = mxWeekRange(date);
  return mxDateOnly(start);
}

/**
 * [inicio, fin) en UTC del día social que representa un valor DATE-only
 * (ej. `FriendStreakDay.day`, `FriendStreak.lastQualifiedDay`). El Y-M-D
 * UTC de `dateOnly` ES el día calendario (por construcción de
 * `mxDateOnly`), así que sólo hace falta resolver la medianoche local de
 * ESE Y-M-D — sin volver a pasar por `date.getTime()`.
 */
export function mxDayRangeForDateOnly(dateOnly: Date): { start: Date; end: Date } {
  const y = dateOnly.getUTCFullYear();
  const m = dateOnly.getUTCMonth() + 1;
  const d = dateOnly.getUTCDate();
  const start = localMidnightUtc(y, m, d, SOCIAL_TIME_ZONE);
  const next = normalizeYmd(y, m, d + 1);
  const end = localMidnightUtc(next.year, next.month, next.day, SOCIAL_TIME_ZONE);
  return { start, end };
}

/** El día calendario local de "ahora mismo", como valor DATE-only. */
export function mxToday(): Date {
  return mxDateOnly(new Date());
}

/** El día calendario local inmediatamente anterior a `dateOnly`. */
export function mxYesterdayOf(dateOnly: Date): Date {
  return shiftDateOnly(dateOnly, -1);
}
