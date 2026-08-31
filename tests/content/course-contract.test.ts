import { describe, expect, it } from "vitest";

import { allCourses } from "../../prisma/content";
import { allPracticeSets } from "../../prisma/content/exercises";
import type { StepDefinition } from "../../prisma/content/types";
import { isCompatible, LANGUAGE_PROFILES } from "@/lib/code-languages";

/**
 * Contrato estructural del contenido. Corre sin base de datos: si algo de
 * esto falla, el seed produciría contenido inconsistente o inejecutable.
 */

const courseBySlug = new Map(allCourses.map((c) => [c.slug, c]));

describe("contrato de curso", () => {
  it("los slugs de curso son únicos", () => {
    expect(courseBySlug.size).toBe(allCourses.length);
  });

  it.each(allCourses.map((c) => [c.slug, c] as const))(
    "%s declara un par (lenguaje, perfil) válido y metadatos académicos",
    (_slug, course) => {
      expect(isCompatible(course.language, course.executionProfile)).toBe(true);
      expect(course.subjectName.trim().length).toBeGreaterThan(0);
      expect(course.academicContext.trim().length).toBeGreaterThan(0);
      expect(course.title.trim().length).toBeGreaterThan(0);
      expect(course.description.trim().length).toBeGreaterThan(0);
    },
  );

  it("el curso de C++ conserva su identidad histórica", () => {
    const cpp = courseBySlug.get("cpp-desde-cero");
    expect(cpp).toBeDefined();
    expect(cpp!.language).toBe("cpp");
    expect(cpp!.executionProfile).toBe("cpp17-wandbox");
  });

  it.each(allCourses.map((c) => [c.slug, c] as const))(
    "%s: slugs de unidad y de lección únicos dentro de su padre",
    (_slug, course) => {
      const unitSlugs = course.units.map((u) => u.slug);
      expect(new Set(unitSlugs).size).toBe(unitSlugs.length);
      for (const unit of course.units) {
        const lessonSlugs = unit.lessons.map((l) => l.slug);
        expect(new Set(lessonSlugs).size).toBe(lessonSlugs.length);
        expect(lessonSlugs.length).toBeGreaterThan(0);
      }
    },
  );

  it.each(allCourses.map((c) => [c.slug, c] as const))(
    "%s: cada lección tiene pasos y cada paso es coherente",
    (_slug, course) => {
      for (const unit of course.units) {
        for (const lesson of unit.lessons) {
          expect(lesson.steps.length).toBeGreaterThan(0);
          for (const step of lesson.steps) {
            assertStepShape(step, `${unit.slug}/${lesson.slug}`);
          }
        }
      }
    },
  );
});

function assertStepShape(step: StepDefinition, where: string) {
  switch (step.type) {
    case "theory":
      expect(step.markdown.trim().length, where).toBeGreaterThan(0);
      break;
    case "code_example":
      expect(step.code.trim().length, where).toBeGreaterThan(0);
      expect(step.explanation.trim().length, where).toBeGreaterThan(0);
      // Una nota "sólo local" sobre un ejemplo ejecutable se contradice a
      // sí misma: o corre en el navegador, o no corre.
      if (step.localOnlyNote) {
        expect(
          step.runnable === true,
          `${where}: localOnlyNote en un ejemplo ejecutable`,
        ).toBe(false);
      }
      break;
    case "quiz":
      expect(step.options.length, where).toBeGreaterThanOrEqual(2);
      expect(step.correctIndex, where).toBeGreaterThanOrEqual(0);
      expect(step.correctIndex, where).toBeLessThan(step.options.length);
      if (step.feedbackPerOption) {
        expect(step.feedbackPerOption.length, where).toBe(step.options.length);
      }
      break;
    case "fill_blank": {
      // Los huecos se marcan `{{n}}` en la plantilla. Cada blank definido
      // debe tener su hueco y ningún hueco puede apuntar fuera del arreglo.
      const holes = [...step.template.matchAll(/\{\{(\d+)\}\}/g)].map((m) =>
        Number(m[1]),
      );
      expect(new Set(holes).size, `${where}: huecos únicos`).toBe(
        step.blanks.length,
      );
      for (const h of holes) {
        expect(h, `${where}: hueco {{${h}}} fuera de rango`).toBeLessThan(
          step.blanks.length,
        );
      }
      step.blanks.forEach((b, i) => {
        expect(holes, `${where}: falta el hueco {{${i}}}`).toContain(i);
        expect(b.answer.length, `${where} blank ${i}`).toBeGreaterThan(0);
        if (b.matchBlank !== undefined) {
          expect(b.matchBlank, `${where} blank ${i}`).toBeLessThan(
            step.blanks.length,
          );
          expect(b.matchBlank, `${where} blank ${i}`).not.toBe(i);
        }
      });
      break;
    }
    case "code_challenge": {
      const ex = step.exercise;
      expect(ex.prompt.trim().length, where).toBeGreaterThan(0);
      expect(ex.solutionCode.trim().length, where).toBeGreaterThan(0);
      expect(ex.testCases.length, `${where}: sin tests`).toBeGreaterThan(0);
      break;
    }
    case "matching":
      expect(step.pairs.length, where).toBeGreaterThanOrEqual(2);
      break;
    case "code_completion":
      expect(step.lines.length, where).toBeGreaterThanOrEqual(2);
      break;
  }
}

