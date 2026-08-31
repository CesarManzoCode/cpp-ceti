import { describe, expect, it } from "vitest";

import {
  LEGACY_CPP_COURSE_SLUG,
  coursePath,
  legacyRedirect,
} from "@/lib/courses";

describe("rutas canónicas", () => {
  it("todas llevan el curso", () => {
    expect(coursePath.home("csharp-poo-1")).toBe("/app/c/csharp-poo-1");
    expect(coursePath.unit("csharp-poo-1", "u1")).toBe(
      "/app/c/csharp-poo-1/u/u1",
    );
    expect(coursePath.lesson("csharp-poo-1", "u1", "l1")).toBe(
      "/app/c/csharp-poo-1/u/u1/l1",
    );
    expect(coursePath.practiceList("csharp-poo-1")).toBe(
      "/app/c/csharp-poo-1/ejercicios",
    );
    expect(coursePath.practice("csharp-poo-1", "e1")).toBe(
      "/app/c/csharp-poo-1/ejercicios/e1",
    );
  });

  it("dos cursos con el MISMO slug de unidad dan rutas distintas", () => {
    expect(coursePath.unit("cpp-desde-cero", "arreglos")).not.toBe(
      coursePath.unit("csharp-poo-1", "arreglos"),
    );
  });
});

describe("redirecciones legacy", () => {
  it("apuntan al curso de C++ conservando el slug del recurso", () => {
    expect(legacyRedirect.unit("primer-programa")).toBe(
      `/app/c/${LEGACY_CPP_COURSE_SLUG}/u/primer-programa`,
    );
    expect(legacyRedirect.lesson("primer-programa", "hola-mundo")).toBe(
      `/app/c/${LEGACY_CPP_COURSE_SLUG}/u/primer-programa/hola-mundo`,
    );
    expect(legacyRedirect.practiceList()).toBe(
      `/app/c/${LEGACY_CPP_COURSE_SLUG}/ejercicios`,
    );
    expect(legacyRedirect.practice("u01-firma")).toBe(
      `/app/c/${LEGACY_CPP_COURSE_SLUG}/ejercicios/u01-firma`,
    );
  });

  it("conserva el paso: un enlace al paso 4 sigue cayendo en el paso 4", () => {
    expect(legacyRedirect.lesson("loops", "for", "4")).toBe(
      `/app/c/${LEGACY_CPP_COURSE_SLUG}/u/loops/for?p=4`,
    );
  });

  it("sin paso no inventa query string", () => {
    expect(legacyRedirect.lesson("loops", "for", null)).not.toContain("?");
    expect(legacyRedirect.lesson("loops", "for", undefined)).not.toContain("?");
  });

  it("el slug legacy del curso NO cambió", () => {
    // Si esto falla, todos los marcadores viejos y el backfill de la
    // migración apuntan a un curso que ya no existe.
    expect(LEGACY_CPP_COURSE_SLUG).toBe("cpp-desde-cero");
  });
});
