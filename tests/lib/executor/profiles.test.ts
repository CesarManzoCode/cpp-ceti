import { beforeEach, describe, expect, it, vi } from "vitest";

import { Judge0Executor } from "@/lib/executor/judge0";
import { PistonExecutor } from "@/lib/executor/piston";
import { ExecutorProfileUnavailableError } from "@/lib/executor/types";
import { WandboxExecutor } from "@/lib/executor/wandbox";

/**
 * El contrato del ejecutor: cada petición lleva su perfil, el payload de C++
 * es EXACTAMENTE el de siempre, y un perfil no soportado falla cerrado en
 * lugar de compilar con otro lenguaje.
 */

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function wandboxOk() {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      status: "0",
      signal: "",
      compiler_output: "",
      compiler_error: "",
      compiler_message: "",
      program_output: "hola\n",
      program_error: "",
      program_message: "hola\n",
    }),
    text: async () => "",
  };
}

function lastBody(): Record<string, unknown> {
  const call = fetchMock.mock.calls.at(-1);
  return JSON.parse((call?.[1] as { body: string }).body);
}

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(wandboxOk());
});

describe("Wandbox por perfil", () => {
  it("C++ conserva compilador y opciones exactos", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await executor.execute({
      profileId: "cpp17-wandbox",
      sourceCode: "int main(){}",
      stdin: "",
    });
    expect(lastBody()).toEqual({
      compiler: "gcc-13.2.0",
      "compiler-option-raw": "-std=c++17\n-O0\n-Wall",
      code: "int main(){}",
      stdin: "",
      save: false,
    });
  });

  it("C# usa Mono 6.12 y no manda flags de GCC", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await executor.execute({
      profileId: "csharp-mono-6.12",
      sourceCode: "class Program {}",
      stdin: "",
    });
    const body = lastBody();
    expect(body.compiler).toBe("mono-6.12.0.199");
    expect(body["compiler-option-raw"]).toBe("");
    expect(JSON.stringify(body)).not.toContain("-std=c++17");
  });

  it("una configuración por perfil no contamina al otro perfil", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {
      "cpp17-wandbox": { compiler: "gcc-12.1.0", compilerOptions: "-std=c++20" },
    });
    await executor.execute({
      profileId: "csharp-mono-6.12",
      sourceCode: "class Program {}",
    });
    expect(lastBody().compiler).toBe("mono-6.12.0.199");
    await executor.execute({
      profileId: "cpp17-wandbox",
      sourceCode: "int main(){}",
    });
    expect(lastBody().compiler).toBe("gcc-12.1.0");
  });

  it("ejecuciones intercaladas no se filtran entre sí", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await Promise.all([
      executor.execute({ profileId: "cpp17-wandbox", sourceCode: "a" }),
      executor.execute({ profileId: "csharp-mono-6.12", sourceCode: "b" }),
      executor.execute({ profileId: "cpp17-wandbox", sourceCode: "c" }),
    ]);
    const compilers = fetchMock.mock.calls.map(
      (c) => JSON.parse((c[1] as { body: string }).body).compiler,
    );
    expect(compilers).toEqual([
      "gcc-13.2.0",
      "mono-6.12.0.199",
      "gcc-13.2.0",
    ]);
  });

  it("un perfil desconocido no ejecuta nada", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await expect(
      executor.execute({
        profileId: "python-3" as never,
        sourceCode: "print(1)",
      }),
    ).rejects.toBeInstanceOf(ExecutorProfileUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("runTests valida el perfil ANTES de gastar peticiones", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await expect(
      executor.runTests(
        { profileId: "rust-1" as never, sourceCode: "fn main(){}" },
        [
          {
            id: "t1",
            stdin: "",
            expectedStdout: "x",
            visible: true,
            description: null,
          },
        ],
      ),
    ).rejects.toBeInstanceOf(ExecutorProfileUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("Wandbox SQL (sql-sqlite3-wandbox)", () => {
  it("supportsProfile reconoce el perfil (registro), aunque falte compiler", () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    expect(executor.supportsProfile("sql-sqlite3-wandbox")).toBe(true);
  });

  it("sin WANDBOX_SQL_COMPILER el perfil NO está disponible para ejecutar — nunca un id inventado", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await expect(
      executor.execute({
        profileId: "sql-sqlite3-wandbox",
        sourceCode: "SELECT 1;",
      }),
    ).rejects.toBeInstanceOf(ExecutorProfileUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("con compiler configurado, execute() manda el SQL tal cual (sin fixture)", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {
      "sql-sqlite3-wandbox": { compiler: "sqlite-TEST" },
    });
    await executor.execute({
      profileId: "sql-sqlite3-wandbox",
      sourceCode: "SELECT 1;",
      stdin: "",
    });
    expect(lastBody()).toEqual({
      compiler: "sqlite-TEST",
      "compiler-option-raw": "",
      code: "SELECT 1;",
      stdin: "",
      save: false,
    });
  });

  it("runTests antepone el fixture (TestCase.stdin) al código y manda stdin real vacío — SÓLO para SQL", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {
      "sql-sqlite3-wandbox": { compiler: "sqlite-TEST" },
    });
    await executor.runTests(
      { profileId: "sql-sqlite3-wandbox", sourceCode: "SELECT * FROM t;" },
      [
        {
          id: "t1",
          stdin: "CREATE TABLE t(x INTEGER); INSERT INTO t VALUES(1);",
          expectedStdout: "1",
          visible: true,
          description: null,
        },
      ],
    );
    const body = lastBody();
    expect(body.code).toBe(
      "CREATE TABLE t(x INTEGER); INSERT INTO t VALUES(1);\nSELECT * FROM t;",
    );
    expect(body.stdin).toBe("");
  });

  it("dos fixtures ocultos distintos con la MISMA query producen peticiones distintas", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {
      "sql-sqlite3-wandbox": { compiler: "sqlite-TEST" },
    });
    await executor.runTests(
      { profileId: "sql-sqlite3-wandbox", sourceCode: "SELECT COUNT(*) FROM t;" },
      [
        {
          id: "a",
          stdin: "CREATE TABLE t(x INTEGER); INSERT INTO t VALUES(1);",
          expectedStdout: "1",
          visible: true,
          description: null,
        },
        {
          id: "b",
          stdin: "CREATE TABLE t(x INTEGER); INSERT INTO t VALUES(1),(2);",
          expectedStdout: "2",
          visible: false,
          description: null,
        },
      ],
    );
    const codes = fetchMock.mock.calls.map(
      (c) => JSON.parse((c[1] as { body: string }).body).code as string,
    );
    expect(codes).toHaveLength(2);
    expect(codes[0]).not.toBe(codes[1]);
    expect(codes[0]).toContain("VALUES(1);");
    expect(codes[1]).toContain("VALUES(1),(2);");
  });

  it("C++ y C# NO cambian su semántica de stdin (sólo SQL antepone fixture)", async () => {
    const executor = new WandboxExecutor("https://wandbox.org", {});
    await executor.runTests(
      { profileId: "cpp17-wandbox", sourceCode: "int main(){}" },
      [
        {
          id: "t1",
          stdin: "5\n",
          expectedStdout: "5",
          visible: true,
          description: null,
        },
      ],
    );
    const body = lastBody();
    expect(body.code).toBe("int main(){}");
    expect(body.stdin).toBe("5\n");
  });
});

