import type {
  CodeExecutor,
  ExecutionRequest,
  ExecutionResult,
  ExecutionStatus,
  TestCaseInput,
  TestCaseResult,
} from "./types";

// Judge0 status IDs — referencia oficial.
// Source: https://github.com/judge0/judge0/blob/master/docs/api/general.md
const JUDGE0_STATUS: Record<number, { status: ExecutionStatus; message: string }> = {
  1: { status: "internal_error", message: "En cola" },
  2: { status: "internal_error", message: "Procesando" },
  3: { status: "accepted", message: "Aceptado" },
  4: { status: "wrong_answer", message: "Resultado incorrecto" },
  5: { status: "time_limit", message: "Tiempo límite excedido" },
  6: { status: "compile_error", message: "Error de compilación" },
  7: { status: "runtime_error", message: "Runtime error (SIGSEGV)" },
  8: { status: "runtime_error", message: "Runtime error (SIGXFSZ)" },
  9: { status: "runtime_error", message: "Runtime error (SIGFPE)" },
  10: { status: "runtime_error", message: "Runtime error (SIGABRT)" },
  11: { status: "runtime_error", message: "Runtime error (NZEC)" },
  12: { status: "runtime_error", message: "Runtime error" },
  13: { status: "internal_error", message: "Error interno del compilador" },
  14: { status: "internal_error", message: "Formato ejecutable inválido" },
};

// Language ID 54 = C++ (GCC 9.2.0). Es el más estable y soportado.
// Si tu Judge0 self-hosted usa una imagen diferente puedes overridear con
// la env var JUDGE0_CPP_LANGUAGE_ID.
const DEFAULT_CPP_LANG_ID = 54;

interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  exit_code: number | null;
  exit_signal: number | null;
  status: { id: number; description: string };
  time: string | null; // segundos como string ej "0.012"
  memory: number | null; // en KB
  token: string;
}

export class Judge0Executor implements CodeExecutor {
  private languageId: number;

  constructor(
    private baseUrl: string,
    private headers: Record<string, string> = {},
    options: { languageId?: number } = {},
  ) {
    this.languageId = options.languageId ?? DEFAULT_CPP_LANG_ID;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    const payload = {
      source_code: req.sourceCode,
      language_id: this.languageId,
      stdin: req.stdin ?? "",
      cpu_time_limit: req.cpuTimeLimit ?? 5,
      memory_limit: req.memoryLimitKb ?? 128_000,
      // expected_output omitido a propósito — lo comparamos nosotros para
      // tener control fino sobre whitespace/trailing newlines.
    };

    const url = `${this.baseUrl}/submissions?wait=true&base64_encoded=false&fields=*`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      body: JSON.stringify(payload),
      // No cachear ejecuciones de código en CDN
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Judge0 respondió ${response.status}: ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as Judge0Response;
    return mapJudge0Response(data);
  }

  async runTests(
    sourceCode: string,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]> {
    // Ejecutar tests en paralelo. Judge0 con `?wait=true` soporta llamadas
    // concurrentes; si tu cuota es ajustada considera reducir a serial.
    const results = await Promise.all(
      tests.map(async (test) => {
        try {
          const result = await this.execute({
            sourceCode,
            stdin: test.stdin,
          });
          return buildTestResult(test, result);
        } catch (err) {
          return {
            testId: test.id,
            passed: false,
            visible: test.visible,
            description: test.description ?? null,
            expectedStdout: test.expectedStdout,
            actualStdout: "",
            stderr: err instanceof Error ? err.message : String(err),
            status: "internal_error" as ExecutionStatus,
            durationMs: 0,
          } satisfies TestCaseResult;
        }
      }),
    );
    return results;
  }
}

function mapJudge0Response(data: Judge0Response): ExecutionResult {
  const statusInfo = JUDGE0_STATUS[data.status?.id] ?? {
    status: "internal_error" as ExecutionStatus,
    message: data.status?.description ?? "Estado desconocido",
  };

  return {
    status: statusInfo.status,
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    compileOutput: data.compile_output ?? "",
    durationMs: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
    memoryKb: data.memory ?? 0,
    message: statusInfo.message,
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
    status: result.status,
    durationMs: result.durationMs,
  };
}

/**
 * Normaliza output para comparación: convierte CRLF a LF, hace trim de espacios
 * al final de cada línea, y trim del output completo.
 * Esto evita falsos negativos por `endl` vs `\n` o espacios trailing.
 */
function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
