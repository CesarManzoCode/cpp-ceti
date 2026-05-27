import type {
  CodeExecutor,
  ExecutionRequest,
  ExecutionResult,
  ExecutionStatus,
  TestCaseInput,
  TestCaseResult,
} from "./types";

// =====================================================================
// Wandbox adapter — https://wandbox.org
//
// Servicio japonés de compilación online, activo desde 2013. API pública,
// sin auth, sin rate limit duro (uso razonable). Solución temporal mientras
// el usuario monta su propio Judge0/Piston.
// =====================================================================

const DEFAULT_BASE_URL = "https://wandbox.org";
const DEFAULT_COMPILER = "gcc-13.2.0";
// Wandbox espera las opciones SEPARADAS POR \n (cada flag en su propia línea).
const DEFAULT_OPTIONS = ["-std=c++17", "-O0", "-Wall"].join("\n");

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
    private options: { compiler?: string; compilerOptions?: string } = {},
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    const startedAt = Date.now();
    const payload = {
      compiler: this.options.compiler ?? DEFAULT_COMPILER,
      "compiler-option-raw":
        normalizeOptions(this.options.compilerOptions) ?? DEFAULT_OPTIONS,
      code: req.sourceCode,
      stdin: req.stdin ?? "",
      save: false,
    };

    const response = await fetch(`${this.baseUrl}/api/compile.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

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
    sourceCode: string,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]> {
    // Tests en serie por respeto al servicio público.
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

function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
