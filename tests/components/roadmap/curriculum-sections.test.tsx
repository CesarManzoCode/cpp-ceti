import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RoadmapUnits } from "@/features/roadmap/components/roadmap-units";
import type { RoadmapUnit } from "@/features/roadmap/types";

function unit(overrides: Partial<RoadmapUnit> & Pick<RoadmapUnit, "slug" | "order">): RoadmapUnit {
  return {
    title: `Unidad ${overrides.slug}`,
    published: true,
    lessonCount: 3,
    completedCount: 0,
    curriculumSection: null,
    ...overrides,
  };
}

/**
 * Curso SIN curriculum: exactamente el flujo plano de siempre. Ninguna de
 * las unidades trae `curriculumSection`.
 */
const FLAT_UNITS: RoadmapUnit[] = [
  unit({ slug: "u1", order: 1, title: "Unidad uno" }),
  unit({ slug: "u2", order: 2, title: "Unidad dos" }),
];

const S1: RoadmapUnit["curriculumSection"] = {
  key: "s1-fundamentos-desarrollo-software",
  semester: 1,
  subjectName: "Fundamentos de Desarrollo de Software",
  order: 1,
};

const S2: RoadmapUnit["curriculumSection"] = {
  key: "s2-programacion-estructurada",
  semester: 2,
  subjectName: "Programación Estructurada",
  order: 2,
};

/** Réplica reducida del contrato de C++: printf-scanf (S1) antes de funciones (S2). */
const CURRICULUM_UNITS: RoadmapUnit[] = [
  unit({
    slug: "loops",
    order: 5,
    title: "Loops",
    curriculumSection: S1,
    lessonCount: 6,
    completedCount: 6,
  }),
  unit({
    slug: "printf-scanf",
    order: 6,
    title: "printf y scanf",
    curriculumSection: S1,
    lessonCount: 6,
    completedCount: 3,
  }),
  unit({
    slug: "funciones",
    order: 7,
    title: "Funciones",
    curriculumSection: S2,
    lessonCount: 6,
    completedCount: 0,
  }),
  unit({
    slug: "arreglos",
    order: 8,
    title: "Arreglos",
    curriculumSection: S2,
    lessonCount: 7,
    completedCount: 0,
  }),
];

describe("RoadmapUnits: cursos SIN curriculum", () => {
  it("renderiza la lista plana de siempre — sin headers de sección", () => {
    const html = renderToStaticMarkup(
      <RoadmapUnits courseSlug="curso-general" units={FLAT_UNITS} />,
    );
    expect(html).toContain("Unidad uno");
    expect(html).toContain("Unidad dos");
    expect(html).not.toContain("semestre");
    // El formato de header ("X / Y lecciones") no aparece; sólo el de la
    // card de unidad de siempre ("X de Y lecciones · Z%").
    expect(html).not.toMatch(/\d+ \/ \d+ lecciones/);
  });
});

describe("RoadmapUnits: curso CON curriculum", () => {
  it("una sola sección: un header, con subjectName y semestre", () => {
    const html = renderToStaticMarkup(
      <RoadmapUnits
        courseSlug="cpp-desde-cero"
        units={[
          unit({
            slug: "loops",
            order: 5,
            title: "Loops",
            curriculumSection: S1,
            lessonCount: 6,
            completedCount: 6,
          }),
          unit({
            slug: "printf-scanf",
            order: 6,
            title: "printf y scanf",
            curriculumSection: S1,
            lessonCount: 6,
            completedCount: 3,
          }),
        ]}
      />,
    );
    expect(html).toContain("1.er semestre");
    expect(html).toContain("Fundamentos de Desarrollo de Software");
    // Progreso derivado sumando completedCount/lessonCount de sus Units: 6+3=9 / 6+6=12.
    expect(html).toContain("9 / 12 lecciones");
  });

  it("múltiples secciones: un header por sección, con su subjectName", () => {
    const html = renderToStaticMarkup(
      <RoadmapUnits courseSlug="cpp-desde-cero" units={CURRICULUM_UNITS} />,
    );
    expect(html).toContain("Fundamentos de Desarrollo de Software");
    expect(html).toContain("Programación Estructurada");
    expect(html).toContain("1.er semestre");
    expect(html).toContain("2.º semestre");
  });

  it("preserva Unit.order global: printf-scanf (S1) se renderiza antes que funciones (S2)", () => {
    const html = renderToStaticMarkup(
      <RoadmapUnits courseSlug="cpp-desde-cero" units={CURRICULUM_UNITS} />,
    );
    const printfIdx = html.indexOf("printf y scanf");
    const funcionesIdx = html.indexOf("Funciones");
    expect(printfIdx).toBeGreaterThan(-1);
    expect(funcionesIdx).toBeGreaterThan(-1);
    expect(printfIdx).toBeLessThan(funcionesIdx);
  });

  it("el header de una sección aparece ANTES de su primera unidad, no antes de la unidad previa de otra sección", () => {
    const html = renderToStaticMarkup(
      <RoadmapUnits courseSlug="cpp-desde-cero" units={CURRICULUM_UNITS} />,
    );
    const s2HeaderIdx = html.indexOf("Programación Estructurada");
    const loopsIdx = html.indexOf("Loops");
    const funcionesIdx = html.indexOf("Funciones");
    // El header S2 va después de "Loops" (última unidad de S1 antes del corte)
    // y antes de "Funciones" (primera unidad de S2).
    expect(loopsIdx).toBeLessThan(s2HeaderIdx);
    expect(s2HeaderIdx).toBeLessThan(funcionesIdx);
  });

  it("progreso por sección: S2 (funciones + arreglos) suma 0 / 13", () => {
    const html = renderToStaticMarkup(
      <RoadmapUnits courseSlug="cpp-desde-cero" units={CURRICULUM_UNITS} />,
    );
    expect(html).toContain("0 / 13 lecciones");
  });
});
