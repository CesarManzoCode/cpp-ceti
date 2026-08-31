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

// =====================================================================
// C#. Los fixtures son salida REAL de `mcs` 6.x, salvo los marcados como
// Roslyn. La taxonomía se REUTILIZA: sólo `CS0534` trajo categoría nueva.
// =====================================================================

describe("categorías de error de C#", () => {
  const cases: [string, string, string][] = [
    [
      "punto y coma faltante (Mono usa CS1525, no CS1002)",
      "a.cs(2,47): error CS1525: Unexpected symbol `}', expecting `,' or `;'",
      "missing_semicolon",
    ],
    [
      "punto y coma faltante (Roslyn)",
      "Program.cs(5,2): error CS1002: ; expected",
      "missing_semicolon",
    ],
    [
      "nombre inexistente",
      "b.cs(2,56): error CS0103: The name `total' does not exist in the current context",
      "undeclared_identifier",
    ],
    [
      "olvidó `using System;` — Mono lo reporta como CS0103",
      "c.cs(1,38): error CS0103: The name `Console' does not exist in the current context",
      "undeclared_identifier",
    ],
    [
      "tipo no encontrado",
      "d.cs(2,38): error CS0246: The type or namespace name `Cliente' could not be found. Are you missing an assembly reference?",
      "undeclared_identifier",
    ],
    [
      "argumento de tipo incorrecto (CS1502 + CS1503, como en GCC)",
      "e.cs(3,49): error CS1502: The best overloaded method match for `Caja.Poner(int)' has some invalid arguments\ne.cs(3,55): error CS1503: Argument `#1' cannot convert `string' expression to type `int'",
      "invalid_arguments",
    ],
    [
      "conversión imposible en asignación",
      "i.cs(2,49): error CS0029: Cannot implicitly convert type `int' to `string'",
      "type_mismatch",
    ],
    [
      "constructor sin argumentos correspondientes (Mono CS1729)",
      "f.cs(3,28): error CS1729: The type `Base' does not contain a constructor that takes `0' arguments",
      "invalid_arguments",
    ],
    [
      "constructor sin argumentos correspondientes (Roslyn CS7036)",
      "Program.cs(3,28): error CS7036: There is no argument given that corresponds to the required parameter 'n'",
      "invalid_arguments",
    ],
    [
      "miembro abstracto sin implementar — única categoría nueva",
      "g.cs(3,7): error CS0534: `Circulo' does not implement inherited abstract member `Figura.Area()'",
      "abstract_member_not_implemented",
    ],
    [
      "fin de archivo inesperado (llave sin cerrar)",
      "h.cs(2,246): error CS1525: Unexpected symbol `end-of-file'",
      "unbalanced_delimiters",
    ],
    [
      "sin Main utilizable — equivalente al error de enlace de C++",
      "error CS5001: Program `null' does not contain a static `Main' method suitable for an entry point",
      "linker_error",
    ],
  ];

  it.each(cases)("%s", (_name, output, expected) => {
    expect(classifyCompileError(output, "csharp")).toBe(expected);
  });

  it("un código de C# desconocido cae en other_compile_error", () => {
    expect(
      classifyCompileError(
        "Program.cs(9,4): error CS9999: algo que no hemos visto",
        "csharp",
      ),
    ).toBe("other_compile_error");
  });

  it("nunca clasifica un mensaje de C# con los regex de GCC", () => {
    // Sin lenguaje explícito el default sigue siendo C++ (compatibilidad con
    // los llamadores históricos). Un mensaje de Mono no debe caer en una
    // categoría de GCC por casualidad.
    expect(
      classifyCompileError(
        "d.cs(2,38): error CS0246: The type or namespace name `Cliente' could not be found. Are you missing an assembly reference?",
      ),
    ).toBe("other_compile_error");
  });

  it("las categorías de C++ no cambiaron", () => {
    expect(
      classifyCompileError("main.cpp:3:5: error: expected ';' before '}'"),
    ).toBe("missing_semicolon");
    expect(
      classifyCompileError(
        "main.cpp:3:5: error: 'cout' was not declared in this scope",
      ),
    ).toBe("undeclared_identifier");
  });

  it("runSignalFromResult propaga el lenguaje", () => {
    const result = {
      status: "compile_error" as const,
      stdout: "",
      stderr: "",
      compileOutput:
        "g.cs(3,7): error CS0534: `Circulo' does not implement inherited abstract member `Figura.Area()'",
      durationMs: 0,
      memoryKb: 0,
      message: "Error de compilación",
    };
    expect(runSignalFromResult(result, "csharp").errorCategory).toBe(
      "abstract_member_not_implemented",
    );
    expect(runSignalFromResult(result, "cpp").errorCategory).toBe(
      "other_compile_error",
    );
  });
});
