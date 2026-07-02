import { normalizeOutput } from "./normalize";
import { fetchWithRetry } from "./retry";
import type {
  CodeExecutor,
  ExecutionRequest,
  ExecutionResult,
  ExecutionStatus,
  TestCaseInput,
  TestCaseResult,
} from "./types";

// =====================================================================
// Piston adapter — https://github.com/engineer-man/piston
//
// Por defecto usa la API pública en emkc.org (gratis, rate limit 5 req/s).
// Para self-hosted: apuntar PISTON_URL a tu instancia (ej http://piston:2000).
// =====================================================================

const DEFAULT_BASE_URL = "https://emkc.org/api/v2/piston";
const DEFAULT_CPP_VERSION = "10.2.0"; // GCC 10.2.0 (la más estable que ofrece Piston público)
const DEFAULT_LANGUAGE = "c++";

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
    private options: { language?: string; version?: string } = {},
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    const payload = {
      language: this.options.language ?? DEFAULT_LANGUAGE,
      version: this.options.version ?? DEFAULT_CPP_VERSION,
      files: [{ name: "main.cpp", content: req.sourceCode }],
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
    sourceCode: string,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]> {
    // Ejecutamos los tests EN SERIE para no exceder el rate limit público
    // (5 req/seg). En self-hosted podrían ir en paralelo.
    const results: TestCaseResult[] = [];
    for (const test of tests) {
      try {
        const result = await this.execute({
          sourceCode,
          stdin: test.stdin,
        });
        results.push(buildTestResult(test, result));
      } catch (err) {
        results.push({
          testId: test.id,
          passed: false,
          visible: test.visible,
          description: test.description ?? null,
          expectedStdout: test.expectedStdout,
          actualStdout: "",
          stderr: err instanceof Error ? err.message : String(err),
          status: "internal_error",
          durationMs: 0,
        });
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

function buildTestResult(
  test: TestCaseInput,
  result: ExecutionResult,
): TestCaseResult {
  const passed =
    result.status === "accepted" &&
    normalizeOutput(result.stdout) === normalizeOutput(test.expectedStdout);

  return {
    testId: test.id,
    passed,
    visible: test.visible,
    description: test.description ?? null,
    expectedStdout: test.expectedStdout,
    actualStdout: result.stdout,
    stderr: result.compileOutput || result.stderr,
    status: result.status as ExecutionStatus,
    durationMs: result.durationMs,
  };
}
