import { describe, expect, it } from "vitest";

import {
  exerciseCourseWhere,
  lessonCourseWhere,
  practiceCourseWhere,
} from "@/features/analytics/queries";

/**
 * El curso de una métrica se DERIVA por relación desde el recurso. No hay
 * columna de curso en el evento ni etiqueta mandada por el cliente, así que
 * lo único que puede romperse en silencio es la ruta de la relación: si se
 * equivoca, el filtro deja de filtrar y el panel miente sin fallar.
 */
describe("filtro de curso en analytics", () => {
  it("sin curso, la consulta es exactamente la de antes", () => {
    // Un objeto vacío al hacer spread no agrega ninguna condición: los
    // reportes históricos siguen produciendo el mismo SQL.
    expect(lessonCourseWhere(undefined)).toEqual({});
    expect(practiceCourseWhere(undefined)).toEqual({});
    expect(exerciseCourseWhere(undefined)).toEqual({});
  });

  it("una lección llega a su curso por la unidad", () => {
    expect(lessonCourseWhere("c1")).toEqual({
      lesson: { unit: { courseId: "c1" } },
    });
  });

  it("una práctica es dueña directa de su curso", () => {
    expect(practiceCourseWhere("c1")).toEqual({
      practiceExercise: { courseId: "c1" },
    });
  });

  it("un reto llega a su curso por paso → lección → unidad", () => {
    expect(exerciseCourseWhere("c1")).toEqual({
      exercise: { step: { lesson: { unit: { courseId: "c1" } } } },
    });
  });

  it("el filtro nunca nombra un campo de curso en el evento", () => {
    // Si algún día apareciera `courseId` directo sobre `product_event`,
    // sería una etiqueta duplicada que se podría desincronizar del recurso.
    const clauses = [
      lessonCourseWhere("c1"),
      practiceCourseWhere("c1"),
      exerciseCourseWhere("c1"),
    ];
    for (const clause of clauses) {
      expect(Object.keys(clause)).not.toContain("courseId");
      expect(Object.keys(clause)).not.toContain("language");
    }
  });
});