describe("contrato de prácticas", () => {
  it("cada conjunto apunta a un curso y a una unidad que existen", () => {
    for (const set of allPracticeSets) {
      const course = courseBySlug.get(set.courseSlug);
      expect(course, `conjunto ${set.unitSlug}: curso ${set.courseSlug}`).toBeDefined();
      const unit = course!.units.find((u) => u.slug === set.unitSlug);
      expect(
        unit,
        `curso ${set.courseSlug} no tiene la unidad ${set.unitSlug}`,
      ).toBeDefined();
    }
  });

  it("los slugs de ejercicio son únicos DENTRO de cada curso", () => {
    const byCourse = new Map<string, Set<string>>();
    for (const set of allPracticeSets) {
      const seen = byCourse.get(set.courseSlug) ?? new Set<string>();
      for (const ex of set.exercises) {
        expect(
          seen.has(ex.slug),
          `slug duplicado en ${set.courseSlug}: ${ex.slug}`,
        ).toBe(false);
        seen.add(ex.slug);
      }
      byCourse.set(set.courseSlug, seen);
    }
  });

  it("cada ejercicio trae enunciado, solución y tests", () => {
    for (const set of allPracticeSets) {
      for (const ex of set.exercises) {
        expect(ex.prompt.trim().length, ex.slug).toBeGreaterThan(0);
        expect(ex.solutionCode.trim().length, ex.slug).toBeGreaterThan(0);
        expect(ex.testCases.length, ex.slug).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Regla anti-hardcode. Un ejercicio que lee stdin debe tener al menos un
   * test OCULTO cuya entrada NO aparezca en ningún test visible: sólo así
   * una solución que imprima la salida de ejemplo falla.
   */
  it("un output hardcodeado no puede pasar un ejercicio que lee stdin", () => {
    for (const set of allPracticeSets) {
      for (const ex of set.exercises) {
        const readsInput = ex.testCases.some(
          (tc) => (tc.stdin ?? "").trim().length > 0,
        );
        if (!readsInput) continue;
        const visibleInputs = new Set(
          ex.testCases
            .filter((tc) => tc.visible !== false)
            .map((tc) => tc.stdin ?? ""),
        );
        const discriminating = ex.testCases.filter(
          (tc) => tc.visible === false && !visibleInputs.has(tc.stdin ?? ""),
        );
        expect(
          discriminating.length,
          `${ex.slug}: ningún test oculto usa una entrada distinta a las visibles`,
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

describe("baseline de contenido C++", () => {
  const cpp = courseBySlug.get("cpp-desde-cero")!;

  it("conserva 10 unidades, 67 lecciones y 314 pasos", () => {
    const lessons = cpp.units.flatMap((u) => u.lessons);
    const steps = lessons.flatMap((l) => l.steps);
    expect(cpp.units.length).toBe(10);
    expect(lessons.length).toBe(67);
    expect(steps.length).toBe(314);
  });

  it("conserva 80 ejercicios de práctica", () => {
    const cppSets = allPracticeSets.filter(
      (s) => s.courseSlug === "cpp-desde-cero",
    );
    const total = cppSets.reduce((n, s) => n + s.exercises.length, 0);
    expect(total).toBe(80);
  });

  it("todo el contenido C++ usa el fence de C++", () => {
    expect(LANGUAGE_PROFILES[cpp.language].markdownFences).toContain("cpp");
  });
});
