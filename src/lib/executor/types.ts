// =====================================================================
// Tipos compartidos del sistema de ejecución de código.
// Cualquier adapter (Judge0 RapidAPI, self-hosted, WASM, etc.) implementa
// esta interface.
// =====================================================================

export type ExecutionStatus =
  | "accepted"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit"
  | "memory_limit"
  | "internal_error";

export interface ExecutionRequest {
  sourceCode: string;
  stdin?: string;
  /** Límite de tiempo de CPU en segundos (default 5) */
  cpuTimeLimit?: number;
  /** Límite de memoria en KB (default 128MB) */
  memoryLimitKb?: number;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  /** Salida del compilador cuando hay error de compilación */
  compileOutput: string;
  /** Tiempo de ejecución en milisegundos */
  durationMs: number;
  /** Memoria usada en KB */
  memoryKb: number;
  /** Mensaje legible del estado (ej: "Accepted", "Time Limit Exceeded") */
  message: string;
}

export interface TestCaseInput {
  id: string;
  stdin: string;
  expectedStdout: string;
  visible: boolean;
  description?: string | null;
}

export interface TestCaseResult {
  testId: string;
  passed: boolean;
  visible: boolean;
  description?: string | null;
  expectedStdout: string;
  actualStdout: string;
  stderr: string;
  status: ExecutionStatus;
  durationMs: number;
}

export interface CodeExecutor {
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
  runTests(
    sourceCode: string,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]>;
}
