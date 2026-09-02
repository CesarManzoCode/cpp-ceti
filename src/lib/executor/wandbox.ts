import type { ExecutionProfileId } from "@/lib/code-languages";

import { fetchWithRetry } from "./retry";
import { buildTestResult, failedTestResult } from "./test-result";
import {
  ExecutorProfileUnavailableError,
  type CodeExecutor,
  type ExecutionRequest,
  type ExecutionResult,
  type TestCaseInput,
  type TestCaseResult,
  type TestRunRequest,
} from "./types";

// =====================================================================
// Wandbox adapter — https://wandbox.org
//
// Servicio japonés de compilación online, activo desde 2013. API pública,
// sin auth, sin rate limit duro (uso razonable). Solución temporal mientras
// el usuario monta su propio Judge0/Piston.
//
// El compilador se elige POR PERFIL, no por configuración global. El
// payload de C++ es exactamente el que este adapter mandaba antes de que
// existiera C#: mismo compilador, mismas opciones, mismos defaults.
// =====================================================================

const DEFAULT_BASE_URL = "https://wandbox.org";
const DEFAULT_CPP_COMPILER = "gcc-13.2.0";
// Wandbox espera las opciones SEPARADAS POR \n (cada flag en su propia línea).
const DEFAULT_CPP_OPTIONS = ["-std=c++17", "-O0", "-Wall"].join("\n");

/**
 * Mono 6.12 verificado como el compilador de C# que Wandbox realmente
 * ejecuta. Su entrada de .NET 8 aparece en el inventario pero rebota
 * peticiones triviales por el límite de tamaño del servicio: no la
 * seleccionamos sólo porque esté listada.
 */
const DEFAULT_CSHARP_COMPILER = "mono-6.12.0.199";
const DEFAULT_CSHARP_OPTIONS = "";

/**
 * SQL (`sql-sqlite3-wandbox`) — SIN default congelado a propósito.
 *
 * El contrato técnico exige, ANTES de fijar `DEFAULT_SQL_COMPILER`: (1)
 * consultar `https://wandbox.org/api/list.json`, (2) elegir una versión
 * ESTABLE de SQLite/SQLite3 (nunca `*-head`), (3) correr un smoke real. La
 * sesión que implementó este perfil no pudo completar ese preflight: la
 * política de red del entorno bloqueó la salida a `wandbox.org` (egress
 * denegado por el proxy), así que no hay forma honesta de "congelar" un id
 * sin haberlo visto en el inventario real.
 *
 * En vez de adivinar un compiler id (el contrato lo prohíbe explícitamente:
 * "No inventes un provider nuevo sin autorización" aplica con la misma
 * fuerza a inventar un id de compilador), este perfil exige
 * `WANDBOX_SQL_COMPILER` por env — exactamente el mismo patrón que ya usan
 * `JUDGE0_CSHARP_LANGUAGE_ID` y `PISTON_CSHARP_VERSION` para no adivinar en
 * una instancia ajena. Sin la env var, el perfil está registrado (Monaco,
 * Prisma, fixtures) pero NO disponible para ejecutar — falla cerrado con
 * `ExecutorProfileUnavailableError`, nunca con un id inventado.
 *
 * Antes de usar este perfil en producción: confirma el compiler contra
 * `/api/list.json`, corre el smoke real, y fija `WANDBOX_SQL_COMPILER` (o
 * congela el valor verificado aquí como nuevo default).
 */
const DEFAULT_SQL_COMPILER: string | undefined = undefined;
const DEFAULT_SQL_OPTIONS = "";

export interface WandboxProfileConfig {
  compiler?: string;
  compilerOptions?: string;
}

/**
 * Acepta coma, espacio o \n como separador entre flags y normaliza a \n.
 * Esto permite poner las opciones en una sola línea en envs de Vercel.
 */
function normalizeOptions(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw
    .split(/[\n,]+/)
    .flatMap((part) => part.trim().split(/\s+/))
    .filter((flag) => flag.length > 0)
    .join("\n");
}

interface WandboxResponse {
  status: string;                // exit code como string ("0", "1", ...)
  signal: string;                // nombre de la señal si fue killed (ej "SIGKILL")
  compiler_output: string;
  compiler_error: string;
  compiler_message: string;      // combinado
  program_output: string;
  program_error: string;
  program_message: string;       // combinado
  permlink?: string;
  url?: string;
}

