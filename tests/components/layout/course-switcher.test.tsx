import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app/c/cpp-desde-cero",
  useRouter: () => ({ push: vi.fn() }),
}));

import {
  CourseSwitcher,
  courseSwitcherSubtitle,
} from "@/features/courses/components/course-switcher";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const COURSES = [
  {
    slug: "cpp-desde-cero",
    title: "C++ desde cero",
    languageLabel: "C++",
    curriculumSummary: "Semestres 1 y 2",
  },
  {
    slug: "csharp-poo-1",
    title: "Programación Orientada a Objetos I con C#",
    languageLabel: "C#",
    curriculumSummary: null,
  },
];

const USER = {
  name: "Ana",
  email: "ana@example.com",
  image: null,
  username: "ana",
};

/**
 * UX-01: el curso actual tiene que ser una ACCIÓN visible en los dos
 * breakpoints, no un rótulo del rail.
 */
describe("CourseSwitcher", () => {
  it("nombra el curso actual y anuncia que se puede cambiar", () => {
    const html = renderToStaticMarkup(
      <CourseSwitcher courses={COURSES} activeSlug="cpp-desde-cero" />,
    );
    expect(html).toContain("C++ desde cero");
    expect(html).toContain("Curso actual: C++ desde cero. Cambiar curso");
    expect(html).toContain("<button");
  });

  it("sin selección invita a elegir en vez de mentir sobre el curso", () => {
    const html = renderToStaticMarkup(
      <CourseSwitcher courses={COURSES} activeSlug={null} />,
    );
    expect(html).toContain("Elegir curso");
  });

  it("con curriculumSummary: el subtítulo del menú es lenguaje · resumen", () => {
    expect(courseSwitcherSubtitle(COURSES[0], false)).toBe(
      "C++ · Semestres 1 y 2",
    );
    expect(courseSwitcherSubtitle(COURSES[0], true)).toBe(
      "C++ · Semestres 1 y 2 · curso actual",
    );
  });

  it("sin curriculumSummary: conserva el comportamiento anterior (sólo lenguaje)", () => {
    expect(courseSwitcherSubtitle(COURSES[1], false)).toBe("C#");
    expect(courseSwitcherSubtitle(COURSES[1], true)).toBe("C# · curso actual");
  });
});

describe("el shell expone el cambio de curso en desktop y en móvil", () => {
  it("el rail de escritorio lo monta", () => {
    const html = renderToStaticMarkup(
      <Sidebar courseSlug="cpp-desde-cero" courses={COURSES} units={[]} />,
    );
    expect(html).toContain("Curso actual: C++ desde cero. Cambiar curso");
  });

  it("la barra superior lo monta para móvil (oculto a partir de lg)", () => {
    const html = renderToStaticMarkup(
      <Topbar
        courseSlug="csharp-poo-1"
        courses={COURSES}
        user={USER}
        totalXp={0}
        streak={0}
        units={[]}
      />,
    );
    expect(html).toContain(
      "Curso actual: Programación Orientada a Objetos I con C#. Cambiar curso",
    );
    expect(html).toContain("lg:hidden");
  });
});
