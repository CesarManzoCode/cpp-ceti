import { describe, expect, it } from "vitest";

import {
  diagnosticsFromExecution,
  diagnosticsFromSubmission,
  parseCppDiagnostics,
  parseDiagnostics,
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

// =====================================================================
// C# (Mono / Roslyn). Los fixtures son salida REAL de `mcs`, salvo los
// marcados como Roslyn, que usan sus códigos documentados.
// =====================================================================

describe("diagnósticos de C#", () => {
  it("ubica el error de Roslyn del contrato del handoff", () => {
    const [d] = parseDiagnostics(
      "Program.cs(5,2): error CS1002: ; expected",
      "csharp",
    );
    expect(d).toEqual({
      line: 5,
      column: 2,
      severity: "error",
      code: "CS1002",
      message: "; expected",
    });
  });

  it("acepta el nombre de archivo que usa Wandbox", () => {
    const [d] = parseDiagnostics(
      "prog.cs(5,2): error CS1002: ; expected",
      "csharp",
    );
    expect(d.line).toBe(5);
    expect(d.column).toBe(2);
  });

  it("parsea la salida real de Mono y normaliza sus comillas", () => {
    const [d] = parseDiagnostics(
      "b.cs(2,56): error CS0103: The name `total' does not exist in the current context",
      "csharp",
    );
    expect(d.code).toBe("CS0103");
    expect(d.line).toBe(2);
    expect(d.message).toBe(
      "The name 'total' does not exist in the current context",
    );
  });

  it("captura warnings con su código", () => {
    const [d] = parseDiagnostics(
      "Program.cs(7,13): warning CS0219: The variable `x' is assigned but never used",
      "csharp",
    );
    expect(d.severity).toBe("warning");
    expect(d.code).toBe("CS0219");
  });

  it("ignora la línea de 'symbol related to previous error'", () => {
    const output = [
      "e.cs(3,49): error CS1502: The best overloaded method match for `Caja.Poner(int)' has some invalid arguments",
      "e.cs(2,26): (Location of the symbol related to previous error)",
      "Compilation failed: 1 error(s), 0 warnings",
    ].join("\n");
    const parsed = parseDiagnostics(output, "csharp");
    expect(parsed).toHaveLength(1);
    expect(parsed[0].code).toBe("CS1502");
  });

  it("no usa el parser de GCC para C# ni al revés", () => {
    // Un mensaje de Mono no debe producir diagnósticos con reglas de GCC…
    expect(
      parseDiagnostics("Program.cs(5,2): error CS1002: ; expected", "cpp"),
    ).toEqual([]);
    // …y un mensaje de GCC no debe producirlos con las de C#.
    expect(
      parseDiagnostics(
        "main.cpp:3:5: error: 'cout' was not declared in this scope",
        "csharp",
      ),
    ).toEqual([]);
  });

  it("texto sin formato reconocible no inventa marcadores", () => {
    expect(
      parseDiagnostics("Compilation failed: 1 error(s), 0 warnings", "csharp"),
    ).toEqual([]);
  });

  it("diagnosticsFromExecution respeta el lenguaje", () => {
    const result = {
      status: "compile_error" as const,
      stdout: "",
      stderr: "",
      compileOutput: "Program.cs(4,9): error CS0246: The type or namespace name `Cliente' could not be found",
      durationMs: 0,
      memoryKb: 0,
      message: "Error de compilación",
    };
    expect(diagnosticsFromExecution(result, "csharp")).toHaveLength(1);
    expect(diagnosticsFromExecution(result, "cpp")).toHaveLength(0);
  });
});