describe("Piston por perfil", () => {
  it("C++ conserva lenguaje, versión y nombre de archivo", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        language: "c++",
        version: "10.2.0",
        run: { stdout: "", stderr: "", code: 0, signal: null, output: "" },
      }),
      text: async () => "",
    });
    const executor = new PistonExecutor("https://piston.test", {});
    await executor.execute({
      profileId: "cpp17-wandbox",
      sourceCode: "int main(){}",
    });
    const body = lastBody() as { language: string; version: string; files: { name: string }[] };
    expect(body.language).toBe("c++");
    expect(body.version).toBe("10.2.0");
    expect(body.files[0].name).toBe("main.cpp");
  });

  it("sin PISTON_CSHARP_VERSION el perfil de C# no está disponible", () => {
    const executor = new PistonExecutor("https://piston.test", {});
    expect(executor.supportsProfile("csharp-mono-6.12")).toBe(false);
    expect(executor.supportsProfile("cpp17-wandbox")).toBe(true);
  });

  it("con versión configurada usa csharp y Program.cs", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        language: "csharp",
        version: "6.12.0",
        run: { stdout: "", stderr: "", code: 0, signal: null, output: "" },
      }),
      text: async () => "",
    });
    const executor = new PistonExecutor("https://piston.test", {
      "csharp-mono-6.12": { version: "6.12.0" },
    });
    await executor.execute({
      profileId: "csharp-mono-6.12",
      sourceCode: "class Program {}",
    });
    const body = lastBody() as { language: string; files: { name: string }[] };
    expect(body.language).toBe("csharp");
    expect(body.files[0].name).toBe("Program.cs");
  });

  it("Piston no finge soportar SQL: falla cerrado, nunca compila con otro lenguaje", async () => {
    const executor = new PistonExecutor("https://piston.test", {});
    expect(executor.supportsProfile("sql-sqlite3-wandbox")).toBe(false);
    await expect(
      executor.execute({
        profileId: "sql-sqlite3-wandbox",
        sourceCode: "SELECT 1;",
      }),
    ).rejects.toBeInstanceOf(ExecutorProfileUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("un 401 del endpoint público no cae a otro lenguaje", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
      text: async () => "Unauthorized",
    });
    const executor = new PistonExecutor("https://piston.test", {
      "csharp-mono-6.12": { version: "6.12.0" },
    });
    await expect(
      executor.execute({
        profileId: "csharp-mono-6.12",
        sourceCode: "class Program {}",
      }),
    ).rejects.toThrow(/401/);
    // Una sola petición: no hubo reintento con otro lenguaje.
    const languages = fetchMock.mock.calls.map(
      (c) => JSON.parse((c[1] as { body: string }).body).language,
    );
    expect(new Set(languages)).toEqual(new Set(["csharp"]));
  });
});