export class WandboxExecutor implements CodeExecutor {
  constructor(
    private baseUrl: string = DEFAULT_BASE_URL,
    private profiles: Partial<Record<ExecutionProfileId, WandboxProfileConfig>> = {},
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  supportsProfile(profileId: ExecutionProfileId): boolean {
    return (
      profileId === "cpp17-wandbox" ||
      profileId === "csharp-mono-6.12" ||
      profileId === "sql-sqlite3-wandbox"
    );
  }

  /**
   * Compilador y opciones del perfil. Falla cerrado ante un perfil que este
   * adapter no conoce: no hay "usa el de C++ y a ver qué pasa".
   */
  private payloadFor(profileId: ExecutionProfileId): {
    compiler: string;
    options: string;
  } {
    const configured = this.profiles[profileId] ?? {};
    if (profileId === "cpp17-wandbox") {
      return {
        compiler: configured.compiler ?? DEFAULT_CPP_COMPILER,
        options:
          normalizeOptions(configured.compilerOptions) ?? DEFAULT_CPP_OPTIONS,
      };
    }
    if (profileId === "csharp-mono-6.12") {
      return {
        compiler: configured.compiler ?? DEFAULT_CSHARP_COMPILER,
        options:
          normalizeOptions(configured.compilerOptions) ?? DEFAULT_CSHARP_OPTIONS,
      };
    }
    if (profileId === "sql-sqlite3-wandbox") {
      const compiler = configured.compiler ?? DEFAULT_SQL_COMPILER;
      if (!compiler) {
        throw new ExecutorProfileUnavailableError(
          profileId,
          "wandbox",
          "falta WANDBOX_SQL_COMPILER; el compiler SQLite de Wandbox no se " +
            "verificó contra /api/list.json en esta implementación (egress " +
            "bloqueado) — confírmalo y configúralo antes de usar este perfil",
        );
      }
      return {
        compiler,
        options: normalizeOptions(configured.compilerOptions) ?? DEFAULT_SQL_OPTIONS,
      };
    }
    throw new ExecutorProfileUnavailableError(profileId, "wandbox");
  }

  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    const startedAt = Date.now();
    const { compiler, options } = this.payloadFor(req.profileId);
    const payload = {
      compiler,
      "compiler-option-raw": options,
      code: req.sourceCode,
      stdin: req.stdin ?? "",
      save: false,
    };

    const response = await fetchWithRetry(
      `${this.baseUrl}/api/compile.json`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
      { label: "wandbox" },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Wandbox respondió ${response.status}: ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as WandboxResponse;
    return mapWandboxResponse(data, Date.now() - startedAt);
  }

  async runTests(
    req: TestRunRequest,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]> {
    // Valida el perfil ANTES de gastar una sola petición: si no se puede
    // ejecutar, el alumno debe ver un error de entorno, no N tests fallados.
    this.payloadFor(req.profileId);

    // Tests en serie por respeto al servicio público.
    const results: TestCaseResult[] = [];
    for (const test of tests) {
      try {
        const result = await this.execute({
          profileId: req.profileId,
          sourceCode: effectiveSourceFor(req.profileId, req.sourceCode, test.stdin),
          stdin: effectiveStdinFor(req.profileId, test.stdin),
          cpuTimeLimit: req.cpuTimeLimit,
          memoryLimitKb: req.memoryLimitKb,
        });
        results.push(buildTestResult(test, result));
      } catch (err) {
        results.push(failedTestResult(test, err));
      }
    }
    return results;
  }
}

/**
 * Semántica de fixtures SQL (TECHNICAL_CONTRACT §4) — SÓLO para
 * `sql-sqlite3-wandbox`, y SÓLO al calificar tests (`runTests`): `TestCase.stdin`
 * no es entrada interactiva de un proceso, es el SQL de PREPARACIÓN del caso
 * (`CREATE TABLE`, `INSERT`...). Cada caso corre contra una DB efímera
 * nueva de Wandbox, así que anteponer el fixture al código del alumno
 * equivale a "crear su propia base y consultarla".
 *
 * Para C++ y C# esta función es la identidad: `stdin` sigue siendo
 * exactamente lo que el programa lee por entrada estándar, sin cambios.
 */
function effectiveSourceFor(
  profileId: ExecutionProfileId,
  sourceCode: string,
  fixture: string,
): string {
  if (profileId !== "sql-sqlite3-wandbox") return sourceCode;
  return `${fixture}\n${sourceCode}`;
}

/** Ver `effectiveSourceFor`: en SQL el stdin REAL enviado a sqlite es "". */
function effectiveStdinFor(
  profileId: ExecutionProfileId,
  fixture: string,
): string {
  if (profileId !== "sql-sqlite3-wandbox") return fixture;
  return "";
}

function mapWandboxResponse(
  data: WandboxResponse,
  durationMs: number,
): ExecutionResult {
  // Wandbox no expone explícitamente "compile_failed"; lo deducimos:
  // si hay compiler_error y no hay program_output, asumimos compile error.
  const hasCompilerError =
    data.compiler_error?.trim().length > 0 &&
    !data.program_output &&
    !data.program_error;

  if (hasCompilerError) {
    return {
      status: "compile_error",
      stdout: "",
      stderr: data.compiler_error,
      compileOutput: data.compiler_message || data.compiler_error,
      durationMs,
      memoryKb: 0,
      message: "Error de compilación",
    };
  }

  // Killed por timeout u otra señal
  if (data.signal && data.signal.length > 0) {
    const isTimeout =
      data.signal === "SIGKILL" || data.signal === "SIGTERM" || data.signal === "SIGXCPU";
    return {
      status: isTimeout ? "time_limit" : "runtime_error",
      stdout: data.program_output ?? "",
      stderr: data.program_error ?? "",
      compileOutput: "",
      durationMs,
      memoryKb: 0,
      message: isTimeout ? "Tiempo límite excedido" : `Runtime error (${data.signal})`,
    };
  }

  const exitCode = Number(data.status);

  // Exit code != 0 → runtime error
  if (!Number.isNaN(exitCode) && exitCode !== 0) {
    return {
      status: "runtime_error",
      stdout: data.program_output ?? "",
      stderr: data.program_error ?? "",
      compileOutput: "",
      durationMs,
      memoryKb: 0,
      message: `Runtime error (exit ${exitCode})`,
    };
  }

  return {
    status: "accepted",
    stdout: data.program_output ?? "",
    stderr: data.program_error ?? "",
    compileOutput: data.compiler_error ?? "", // warnings
    durationMs,
    memoryKb: 0,
    message: "Aceptado",
  };
}
