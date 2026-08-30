import { describe, expect, it } from "vitest";

import {
  classifyCompileError,
  runOutcomeFromStatus,
  runSignalFromResult,
} from "@/lib/analytics/error-category";
import type { ExecutionResult } from "@/lib/executor";

function result(over: Partial<ExecutionResult>): ExecutionResult {
  return {
    status: "accepted",
    stdout: "",
    stderr: "",
    compileOutput: "",
    durationMs: 10,
    memoryKb: 1,
    message: "",
    ...over,
  };
}

describe("classifyCompileError", () => {
  it("detecta punto y coma faltante", () => {
    expect(
      classifyCompileError("main.cpp:5:14: error: expected ';' before '}'"),
    ).toBe("missing_semicolon");
  });

  it("detecta identificador no declarado", () => {
    expect(
      classifyCompileError(
        "main.cpp:3:5: error: 'cout' was not declared in this scope",
      ),
    ).toBe("undeclared_identifier");
  });

  it("detecta include faltante", () => {
    expect(
      classifyCompileError("fatal error: <iostrem>: No such file or directory"),
    ).toBe("missing_include");
  });

  it("detecta conversión inválida", () => {
    expect(
      classifyCompileError("error: cannot convert 'const char*' to 'int'"),
    ).toBe("type_mismatch");
  });

  it("detecta error de enlazado", () => {
    expect(
      classifyCompileError("undefined reference to `main'\ncollect2: error"),
    ).toBe("linker_error");
  });

  it("cae en other_compile_error cuando no reconoce el mensaje", () => {
    expect(classifyCompileError("error: algo rarísimo")).toBe(
      "other_compile_error",
    );
  });

  it("devuelve null cuando no hay salida del compilador", () => {
    expect(classifyCompileError("")).toBeNull();
    expect(classifyCompileError(null)).toBeNull();
  });
});

describe("runOutcomeFromStatus", () => {
  it("trata wrong_answer como éxito: un run no se califica", () => {
    expect(runOutcomeFromStatus("wrong_answer")).toBe("success");
    expect(runOutcomeFromStatus("accepted")).toBe("success");
  });

  it("mapea los errores a su categoría", () => {
    expect(runOutcomeFromStatus("compile_error")).toBe("compile_error");
    expect(runOutcomeFromStatus("runtime_error")).toBe("runtime_error");
    expect(runOutcomeFromStatus("memory_limit")).toBe("runtime_error");
    expect(runOutcomeFromStatus("time_limit")).toBe("time_limit");
  });
});

describe("runSignalFromResult", () => {
  it("sólo clasifica el error cuando falló la compilación", () => {
    expect(
      runSignalFromResult(
        result({ status: "compile_error", compileOutput: "expected ';'" }),
      ),
    ).toEqual({ outcome: "compile_error", errorCategory: "missing_semicolon" });

    expect(
      runSignalFromResult(result({ status: "accepted", stderr: "expected ';'" })),
    ).toEqual({ outcome: "success", errorCategory: null });
  });
});
