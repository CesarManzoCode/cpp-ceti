import { describe, expect, it } from "vitest";

import { zodIssuesToFieldErrors } from "@/components/ui/form-field";

describe("zodIssuesToFieldErrors", () => {
  it("devuelve {} sin issues", () => {
    expect(zodIssuesToFieldErrors([])).toEqual({});
  });

  it("mapea un issue al primer segmento del path", () => {
    expect(
      zodIssuesToFieldErrors([
        { path: ["email"], message: "Correo inválido" },
      ]),
    ).toEqual({ email: "Correo inválido" });
  });

  it("preserva el PRIMER error por campo, ignora duplicados", () => {
    const out = zodIssuesToFieldErrors([
      { path: ["password"], message: "Muy corta" },
      { path: ["password"], message: "Sin números" },
    ]);
    expect(out).toEqual({ password: "Muy corta" });
  });

  it("ignora paths cuyo primer elemento no es string", () => {
    const out = zodIssuesToFieldErrors([
      { path: [0], message: "no debería entrar" },
      { path: ["name"], message: "sí entra" },
    ]);
    expect(out).toEqual({ name: "sí entra" });
  });

  it("acepta path vacío sin crashear", () => {
    expect(
      zodIssuesToFieldErrors([{ path: [], message: "raíz" }]),
    ).toEqual({});
  });
});
