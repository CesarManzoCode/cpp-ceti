import { describe, expect, it } from "vitest";

import { allCourses } from "../../prisma/content";
import { allPracticeSets } from "../../prisma/content/exercises";
import type { CodeExampleStep, StepDefinition } from "../../prisma/content/types";
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

describe("curriculum de C++: 2 secciones semestrales", () => {
  const cpp = courseBySlug.get("cpp-desde-cero")!;

  it("declara exactamente 2 sections", () => {
    expect(cpp.curriculum).toBeDefined();
    expect(cpp.curriculum).toHaveLength(2);
  });

  it("S1: semester 1, subjectName exacto, 6 units exactas", () => {
    const s1 = cpp.curriculum!.find((s) => s.key === "s1-fundamentos-desarrollo-software");
    expect(s1).toBeDefined();
    expect(s1!.semester).toBe(1);
    expect(s1!.order).toBe(1);
    expect(s1!.subjectName).toBe("Fundamentos de Desarrollo de Software");
    expect(s1!.unitSlugs).toEqual([
      "primer-programa",
      "variables-y-tipos",
      "leer-datos",
      "control-de-flujo",
      "loops",
      "printf-scanf",
    ]);
  });

  it("S2: semester 2, subjectName exacto, 4 units exactas", () => {
    const s2 = cpp.curriculum!.find((s) => s.key === "s2-programacion-estructurada");
    expect(s2).toBeDefined();
    expect(s2!.semester).toBe(2);
    expect(s2!.order).toBe(2);
    expect(s2!.subjectName).toBe("Programación Estructurada");
    expect(s2!.unitSlugs).toEqual(["funciones", "arreglos", "archivos", "matrices"]);
  });

  it("el orden GLOBAL aplanado (Unit.order) es exactamente el contrato", () => {
    expect(cpp.units.map((u) => u.slug)).toEqual([
      "primer-programa",
      "variables-y-tipos",
      "leer-datos",
      "control-de-flujo",
      "loops",
      "printf-scanf",
      "funciones",
      "arreglos",
      "archivos",
      "matrices",
    ]);
  });

  it("los totales del curso siguen intactos: 10 units, 67 lessons, 314 steps, 80 practices", () => {
    const lessons = cpp.units.flatMap((u) => u.lessons);
    const steps = lessons.flatMap((l) => l.steps);
    const cppSets = allPracticeSets.filter((s) => s.courseSlug === "cpp-desde-cero");
    const totalPractice = cppSets.reduce((n, s) => n + s.exercises.length, 0);

    expect(cpp.units.length).toBe(10);
    expect(lessons.length).toBe(67);
    expect(steps.length).toBe(314);
    expect(totalPractice).toBe(80);
  });

  it("S1 tiene 41 lessons y S2 tiene 26 lessons", () => {
    const unitBySlug = new Map(cpp.units.map((u) => [u.slug, u]));
    const s1 = cpp.curriculum!.find((s) => s.key === "s1-fundamentos-desarrollo-software")!;
    const s2 = cpp.curriculum!.find((s) => s.key === "s2-programacion-estructurada")!;

    const lessonsOf = (slugs: string[]) =>
      slugs.reduce((n, slug) => n + unitBySlug.get(slug)!.lessons.length, 0);

    expect(lessonsOf(s1.unitSlugs)).toBe(41);
    expect(lessonsOf(s2.unitSlugs)).toBe(26);
  });
});

