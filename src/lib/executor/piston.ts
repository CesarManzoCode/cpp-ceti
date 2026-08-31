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
// Piston adapter — https://github.com/engineer-man/piston
//
// Por defecto apunta a la API pública en emkc.org, que desde 2026 responde
// 401 sin whitelist. Para self-hosted: apuntar PISTON_URL a tu instancia
// (ej http://piston:2000).
//
// C# sólo está disponible si la instancia declara su versión por env: el
// inventario público lista `csharp`, pero ejecutar requiere autenticación.
// Sin versión configurada el perfil NO está disponible — jamás se sustituye
// por C++.
// =====================================================================

const DEFAULT_BASE_URL = "https://emkc.org/api/v2/piston";
const DEFAULT_CPP_VERSION = "10.2.0"; // GCC 10.2.0 (la más estable que ofrece Piston público)

interface PistonProfileSpec {
  language: string;
  version: string;
  fileName: string;
}

export interface PistonProfileConfig {
  version?: string;
}

interface PistonExecuteResponse {
  language: string;
  version: string;
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

export class PistonExecutor implements CodeExecutor {
  constructor(
    private baseUrl: string = DEFAULT_BASE_URL,
    private profiles: Partial<Record<ExecutionProfileId, PistonProfileConfig>> = {},
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  supportsProfile(profileId: ExecutionProfileId): boolean {
    try {
      this.specFor(profileId);
      return true;
    } catch {
      return false;
    }
  }

  private specFor(profileId: ExecutionProfileId): PistonProfileSpec {
    const configured = this.profiles[profileId] ?? {};
    if (profileId === "cpp17-wandbox") {
      return {
        language: "c++",
        version: configured.version ?? DEFAULT_CPP_VERSION,
        fileName: "main.cpp",
      };
    }
    if (profileId === "csharp-mono-6.12") {
      // Sin versión explícita no hay perfil: adivinar una versión de C# en
      // una instancia ajena es exactamente el fallback silencioso que el
      // contrato prohíbe.
      if (!configured.version) {
        throw new ExecutorProfileUnavailableError(
          profileId,
          "piston",
          "falta PISTON_CSHARP_VERSION para la instancia configurada",
        );
      }
      return {
        language: "csharp",
        version: configured.version,
        fileName: "Program.cs",
      };
    }
    throw new ExecutorProfileUnavailableError(profileId, "piston");
  }

  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    const spec = this.specFor(req.profileId);
    const payload = {
      language: spec.language,
      version: spec.version,
      files: [{ name: spec.fileName, content: req.sourceCode }],
      stdin: req.stdin ?? "",
      compile_timeout: 10_000,
      run_timeout: (req.cpuTimeLimit ?? 5) * 1000,
      compile_memory_limit: -1,
      run_memory_limit: (req.memoryLimitKb ?? 128_000) * 1024,
    };

    const response = await fetchWithRetry(
      `${this.baseUrl}/execute`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
      { label: "piston" },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Piston respondió ${response.status}: ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as PistonExecuteResponse;
    return mapPistonResponse(data);
  }

  async runTests(
    req: TestRunRequest,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]> {
    // Perfil primero: si no se puede ejecutar, es un error de entorno.
    this.specFor(req.profileId);

    // Ejecutamos los tests EN SERIE para no exceder el rate limit público
    // (5 req/seg). En self-hosted podrían ir en paralelo.
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

function mapPistonResponse(data: PistonExecuteResponse): ExecutionResult {
  // ¿Falló al compilar?
  if (data.compile && data.compile.code !== 0) {
    return {
      status: "compile_error",
      stdout: "",
      stderr: data.compile.stderr,
      compileOutput: data.compile.output || data.compile.stderr,
      durationMs: 0,
      memoryKb: 0,
      message: "Error de compilación",
    };
  }

  const { run } = data;

  // Timeout
  if (run.signal === "SIGKILL") {
    return {
      status: "time_limit",
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: "",
      durationMs: 0,
      memoryKb: 0,
      message: "Tiempo límite excedido",
    };
  }

  // Runtime error (cualquier exit code != 0 o señal de error)
  if (run.code !== 0 || run.signal) {
    const isOom =
      (run.stderr ?? "").toLowerCase().includes("out of memory") ||
      run.signal === "SIGSEGV" ||
      run.signal === "SIGABRT";
    return {
      status: isOom ? "runtime_error" : "runtime_error",
      stdout: run.stdout,
      stderr: run.stderr,
      compileOutput: "",
      durationMs: 0,
      memoryKb: 0,
      message: run.signal
        ? `Runtime error (${run.signal})`
        : `Runtime error (exit ${run.code})`,
    };
  }

  return {
    status: "accepted",
    stdout: run.stdout,
    stderr: run.stderr,
    compileOutput: "",
    durationMs: 0, // Piston no devuelve tiempos precisos en la respuesta
    memoryKb: 0,
    message: "Aceptado",
  };
}
