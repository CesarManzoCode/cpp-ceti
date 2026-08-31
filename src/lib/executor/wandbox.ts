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
    return profileId === "cpp17-wandbox" || profileId === "csharp-mono-6.12";
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
          sourceCode: req.sourceCode,
          stdin: test.stdin,
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