describe("curriculum de C#: 2 secciones (S3 POO I + S4 POO II)", () => {
  const csharp = courseBySlug.get("csharp-poo-1")!;

  const unitBySlug = new Map(csharp.units.map((u) => [u.slug, u]));
  const lessonsOf = (slugs: string[]) =>
    slugs.reduce((n, slug) => n + unitBySlug.get(slug)!.lessons.length, 0);
  const stepsOf = (slugs: string[]) =>
    slugs.reduce(
      (n, slug) =>
        n + unitBySlug.get(slug)!.lessons.reduce((m, l) => m + l.steps.length, 0),
      0,
    );
  const practicesOf = (slugs: string[]) =>
    allPracticeSets
      .filter((s) => s.courseSlug === "csharp-poo-1" && slugs.includes(s.unitSlug))
      .reduce((n, s) => n + s.exercises.length, 0);

  it("declara exactamente 2 sections, en orden: S3 (semester 3) y S4 (semester 4)", () => {
    expect(csharp.curriculum).toBeDefined();
    expect(csharp.curriculum).toHaveLength(2);
    expect(csharp.curriculum!.map((s) => s.key)).toEqual([
      "s3-programacion-orientada-objetos-1",
      "s4-programacion-orientada-objetos-2",
    ]);
  });

  it("S3: semester 3, subjectName exacto, 8 unidades EXISTENTES, mismo orden, sin cambios académicos", () => {
    const s3 = csharp.curriculum!.find(
      (s) => s.key === "s3-programacion-orientada-objetos-1",
    )!;
    expect(s3.semester).toBe(3);
    expect(s3.order).toBe(1);
    expect(s3.subjectName).toBe("Programación Orientada a Objetos I");
    expect(s3.unitSlugs).toEqual([
      "csharp-poo-01-modelar",
      "csharp-poo-02-encapsular",
      "csharp-poo-03-uml",
      "csharp-poo-04-relaciones",
      "csharp-poo-05-herencia",
      "csharp-poo-06-diseno-robusto",
      "csharp-poo-07-gui",
      "csharp-poo-08-integrador",
    ]);
    expect(lessonsOf(s3.unitSlugs)).toBe(33);
    expect(stepsOf(s3.unitSlugs)).toBe(161);
    expect(practicesOf(s3.unitSlugs)).toBe(32);
    // GUI e integrador siguen despublicadas hasta la aceptación en Windows;
    // el resto de S3 sigue publicado, exactamente como antes de S4.
    expect(s3.unitSlugs.map((slug) => unitBySlug.get(slug)!.published)).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
    ]);
  });

  it("S4: semester 4, subjectName exacto, 8 unidades EXACTAS en el orden contractual, todas unpublished", () => {
    const s4 = csharp.curriculum!.find(
      (s) => s.key === "s4-programacion-orientada-objetos-2",
    )!;
    expect(s4.semester).toBe(4);
    expect(s4.order).toBe(2);
    expect(s4.subjectName).toBe("Programación Orientada a Objetos II");
    expect(s4.unitSlugs).toEqual([
      "csharp-poo2-01-colecciones",
      "csharp-poo2-02-diccionarios",
      "csharp-poo2-03-ordenamiento",
      "csharp-poo2-04-xml",
      "csharp-poo2-05-genericos",
      "csharp-poo2-06-concurrencia",
      "csharp-poo2-07-redes",
      "csharp-poo2-08-integrador",
    ]);
    expect(lessonsOf(s4.unitSlugs)).toBe(40);
    expect(practicesOf(s4.unitSlugs)).toBe(32);
    for (const slug of s4.unitSlugs) {
      expect(unitBySlug.get(slug)!.published, slug).toBe(false);
    }
  });

  it("el orden GLOBAL aplanado (Unit.order) pone S4 completo después de S3 completo", () => {
    expect(csharp.units.map((u) => u.slug)).toEqual([
      "csharp-poo-01-modelar",
      "csharp-poo-02-encapsular",
      "csharp-poo-03-uml",
      "csharp-poo-04-relaciones",
      "csharp-poo-05-herencia",
      "csharp-poo-06-diseno-robusto",
      "csharp-poo-07-gui",
      "csharp-poo-08-integrador",
      "csharp-poo2-01-colecciones",
      "csharp-poo2-02-diccionarios",
      "csharp-poo2-03-ordenamiento",
      "csharp-poo2-04-xml",
      "csharp-poo2-05-genericos",
      "csharp-poo2-06-concurrencia",
      "csharp-poo2-07-redes",
      "csharp-poo2-08-integrador",
    ]);
  });

  it("totales del curso: 16 units, 73 lessons, 321 steps, 64 practices", () => {
    const lessons = csharp.units.flatMap((u) => u.lessons);
    const steps = lessons.flatMap((l) => l.steps);
    const total = allPracticeSets
      .filter((s) => s.courseSlug === "csharp-poo-1")
      .reduce((n, s) => n + s.exercises.length, 0);

    expect(csharp.units.length).toBe(16);
    expect(lessons.length).toBe(73);
    expect(steps.length).toBe(321);
    expect(total).toBe(64);
  });

  it("la metadata general del Course cubre ambas asignaturas", () => {
    expect(csharp.title).toBe("Programación Orientada a Objetos con C#");
    expect(csharp.subjectName).toBe("Programación Orientada a Objetos");
    expect(csharp.slug).toBe("csharp-poo-1");
    expect(csharp.language).toBe("csharp");
    expect(csharp.executionProfile).toBe("csharp-mono-6.12");
  });
});

