// =====================================================================
// Post-check SQL: verificación del estado real de la base DESPUÉS del
// código del alumno, en la MISMA sesión/ejecución.
//
// `TestCase.stdin` de SQL ya es un fixture PREVIO al código del alumno
// (ver `wandbox.ts#effectiveSourceFor`). Un post-check es su contraparte
// POSTERIOR: un script SQL que el servidor (nunca el alumno) añade al
// final del mismo script combinado, para confirmar contra `sqlite_master`/
// `pragma_*` que el constructo enseñado (tabla, UNIQUE, CHECK, FK,
// trigger, vista) existe de verdad — en vez de confiar en lo que el
// alumno decidió imprimir.
//
// Como no hay conexión persistente entre peticiones (ni en Wandbox en
// producción, ni entre casos de `verify-content.ts`), el post-check viaja
// pegado al MISMO script y su salida se separa de la del alumno con un
// marcador de texto. Este módulo es la ÚNICA fuente de verdad de ese
// marcador: lo usan tanto `WandboxExecutor` (producción) como
// `scripts/verify-content.ts` (verificación local), para que ambos
// caminos evalúen exactamente lo mismo.
// =====================================================================

/**
 * No es un secreto: nunca llega al alumno porque quien lo usa siempre
 * recorta el post-check de la salida antes de devolverla.
 */
export const SQL_POSTCHECK_MARKER = "__CPP_CETI_POSTCHECK__";

/** Sentencia que imprime el marcador — separador entre alumno y post-check. */
export const SQL_POSTCHECK_MARKER_STATEMENT = `SELECT '${SQL_POSTCHECK_MARKER}';`;

/**
 * Construye el script combinado: fixture + código del alumno, y — si hay
 * post-check — el marcador seguido del SQL de verificación.
 */
export function buildSqlScriptWithPostCheck(
  fixture: string,
  studentCode: string,
  postCheckSql: string | null | undefined,
): string {
  const base = `${fixture}\n${studentCode}`;
  if (!postCheckSql) return base;
  // El `;` extra ANTES del marcador es defensivo: si el envío del alumno
  // (a diferencia de nuestro propio solutionCode, que siempre lo lleva) no
  // termina en `;`, sin este separador su última sentencia se fusionaría
  // con `SELECT '<marcador>'` en una sola sentencia inválida. Un `;` de
  // más no rompe nada (sentencia vacía, se ignora).
  return `${base};\n${SQL_POSTCHECK_MARKER_STATEMENT}\n${postCheckSql}`;
}

/** Separa "lo que imprimió el alumno" de "lo que imprimió el post-check". */
export function splitAtPostCheckMarker(stdout: string): {
  student: string;
  postCheck: string;
} {
  const idx = stdout.indexOf(SQL_POSTCHECK_MARKER);
  if (idx === -1) return { student: stdout, postCheck: "" };
  return {
    student: stdout.slice(0, idx),
    postCheck: stdout.slice(idx + SQL_POSTCHECK_MARKER.length),
  };
}
