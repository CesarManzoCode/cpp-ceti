import { createHash } from "node:crypto";

/**
 * Revisión de contenido = hash corto y estable de lo que el alumno tiene
 * enfrente.
 *
 * Para qué sirve: dentro de dos años queremos poder decir "cambiamos esta
 * explicación / este test / esta pista y el comportamiento mejoró". Comparar
 * intentos de antes y después de un cambio SIN saber que pertenecen a
 * revisiones distintas no es evidencia, es ruido. Cada intento y cada evento
 * guardan la revisión vigente en ese momento, y `content_revision` registra
 * cuándo apareció cada una (la ventana temporal del before/after).
 *
 * Deliberadamente NO es un CMS: no versiona el contenido ni permite volver
 * atrás. Sólo identifica "esto ya no es lo mismo que antes".
 */

/** Longitud del hash truncado. 12 hex = 48 bits: suficiente para no colisionar. */
const REVISION_LENGTH = 12;

/**
 * Serialización canónica: ordena las claves de los objetos recursivamente
 * para que el hash NO dependa del orden en que se escribió el literal en
 * `prisma/content/*.ts`. Reordenar campos no debe inventar una revisión nueva.
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(sortDeep(value));
}

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return Object.fromEntries(entries.map(([k, v]) => [k, sortDeep(v)]));
  }
  return value;
}

/** Hash corto y determinista del contenido dado. */
export function contentRevision(value: unknown): string {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex")
    .slice(0, REVISION_LENGTH);
}
