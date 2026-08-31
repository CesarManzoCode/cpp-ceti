import { describe, expect, it } from "vitest";

import {
  EXECUTION_PROFILE_IDS,
  LANGUAGE_IDS,
  LANGUAGE_PROFILES,
  UnknownLanguageError,
  assertLanguagePair,
  isCompatible,
  isExecutionProfileId,
  isLanguageId,
  languageFromFence,
  languageOfProfile,
} from "@/lib/code-languages";

describe("registro de lenguajes", () => {
  it("cada lenguaje declara sólo perfiles que le pertenecen", () => {
    for (const id of LANGUAGE_IDS) {
      for (const profile of LANGUAGE_PROFILES[id].executionProfiles) {
        expect(languageOfProfile(profile)).toBe(id);
      }
    }
  });

  it("todo perfil registrado pertenece a exactamente un lenguaje", () => {
    for (const profile of EXECUTION_PROFILE_IDS) {
      const owners = LANGUAGE_IDS.filter((id) =>
        (LANGUAGE_PROFILES[id].executionProfiles as readonly string[]).includes(
          profile,
        ),
      );
      expect(owners).toHaveLength(1);
    }
  });

  it("ningún fence de markdown se comparte entre lenguajes", () => {
    const seen = new Set<string>();
    for (const id of LANGUAGE_IDS) {
      for (const fence of LANGUAGE_PROFILES[id].markdownFences) {
        expect(seen.has(fence)).toBe(false);
        seen.add(fence);
      }
    }
  });

  it("C++ conserva su modelo y su archivo", () => {
    expect(LANGUAGE_PROFILES.cpp.monacoLanguage).toBe("cpp");
    expect(LANGUAGE_PROFILES.cpp.defaultFileName).toBe("main.cpp");
    expect(LANGUAGE_PROFILES.cpp.executionProfiles).toEqual(["cpp17-wandbox"]);
  });

  it("C# usa Program.cs y el perfil Mono", () => {
    expect(LANGUAGE_PROFILES.csharp.monacoLanguage).toBe("csharp");
    expect(LANGUAGE_PROFILES.csharp.defaultFileName).toBe("Program.cs");
    expect(LANGUAGE_PROFILES.csharp.executionProfiles).toEqual([
      "csharp-mono-6.12",
    ]);
  });
});

describe("guardas de tipo", () => {
  it("reconoce sólo los ids registrados", () => {
    expect(isLanguageId("cpp")).toBe(true);
    expect(isLanguageId("csharp")).toBe(true);
    expect(isLanguageId("python")).toBe(false);
    expect(isLanguageId(undefined)).toBe(false);
    expect(isExecutionProfileId("csharp-mono-6.12")).toBe(true);
    expect(isExecutionProfileId("csharp-dotnet-8")).toBe(false);
  });

  it("un perfil no compatible con su lenguaje no pasa", () => {
    expect(isCompatible("csharp", "cpp17-wandbox")).toBe(false);
    expect(isCompatible("cpp", "csharp-mono-6.12")).toBe(false);
    expect(isCompatible("cpp", "cpp17-wandbox")).toBe(true);
  });
});

describe("assertLanguagePair falla cerrado", () => {
  it("acepta un par válido", () => {
    expect(assertLanguagePair("csharp", "csharp-mono-6.12", "test")).toEqual({
      language: "csharp",
      executionProfile: "csharp-mono-6.12",
    });
  });

  it("rechaza lenguaje desconocido", () => {
    expect(() => assertLanguagePair("rust", "cpp17-wandbox", "test")).toThrow(
      UnknownLanguageError,
    );
  });

  it("rechaza perfil desconocido", () => {
    expect(() => assertLanguagePair("cpp", "gcc-99", "test")).toThrow(
      UnknownLanguageError,
    );
  });

  it("rechaza el cruce lenguaje/perfil — NUNCA cae a C++", () => {
    expect(() =>
      assertLanguagePair("csharp", "cpp17-wandbox", "curso X"),
    ).toThrow(/no pertenece al lenguaje csharp/);
  });

  it("languageOfProfile lanza en lugar de adivinar", () => {
    expect(() =>
      languageOfProfile("inventado" as never),
    ).toThrow(UnknownLanguageError);
  });
});

describe("languageFromFence", () => {
  it("mapea los alias de cada lenguaje", () => {
    expect(languageFromFence("cpp")).toBe("cpp");
    expect(languageFromFence("c++")).toBe("cpp");
    expect(languageFromFence("csharp")).toBe("csharp");
    expect(languageFromFence("cs")).toBe("csharp");
    expect(languageFromFence("CSharp")).toBe("csharp");
  });

  it("un fence desconocido no inventa lenguaje", () => {
    expect(languageFromFence("python")).toBeNull();
    expect(languageFromFence(undefined)).toBeNull();
  });
});
