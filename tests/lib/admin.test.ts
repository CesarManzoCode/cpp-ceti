import { describe, expect, it } from "vitest";

import { isBootstrapAdmin } from "@/lib/admin";

describe("isBootstrapAdmin", () => {
  it("acepta el correo listado, sin importar mayúsculas ni espacios", () => {
    expect(isBootstrapAdmin("Profe@ceti.mx", " profe@ceti.mx ,otro@x.com")).toBe(
      true,
    );
  });

  it("rechaza un correo que no está en la lista", () => {
    expect(isBootstrapAdmin("alumno@ceti.mx", "profe@ceti.mx")).toBe(false);
  });

  it("rechaza todo si la variable no está configurada", () => {
    expect(isBootstrapAdmin("profe@ceti.mx", undefined)).toBe(false);
    expect(isBootstrapAdmin("profe@ceti.mx", "")).toBe(false);
  });

  it("no acepta un correo vacío contra una lista con comas sueltas", () => {
    expect(isBootstrapAdmin("", ",,")).toBe(false);
    expect(isBootstrapAdmin("   ", "profe@ceti.mx,,")).toBe(false);
  });

  it("no hace match por prefijo ni por subcadena", () => {
    expect(isBootstrapAdmin("profe@ceti.mx.attacker.com", "profe@ceti.mx")).toBe(
      false,
    );
  });
});
