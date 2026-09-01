import { describe, expect, it } from "vitest";

import { pickCourse } from "@/lib/course-selection";

const CPP = { slug: "cpp-desde-cero" };
const CSHARP = { slug: "csharp-poo-1" };

describe("pickCourse", () => {
  it("sin cursos publicados no hay nada que mostrar", () => {
    expect(pickCourse([], null)).toEqual({ kind: "empty" });
    expect(pickCourse([], "cpp-desde-cero")).toEqual({ kind: "empty" });
  });

  it("con un solo curso entra directo: no hay ambigüedad que resolver", () => {
    expect(pickCourse([CPP], null)).toEqual({ kind: "course", course: CPP });
  });

  it("con varios cursos y sin selección, PREGUNTA", () => {
    // Esta es la regla que evita mandar a un alumno de POO I al curso de
    // C++ sólo porque ordena primero.
    expect(pickCourse([CPP, CSHARP], null)).toEqual({ kind: "choose" });
  });

  it("respeta la selección recordada", () => {
    expect(pickCourse([CPP, CSHARP], "csharp-poo-1")).toEqual({
      kind: "course",
      course: CSHARP,
    });
  });

  it("una cookie que no corresponde a ningún curso se ignora", () => {
    expect(pickCourse([CPP, CSHARP], "curso-borrado")).toEqual({
      kind: "choose",
    });
  });

  it("una cookie inválida no fuerza el curso equivocado con un solo curso", () => {
    expect(pickCourse([CSHARP], "cpp-desde-cero")).toEqual({
      kind: "course",
      course: CSHARP,
    });
  });

  // Regresión: el shell (rail, unidades, switcher) se desincronizaba de la
  // URL cuando la cookie recordaba OTRO curso — la cookie es memoria para
  // rutas globales, no autoridad en `/app/c/[courseSlug]/...`.
  it("en una ruta de curso, la URL manda aunque la cookie recuerde otro", () => {
    expect(
      pickCourse([CPP, CSHARP], "csharp-poo-1", "cpp-desde-cero"),
    ).toEqual({ kind: "course", course: CPP });

    expect(
      pickCourse([CPP, CSHARP], "cpp-desde-cero", "csharp-poo-1"),
    ).toEqual({ kind: "course", course: CSHARP });
  });
});
