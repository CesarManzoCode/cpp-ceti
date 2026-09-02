// Parser de la salida del compilador → marcadores de Monaco.
//
// Cada lenguaje tiene su propio formato y se parsea con SU propio patrón.
// Aplicar el regex de GCC a un mensaje de Mono (o al revés) inventaría
// líneas y columnas que no existen, así que el lenguaje llega como dato,
// derivado del curso del recurso — nunca adivinado del texto.
//
// GCC/Clang/MSVC:
//   main.cpp:3:5: error: 'cout' was not declared in this scope
//   <source>:3:5: warning: unused variable 'x'
//
// Mono / Roslyn (el archivo se llama `prog.cs` en Wandbox, `Program.cs`
// en local — el patrón no depende del nombre):
//   Program.cs(5,2): error CS1002: ; expected
//   prog.cs(7,13): warning CS0219: The variable `x' is assigned but never used

import type { LanguageId } from "@/lib/code-languages";
import type { ExecutionResult, TestCaseResult } from "@/lib/executor";

export interface CodeDiagnostic {
  /** 1-indexed (línea humana). */
  line: number;
  /** 1-indexed columna donde inicia el error. */
  column: number;
  severity: "error" | "warning";
  message: string;
  /** Código del diagnóstico cuando el compilador lo da (ej. `CS1002`). */
  code?: string;
}

/**
 * Alias histórico. El tipo dejó de ser específico de C++ cuando la
 * plataforma dejó de serlo; el nombre viejo se conserva para no tocar
 * imports por estética.
 */
export type CppDiagnostic = CodeDiagnostic;

/** `archivo:linea:columna: error: mensaje` */
const GCC_PATTERN =
  /^(?:[^:]+):(\d+):(\d+):\s+(error|warning|fatal error):\s+(.+)$/i;

/** `Archivo.cs(linea,columna): error CS1002: mensaje` */
const CSHARP_PATTERN =
  /^(?:.*?)\((\d+),(\d+)\):\s+(error|warning)\s+([A-Z]{1,4}\d{3,5}):\s*(.*)$/i;

/**
 * Mono repite la ubicación del símbolo relacionado en una línea aparte que
 * no es un diagnóstico propio; sin esto aparecería un marcador extra en un
 * lugar que el alumno no tocó.
 */
const CSHARP_NOISE = /^\s*.*\(\d+,\d+\):\s*\(Location of the symbol/i;

function parseGcc(text: string): CodeDiagnostic[] {
  const out: CodeDiagnostic[] = [];
  for (const raw of text.split("\n")) {
    const m = GCC_PATTERN.exec(raw.trim());
    if (!m) continue;
    const [, lineStr, colStr, sevRaw, message] = m;
    out.push({
      line: Math.max(1, Number(lineStr) || 1),
      column: Math.max(1, Number(colStr) || 1),
      severity: sevRaw.toLowerCase() === "warning" ? "warning" : "error",
      message: message.trim(),
    });
  }
  return out;
}

function parseCsharp(text: string): CodeDiagnostic[] {
  const out: CodeDiagnostic[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || CSHARP_NOISE.test(line)) continue;
    const m = CSHARP_PATTERN.exec(line);
    if (!m) continue;
    const [, lineStr, colStr, sevRaw, code, message] = m;
    out.push({
      line: Math.max(1, Number(lineStr) || 1),
      column: Math.max(1, Number(colStr) || 1),
      severity: sevRaw.toLowerCase() === "warning" ? "warning" : "error",
      code,
      // Mono cita los identificadores con `x' — se normaliza a comillas
      // rectas para que el mensaje se lea igual que en el resto de la UI.
      message: message.trim().replace(/`([^']*)'/g, "'$1'"),
    });
  }
  return out;
}

/**
 * SQLite reporta errores en una sola línea, sin archivo/línea/columna
 * (`Error: near "SELCT": syntax error`, `Error: no such table: cliente`).
 * Sin esa ubicación no hay dónde poner un marcador en el editor — el
 * contrato técnico pide mostrar el stderr legible, no inventar una
 * posición. El panel de salida ya muestra el mensaje completo.
 */
function parseSql(): CodeDiagnostic[] {
  return [];
}

const PARSERS: Record<LanguageId, (text: string) => CodeDiagnostic[]> = {
  cpp: parseGcc,
  csharp: parseCsharp,
  sql: parseSql,
};

/**
 * Parsea la salida del compilador del lenguaje indicado.
 *
 * Un texto que no case con NINGÚN patrón no se pierde: el panel de salida
 * lo sigue mostrando completo. Aquí sólo se extrae lo que se puede ubicar
 * en una línea concreta del editor.
 */
export function parseDiagnostics(
  output: string,
  language: LanguageId = "cpp",
): CodeDiagnostic[] {
  if (!output) return [];
  const parse = PARSERS[language] ?? parseGcc;
  const seen = new Set<string>();
  const out: CodeDiagnostic[] = [];
  for (const d of parse(output)) {
    const key = `${d.line}:${d.column}:${d.severity}:${d.code ?? ""}:${d.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(d);
  }
  return out;
}

/** Alias histórico: el parser de C++ con su nombre de siempre. */
export function parseCppDiagnostics(stderr: string): CodeDiagnostic[] {
  return parseDiagnostics(stderr, "cpp");
}

/** Diagnostics a partir de un run del editor (botón "Compilar"). */
export function diagnosticsFromExecution(
  result: ExecutionResult | null | undefined,
  language: LanguageId = "cpp",
): CodeDiagnostic[] {
  if (!result) return [];
  return parseDiagnostics(
    result.compileOutput || result.stderr || "",
    language,
  );
}

/**
 * Diagnostics a partir de un envío calificado: si fallaron los tests por
 * compile error, todos comparten el mismo stderr. Tomamos el primero
 * con stderr y lo parseamos.
 */
export function diagnosticsFromSubmission(
  results: readonly TestCaseResult[],
  language: LanguageId = "cpp",
): CodeDiagnostic[] {
  for (const r of results) {
    if (r.stderr) {
      const parsed = parseDiagnostics(r.stderr, language);
      if (parsed.length > 0) return parsed;
    }
  }
  return [];
}
