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
