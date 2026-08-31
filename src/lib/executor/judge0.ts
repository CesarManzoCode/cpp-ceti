import type { ExecutionProfileId } from "@/lib/code-languages";

import { fetchWithRetry } from "./retry";
import { buildTestResult, failedTestResult } from "./test-result";
import {
  ExecutorProfileUnavailableError,
  type CodeExecutor,
  type ExecutionRequest,
  type ExecutionResult,
  type ExecutionStatus,
  type TestCaseInput,
  type TestCaseResult,
  type TestRunRequest,
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

// Para C# NO hay default: los ids numéricos de Judge0 son específicos de
// cada instancia. Hornear un número aquí significaría, en la instancia
// equivocada, compilar C# con el compilador de otro lenguaje. Sin
// JUDGE0_CSHARP_LANGUAGE_ID el perfil simplemente no está disponible.

export interface Judge0ProfileConfig {
  languageId?: number;
}

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
  constructor(
    private baseUrl: string,
    private headers: Record<string, string> = {},
    private profiles: Partial<Record<ExecutionProfileId, Judge0ProfileConfig>> = {},
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  supportsProfile(profileId: ExecutionProfileId): boolean {
    try {
      this.languageIdFor(profileId);
      return true;
    } catch {
      return false;
    }
  }

  private languageIdFor(profileId: ExecutionProfileId): number {
    const configured = this.profiles[profileId]?.languageId;
    if (profileId === "cpp17-wandbox") {
      return configured ?? DEFAULT_CPP_LANG_ID;
    }
    if (profileId === "csharp-mono-6.12") {
      if (configured === undefined) {
        throw new ExecutorProfileUnavailableError(
          profileId,
          "judge0",
          "falta JUDGE0_CSHARP_LANGUAGE_ID; verifícalo contra /languages de tu instancia",
        );
      }
      return configured;
    }
    throw new ExecutorProfileUnavailableError(profileId, "judge0");
  }

  async execute(req: ExecutionRequest): Promise<ExecutionResult> {
    const payload = {
      source_code: req.sourceCode,
      language_id: this.languageIdFor(req.profileId),
      stdin: req.stdin ?? "",
      cpu_time_limit: req.cpuTimeLimit ?? 5,
      memory_limit: req.memoryLimitKb ?? 128_000,
      // expected_output omitido a propósito — lo comparamos nosotros para
      // tener control fino sobre whitespace/trailing newlines.
    };

    const url = `${this.baseUrl}/submissions?wait=true&base64_encoded=false&fields=*`;
    const response = await fetchWithRetry(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
        body: JSON.stringify(payload),
        // No cachear ejecuciones de código en CDN
        cache: "no-store",
      },
      { label: "judge0" },
    );

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
    req: TestRunRequest,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]> {
    // Perfil primero: si no se puede ejecutar, es un error de entorno y no
    // N tests reprobados.
    this.languageIdFor(req.profileId);

    // Ejecutar tests en paralelo. Judge0 con `?wait=true` soporta llamadas
    // concurrentes; si tu cuota es ajustada considera reducir a serial.
    const results = await Promise.all(
      tests.map(async (test) => {
        try {
          const result = await this.execute({
            profileId: req.profileId,
            sourceCode: req.sourceCode,
            stdin: test.stdin,
            cpuTimeLimit: req.cpuTimeLimit,
            memoryLimitKb: req.memoryLimitKb,
          });
          return buildTestResult(test, result);
        } catch (err) {
          return failedTestResult(test, err);
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
