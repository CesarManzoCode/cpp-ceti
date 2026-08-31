// =====================================================================
// Tipos compartidos del sistema de ejecución de código.
// Cualquier adapter (Judge0 RapidAPI, self-hosted, WASM, etc.) implementa
// esta interface.
//
// INVARIANTE: toda ejecución lleva su `profileId`. No existe un lenguaje
// "por default" ni configuración global de compilador. El perfil lo deriva
// el servidor del curso al que pertenece el recurso; el cliente jamás lo
// manda. Un adapter que no soporte el perfil pedido debe lanzar
// `ExecutorProfileUnavailableError`, NUNCA compilar con otro.
// =====================================================================

import type { ExecutionProfileId } from "@/lib/code-languages";

export type ExecutionStatus =
  | "accepted"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit"
  | "memory_limit"
  | "internal_error";

export interface ExecutionRequest {
  /**
   * Perfil de ejecución (lenguaje + toolchain + versión). Obligatorio: sin
   * él no hay forma de construir la petición al proveedor. El tipo lo hace
   * imposible de omitir por accidente.
   */
  profileId: ExecutionProfileId;
  sourceCode: string;
  stdin?: string;
  /** Límite de tiempo de CPU en segundos (default 5) */
  cpuTimeLimit?: number;
  /** Límite de memoria en KB (default 128MB) */
  memoryLimitKb?: number;
}

/** Petición de calificación: el mismo contrato, más los casos de prueba. */
export interface TestRunRequest {
  profileId: ExecutionProfileId;
  sourceCode: string;
  cpuTimeLimit?: number;
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
    request: TestRunRequest,
    tests: TestCaseInput[],
  ): Promise<TestCaseResult[]>;
  /** ¿Este adapter puede ejecutar el perfil con la configuración actual? */
  supportsProfile(profileId: ExecutionProfileId): boolean;
}

/**
 * El perfil pedido no está disponible en el proveedor configurado (falta un
 * language id, una versión, o el proveedor no lo soporta). Se traduce a un
 * mensaje neutral de "entorno de ejecución no disponible" en el borde HTTP.
 *
 * Nunca se resuelve cayendo a otro lenguaje ni a otro perfil: una C# que se
 * compile como C++ da un error de compilación incomprensible y, peor, una
 * calificación falsa.
 */
export class ExecutorProfileUnavailableError extends Error {
  constructor(
    readonly profileId: string,
    readonly provider: string,
    detail?: string,
  ) {
    super(
      `El proveedor "${provider}" no puede ejecutar el perfil "${profileId}"` +
        (detail ? `: ${detail}` : ""),
    );
    this.name = "ExecutorProfileUnavailableError";
  }
}
