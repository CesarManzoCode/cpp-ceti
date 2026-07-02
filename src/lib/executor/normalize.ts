/**
 * Normaliza output para comparación: convierte CRLF a LF, hace trim de
 * espacios al final de cada línea, y trim del output completo.
 * Esto evita falsos negativos por `endl` vs `\n` o espacios trailing.
 *
 * Única fuente de verdad de la calificación: la usan TODOS los executors
 * y también la UI de resultados, para que el diff que ve el alumno
 * coincida exactamente con lo que comparó el servidor.
 */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
