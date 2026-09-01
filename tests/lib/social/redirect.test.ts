import { describe, expect, it } from "vitest";

import { safeInternalRedirect } from "@/lib/social/redirect";

describe("safeInternalRedirect", () => {
  it("acepta un path interno normal", () => {
    expect(safeInternalRedirect("/app/amigos")).toBe("/app/amigos");
  });

  it("rechaza protocol-relative (//host)", () => {
    expect(safeInternalRedirect("//evil.com")).toBe("/app");
  });

  it("rechaza esquemas absolutos", () => {
    expect(safeInternalRedirect("http://evil.com")).toBe("/app");
    expect(safeInternalRedirect("https://evil.com/app")).toBe("/app");
    expect(safeInternalRedirect("javascript:alert(1)")).toBe("/app");
  });

  it("rechaza valores que no empiezan con /", () => {
    expect(safeInternalRedirect("app/amigos")).toBe("/app");
    expect(safeInternalRedirect("")).toBe("/app");
    expect(safeInternalRedirect(null)).toBe("/app");
    expect(safeInternalRedirect(undefined)).toBe("/app");
  });

  it("rechaza backslashes que un navegador podría tratar como //", () => {
    expect(safeInternalRedirect("/\\evil.com")).toBe("/app");
  });

  it("respeta un fallback custom", () => {
    expect(safeInternalRedirect(null, "/login")).toBe("/login");
  });

  it("decodifica URI-encoding antes de validar", () => {
    expect(safeInternalRedirect("%2F%2Fevil.com")).toBe("/app");
  });
});
