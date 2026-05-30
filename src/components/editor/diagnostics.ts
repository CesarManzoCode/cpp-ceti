// Parser ligero de stderr de GCC/Clang/MSVC para extraer diagnostics
// (errores/warnings) y mapearlos a marcadores de Monaco.
//
// Formato típico (GCC):
//   main.cpp:3:5: error: 'cout' was not declared in this scope
//   main.cpp: In function 'int main()':
//
// También captura el patrón "<source>:3:5: error: ..." de Wandbox.

import type { ExecutionResult, TestCaseResult } from "@/lib/executor";

export interface CppDiagnostic {
  /** 1-indexed (línea humana). */
  line: number;
  /** 1-indexed columna donde inicia el error. */
  column: number;
  severity: "error" | "warning";
  message: string;
}

const PATTERN =
  /^(?:[^:]+):(\d+):(\d+):\s+(error|warning|fatal error):\s+(.+)$/i;

export function parseCppDiagnostics(stderr: string): CppDiagnostic[] {
  if (!stderr) return [];
  const seen = new Set<string>();
  const out: CppDiagnostic[] = [];
  for (const line of stderr.split("\n")) {
    const m = PATTERN.exec(line.trim());
    if (!m) continue;
    const [, lineStr, colStr, sevRaw, message] = m;
    const severity =
      sevRaw.toLowerCase() === "warning"
        ? ("warning" as const)
        : ("error" as const);
    const key = `${lineStr}:${colStr}:${severity}:${message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      line: Math.max(1, Number(lineStr) || 1),
      column: Math.max(1, Number(colStr) || 1),
      severity,
      message: message.trim(),
    });
  }
  return out;
}

/** Diagnostics a partir de un run del editor (botón "Probar"). */
export function diagnosticsFromExecution(
  result: ExecutionResult | null | undefined,
): CppDiagnostic[] {
  if (!result) return [];
  return parseCppDiagnostics(result.compileOutput || result.stderr || "");
}

/**
 * Diagnostics a partir de un envío calificado: si fallaron los tests por
 * compile error, todos comparten el mismo stderr. Tomamos el primero
 * con stderr y lo parseamos.
 */
export function diagnosticsFromSubmission(
  results: readonly TestCaseResult[],
): CppDiagnostic[] {
  for (const r of results) {
    if (r.stderr) {
      const parsed = parseCppDiagnostics(r.stderr);
      if (parsed.length > 0) return parsed;
    }
  }
  return [];
}