describe("política de ejecución de S4 (red, sockets, concurrencia no determinista)", () => {
  const csharp = courseBySlug.get("csharp-poo-1")!;
  const s4 = csharp.curriculum!.find(
    (s) => s.key === "s4-programacion-orientada-objetos-2",
  )!;
  const s4Units = csharp.units.filter((u) => s4.unitSlugs.includes(u.slug));

  function codeExampleSteps() {
    return s4Units.flatMap((u) =>
      u.lessons.flatMap((l) =>
        l.steps
          .filter((s): s is CodeExampleStep => s.type === "code_example")
          .map((step) => ({ where: `${u.slug}/${l.slug}`, step })),
      ),
    );
  }

  it("ningún ejemplo/reto ejecutable de la unidad de redes abre un socket real", () => {
    const SOCKET_MARKERS = /\b(TcpListener|TcpClient|UdpClient|Socket\s*\(|\.Accept\(|\.Connect\(|\.Receive\(|\.Send\()/;
    for (const { where, step } of codeExampleSteps()) {
      if (!where.startsWith("csharp-poo2-07-redes/")) continue;
      if (!SOCKET_MARKERS.test(step.code)) continue;
      expect(step.runnable === true, `${where}: abre socket real y es ejecutable`).toBe(
        false,
      );
      expect(step.localOnlyNote?.trim(), `${where}: falta localOnlyNote`).toBeTruthy();
    }
  });

  it("ninguna práctica de redes intenta abrir un socket real", () => {
    const redesSet = allPracticeSets.find(
      (s) => s.courseSlug === "csharp-poo-1" && s.unitSlug === "csharp-poo2-07-redes",
    )!;
    expect(redesSet).toBeDefined();
    const SOCKET_MARKERS = /\b(TcpListener|TcpClient|UdpClient|Socket\s*\()/;
    for (const ex of redesSet.exercises) {
      expect(
        SOCKET_MARKERS.test(ex.solutionCode),
        `${ex.slug}: la solución calificada abre un socket real`,
      ).toBe(false);
    }
  });

  it("la unidad de concurrencia no califica por stdout una demostración de race condition", () => {
    const concurrencia = s4Units.find((u) => u.slug === "csharp-poo2-06-concurrencia")!;
    for (const lesson of concurrencia.lessons) {
      for (const step of lesson.steps) {
        if (step.type !== "code_challenge") continue;
        // Un reto calificado de concurrencia debe sincronizar (Join/lock) para
        // ser determinista; no debe depender de una carrera sin protección.
        const usesThread = /\bThread\b/.test(step.exercise.solutionCode);
        if (!usesThread) continue;
        expect(
          /\bJoin\s*\(|\block\s*\(/.test(step.exercise.solutionCode),
          `${lesson.slug}: reto con Thread calificado por stdout sin Join/lock`,
        ).toBe(true);
      }
    }
  });

  it("todo code_example de S4 marcado no ejecutable trae localOnlyNote", () => {
    for (const { where, step } of codeExampleSteps()) {
      if (step.runnable === true) continue;
      expect(step.localOnlyNote?.trim(), `${where}: falta localOnlyNote`).toBeTruthy();
    }
  });

  it("las 8 unidades de S4 están unpublished (release gate pendiente)", () => {
    for (const unit of s4Units) {
      expect(unit.published, unit.slug).toBe(false);
    }
  });
});

describe("curso S5: Modelos y métodos de desarrollo de software", () => {
  it("el curso está registrado EXACTAMENTE una vez", () => {
    const matches = allCourses.filter(
      (c) => c.slug === "modelos-metodos-desarrollo-software",
    );
    expect(matches).toHaveLength(1);
  });

  const mm = courseBySlug.get("modelos-metodos-desarrollo-software")!;

  it("declara la metadata exacta del contrato", () => {
    expect(mm).toBeDefined();
    expect(mm.title).toBe("Modelos y métodos de desarrollo de software");
    expect(mm.description).toBe(
      "Convierte problemas en proyectos de software trazables: requisitos, diseño, control de versiones, pruebas, mantenimiento, SOLID y entregas incrementales.",
    );
    expect(mm.subjectName).toBe("Modelos y métodos de desarrollo de software");
    expect(mm.academicContext).toBe("CETI · Tecnólogo en Desarrollo de Software");
    expect(mm.language).toBe("csharp");
    expect(mm.executionProfile).toBe("csharp-mono-6.12");
  });

  it("declara EXACTAMENTE una CurriculumSection de semestre 5", () => {
    expect(mm.curriculum).toBeDefined();
    expect(mm.curriculum).toHaveLength(1);
    const s5 = mm.curriculum![0];
    expect(s5.key).toBe("s5-modelos-metodos-desarrollo-software-1");
    expect(s5.semester).toBe(5);
    expect(s5.order).toBe(1);
    expect(s5.subjectName).toBe("Modelos y Métodos de Desarrollo de Software I");
  });

  it("declara las 10 Units EXACTAS, en el orden contractual", () => {
    expect(mm.units.map((u) => u.slug)).toEqual([
      "mm-01-proyecto-cascada",
      "mm-02-requerimientos",
      "mm-03-uml-diseno",
      "mm-04-git-versiones",
      "mm-05-planificacion-implementacion",
      "mm-06-pruebas-calidad",
      "mm-07-mantenimiento",
      "mm-08-solid",
      "mm-09-incremental",
      "mm-10-integrador",
    ]);
    // La sección semestral referencia exactamente esas mismas 10 units, en
    // el mismo orden, y ese aplanado es el orden GLOBAL de navegación.
    expect(mm.curriculum![0].unitSlugs).toEqual(mm.units.map((u) => u.slug));
  });

  it("las 10 Units están published=true (sin release gate para S5)", () => {
    for (const unit of mm.units) {
      expect(unit.published, unit.slug).toBe(true);
    }
  });

  it("totales EXACTOS: 44 lessons, 176 steps, 32 practices", () => {
    const lessons = mm.units.flatMap((u) => u.lessons);
    const steps = lessons.flatMap((l) => l.steps);
    const totalPractice = allPracticeSets
      .filter((s) => s.courseSlug === "modelos-metodos-desarrollo-software")
      .reduce((n, s) => n + s.exercises.length, 0);

    expect(mm.units.length).toBe(10);
    expect(lessons.length).toBe(44);
    expect(steps.length).toBe(176);
    expect(totalPractice).toBe(32);
  });

  it("cada lección tiene EXACTAMENTE 4 steps", () => {
    for (const unit of mm.units) {
      for (const lesson of unit.lessons) {
        expect(lesson.steps.length, `${unit.slug}/${lesson.slug}`).toBe(4);
      }
    }
  });

  it("U1 (cascada) y U4 (Git) no fuerzan retos C# artificiales: sin práctica independiente", () => {
    const practiceUnitSlugs = new Set(
      allPracticeSets
        .filter((s) => s.courseSlug === "modelos-metodos-desarrollo-software")
        .map((s) => s.unitSlug),
    );
    expect(practiceUnitSlugs.has("mm-01-proyecto-cascada")).toBe(false);
    expect(practiceUnitSlugs.has("mm-04-git-versiones")).toBe(false);
  });

  it("las otras 8 unidades sí traen práctica independiente", () => {
    const practiceUnitSlugs = new Set(
      allPracticeSets
        .filter((s) => s.courseSlug === "modelos-metodos-desarrollo-software")
        .map((s) => s.unitSlug),
    );
    const expected = [
      "mm-02-requerimientos",
      "mm-03-uml-diseno",
      "mm-05-planificacion-implementacion",
      "mm-06-pruebas-calidad",
      "mm-07-mantenimiento",
      "mm-08-solid",
      "mm-09-incremental",
      "mm-10-integrador",
    ];
    for (const slug of expected) {
      expect(practiceUnitSlugs.has(slug), slug).toBe(true);
    }
  });

  it("el laboratorio local de Windows Forms del integrador no es ejecutable y no despublica la unidad", () => {
    const integrador = mm.units.find((u) => u.slug === "mm-10-integrador")!;
    expect(integrador.published).toBe(true);
    const nonRunnable = integrador.lessons
      .flatMap((l) => l.steps)
      .filter(
        (s): s is CodeExampleStep => s.type === "code_example" && s.runnable !== true,
      );
    expect(nonRunnable.length).toBeGreaterThan(0);
    for (const step of nonRunnable) {
      expect(step.localOnlyNote?.trim()).toBeTruthy();
    }
  });

  it("el curso C++ y el curso C# (S3+S4) siguen intactos tras agregar S5", () => {
    const cpp = courseBySlug.get("cpp-desde-cero")!;
    const csharp = courseBySlug.get("csharp-poo-1")!;

    expect(cpp.units.length).toBe(10);
    expect(cpp.units.flatMap((u) => u.lessons).length).toBe(67);

    expect(csharp.units.length).toBe(16);
    expect(csharp.units.flatMap((u) => u.lessons).length).toBe(73);
    expect(csharp.curriculum!.map((s) => s.key)).toEqual([
      "s3-programacion-orientada-objetos-1",
      "s4-programacion-orientada-objetos-2",
    ]);
  });
});
