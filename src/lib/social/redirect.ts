/**
 * Sanea un `redirectTo` que llega como query param (login, registro,
 * invitar) para que sólo pueda apuntar a un path interno.
 *
 * Rechaza cualquier cosa que no sea "/" seguido de algo que no sea otra
 * "/" — eso bloquea rutas absolutas ("//evil.com", que el navegador trata
 * como protocol-relative), esquemas (`http://`, `https://`, `javascript:`,
 * etc.) y caracteres de control que podrían confundir a un parser aguas
 * abajo. Cualquier duda cae al fallback.
 */
export function safeInternalRedirect(raw: string | null | undefined, fallback = "/app"): string {
  if (!raw) return fallback;

  let value: string;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return fallback;
  }

  if (value.length === 0 || value.length > 2048) return fallback;
  if (containsControlChar(value)) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.startsWith("/\\")) return fallback;

  // Un scheme colado como "/javascript:alert(1)" no empieza con "//" pero
  // tampoco es un path — cualquier ":" antes del primer "/" siguiente es
  // sospechoso de ser un scheme.
  const firstSlash = value.indexOf("/", 1);
  const beforeNextSlash = firstSlash === -1 ? value : value.slice(0, firstSlash);
  if (beforeNextSlash.includes(":")) return fallback;

  return value;
}

/** true si `value` contiene un carácter de control (0x00-0x1F o 0x7F). */
function containsControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}
