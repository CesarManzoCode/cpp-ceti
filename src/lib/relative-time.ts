/**
 * Tiempo relativo en es-MX con cortes razonables para feeds y listas.
 * Usa `Intl.RelativeTimeFormat` para localización correcta de plurales.
 *
 * Cortes:
 *  < 1 min  → "hace un momento"
 *  < 1 h    → "hace N min"
 *  < 1 día  → "hace N h"
 *  < 7 días → "hace N días"
 *  resto    → fecha absoluta corta ("5 mar", "10 jul 2025")
 */
const rtf = new Intl.RelativeTimeFormat("es-MX", { numeric: "auto" });
const shortDate = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});
const longDate = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function relativeFromNow(when: Date | string | number): string {
  const date = when instanceof Date ? when : new Date(when);
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  if (absSec < 60) return "hace un momento";
  if (absSec < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (absSec < 86_400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (absSec < 7 * 86_400) return rtf.format(Math.round(diffSec / 86_400), "day");

  const sameYear = date.getFullYear() === new Date().getFullYear();
  return sameYear ? shortDate.format(date) : longDate.format(date);
}
