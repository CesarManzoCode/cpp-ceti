import { normalizeOutput } from "./normalize";
import type { ExecutionResult, TestCaseInput, TestCaseResult } from "./types";

/**
 * Convierte el resultado de una ejecución en el resultado de un caso de
 * prueba. Idéntico en los tres adapters: la normalización de salida es
 * parte del contrato del producto, no del proveedor.
 */
export function buildTestResult(
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

/** Resultado de un caso que ni siquiera pudo ejecutarse. */
export function failedTestResult(
  test: TestCaseInput,
  err: unknown,
): TestCaseResult {
  return {
    testId: test.id,
    passed: false,
    visible: test.visible,
    description: test.description ?? null,
    expectedStdout: test.expectedStdout,
    actualStdout: "",
    stderr: err instanceof Error ? err.message : String(err),
    status: "internal_error",
    durationMs: 0,
  };
}