describe("Judge0 por perfil", () => {
  it("C++ conserva el language id por defecto", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        stdout: "",
        stderr: null,
        compile_output: null,
        message: null,
        exit_code: 0,
        exit_signal: null,
        status: { id: 3, description: "Accepted" },
        time: "0.01",
        memory: 100,
        token: "t",
      }),
      text: async () => "",
    });
    const executor = new Judge0Executor("https://judge0.test", {}, {});
    await executor.execute({
      profileId: "cpp17-wandbox",
      sourceCode: "int main(){}",
    });
    expect(lastBody().language_id).toBe(54);
  });

  it("sin JUDGE0_CSHARP_LANGUAGE_ID el perfil de C# no está disponible", async () => {
    const executor = new Judge0Executor("https://judge0.test", {}, {});
    expect(executor.supportsProfile("csharp-mono-6.12")).toBe(false);
    await expect(
      executor.execute({
        profileId: "csharp-mono-6.12",
        sourceCode: "class Program {}",
      }),
    ).rejects.toBeInstanceOf(ExecutorProfileUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("Judge0 no finge soportar SQL: falla cerrado, nunca compila con otro lenguaje", async () => {
    const executor = new Judge0Executor("https://judge0.test", {}, {});
    expect(executor.supportsProfile("sql-sqlite3-wandbox")).toBe(false);
    await expect(
      executor.execute({
        profileId: "sql-sqlite3-wandbox",
        sourceCode: "SELECT 1;",
      }),
    ).rejects.toBeInstanceOf(ExecutorProfileUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("nunca hornea un id de C#: usa el configurado", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        stdout: "",
        stderr: null,
        compile_output: null,
        message: null,
        exit_code: 0,
        exit_signal: null,
        status: { id: 3, description: "Accepted" },
        time: "0.01",
        memory: 100,
        token: "t",
      }),
      text: async () => "",
    });
    const executor = new Judge0Executor(
      "https://judge0.test",
      {},
      { "csharp-mono-6.12": { languageId: 51 } },
    );
    await executor.execute({
      profileId: "csharp-mono-6.12",
      sourceCode: "class Program {}",
    });
    expect(lastBody().language_id).toBe(51);
  });
});
