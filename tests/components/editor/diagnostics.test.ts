import { describe, expect, it } from "vitest";

import {
  diagnosticsFromExecution,
  diagnosticsFromSubmission,
  parseCppDiagnostics,
} from "@/components/editor/diagnostics";
import type { ExecutionResult, TestCaseResult } from "@/lib/executor";

describe("parseCppDiagnostics", () => {
  it("devuelve [] con stderr vacío", () => {
    expect(parseCppDiagnostics("")).toEqual([]);
  });

  it("parsea un error de GCC clásico", () => {
    const stderr =
      "main.cpp:3:5: error: 'cout' was not declared in this scope";
    expect(parseCppDiagnostics(stderr)).toEqual([
      {
        line: 3,
        column: 5,
        severity: "error",
        message: "'cout' was not declared in this scope",
      },
    ]);
  });

  it("parsea warnings y errores en el mismo stderr", () => {
    const stderr = [
      "main.cpp:1:5: warning: unused variable 'x'",
      "main.cpp:3:1: error: expected ';' before 'return'",
    ].join("\n");
    expect(parseCppDiagnostics(stderr)).toEqual([
      {
        line: 1,
        column: 5,
        severity: "warning",
        message: "unused variable 'x'",
      },
      {
        line: 3,
        column: 1,
        severity: "error",
        message: "expected ';' before 'return'",
      },
    ]);
  });

  it("normaliza 'fatal error' como error", () => {
    const stderr = "main.cpp:7:1: fatal error: iostream: No such file";
    const out = parseCppDiagnostics(stderr);
    expect(out[0].severity).toBe("error");
  });

  it("ignora líneas que no matchean el formato", () => {
    const stderr = [
      "main.cpp: In function 'int main()':",
      "main.cpp:3:5: error: real one",
      "some unrelated garbage line",
    ].join("\n");
    const out = parseCppDiagnostics(stderr);
    expect(out).toHaveLength(1);
    expect(out[0].line).toBe(3);
  });

  it("deduplica diagnostics idénticos", () => {
    const stderr = [
      "main.cpp:3:5: error: same",
      "main.cpp:3:5: error: same",
    ].join("\n");
    expect(parseCppDiagnostics(stderr)).toHaveLength(1);
  });
});

describe("diagnosticsFromExecution", () => {
  it("devuelve [] cuando el result es null", () => {
    expect(diagnosticsFromExecution(null)).toEqual([]);
  });

  it("prefiere compileOutput sobre stderr", () => {
    const result: ExecutionResult = {
      status: "compile_error",
      stdout: "",
      stderr: "main.cpp:9:9: error: should not pick this",
      compileOutput: "main.cpp:2:2: error: pick this",
      durationMs: 0,
      memoryKb: 0,
      message: "compile",
    };
    const out = diagnosticsFromExecution(result);
    expect(out).toHaveLength(1);
    expect(out[0].line).toBe(2);
  });

  it("usa stderr cuando no hay compileOutput", () => {
    const result: ExecutionResult = {
      status: "runtime_error",
      stdout: "",
      stderr: "main.cpp:4:1: error: from stderr",
      compileOutput: "",
      durationMs: 0,
      memoryKb: 0,
      message: "x",
    };
    expect(diagnosticsFromExecution(result)).toHaveLength(1);
  });
});

describe("diagnosticsFromSubmission", () => {
  function makeTest(stderr: string): TestCaseResult {
    return {
      testId: "t",
      passed: false,
      visible: true,
      description: null,
      expectedStdout: "",
      actualStdout: "",
      stderr,
      status: "compile_error",
      durationMs: 0,
    };
  }

  it("devuelve [] cuando ningún test tiene stderr parseable", () => {
    expect(diagnosticsFromSubmission([])).toEqual([]);
    expect(diagnosticsFromSubmission([makeTest("")])).toEqual([]);
    expect(diagnosticsFromSubmission([makeTest("nothing relevant")])).toEqual(
      [],
    );
  });

  it("usa el primer test con stderr parseable", () => {
    const out = diagnosticsFromSubmission([
      makeTest(""),
      makeTest("main.cpp:5:3: error: take me"),
      makeTest("main.cpp:99:1: error: ignore me"),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].line).toBe(5);
  });
});
