import type { TestCaseResult } from "./types";

/**
 * Resumen legible (es-MX) del resultado de correr los tests de un
 * ejercicio. Compartido por las acciones de lección y práctica para
 * que el alumno vea el MISMO mensaje en ambos contextos.
 */
export function buildFeedback(results: TestCaseResult[]): string {
  const passed = results.filter((r) => r.passed).length;
  if (passed === results.length) {
    return `🎉 ¡Pasaste los ${results.length} tests!`;
  }
  const failures = results.filter((r) => !r.passed);
  const firstFail = failures[0];
  if (!firstFail) {
    return `${passed} de ${results.length} tests aprobados.`;
  }
  if (firstFail.status === "compile_error") {
    return "Tu código no compila. Revisa el panel de errores.";
  }
  if (firstFail.status === "time_limit") {
    return "Tu programa tardó demasiado. ¿Hay un ciclo infinito?";
  }
  if (firstFail.status === "runtime_error") {
    return "Tu programa se cayó en tiempo de ejecución. Revisa accesos a memoria.";
  }
  return `${passed} de ${results.length} tests aprobados. Revisa la salida esperada vs la tuya.`;
}
