/** Máximo de caracteres de un grupo académico (ej. "3A", "MATUTINO-2"). */
export const ACADEMIC_GROUP_MAX = 20;

/**
 * Normaliza un grupo: trim, colapsa espacios internos, uppercase, recorta a
 * `ACADEMIC_GROUP_MAX`. Cadena vacía tras normalizar → `null` (se limpia).
 */
export function normalizeAcademicGroup(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const collapsed = raw.trim().replace(/\s+/g, " ").toUpperCase();
  if (collapsed.length === 0) return null;
  return collapsed.slice(0, ACADEMIC_GROUP_MAX);
}
