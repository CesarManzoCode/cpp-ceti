// =====================================================================
// Helpers de formato para agrupaciones curriculares (CurriculumSection).
//
// Puramente de presentación: no consultan la base ni conocen el resto
// del dominio. `semester` no es identidad — sólo un número que se lee en
// español.
// =====================================================================

/**
 * Formatea un número de semestre en español de México.
 *
 * 1 → "1.er semestre", 2 → "2.º semestre", 3 → "3.er semestre",
 * 4 → "4.º semestre". Cualquier otro entero positivo usa el ordinal
 * genérico `${n}.º semestre`.
 */
export function formatSemester(n: number): string {
  switch (n) {
    case 1:
      return "1.er semestre";
    case 2:
      return "2.º semestre";
    case 3:
      return "3.er semestre";
    case 4:
      return "4.º semestre";
    default:
      return `${n}.º semestre`;
  }
}

/**
 * Resume una lista de semestres en una sola línea legible.
 *
 * `[]` → `null` (nada que resumir). Un único semestre usa
 * `formatSemester`. Dos o más se unen con la unión española natural:
 * "Semestres 1 y 2", "Semestres 1, 2 y 3".
 *
 * Deduplica preservando la PRIMERA aparición de cada semestre — nunca
 * ordena: el orden de entrada es el orden curricular declarado por el
 * curso, y reordenarlo aquí lo falsearía.
 */
export function formatSemesterSummary(semesters: number[]): string | null {
  const deduped: number[] = [];
  const seen = new Set<number>();
  for (const semester of semesters) {
    if (!seen.has(semester)) {
      seen.add(semester);
      deduped.push(semester);
    }
  }

  if (deduped.length === 0) return null;
  if (deduped.length === 1) return formatSemester(deduped[0]);

  const labels = deduped.map(String);
  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1);
  return `Semestres ${rest.join(", ")} y ${last}`;
}
