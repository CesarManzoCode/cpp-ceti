import { describe, expect, it } from "vitest";

import {
  adaptLegacyUnits,
  buildContentRegistry,
  defineCourse,
  defineLesson,
  defineUnit,
} from "../../prisma/content/authoring";
import type {
  AuthoredUnitDefinition,
  CoursePackageDefinition,
} from "../../prisma/content/authoring";
import { ContentValidationError } from "../../prisma/content/validate";
import type {
  CourseDefinition,
  LessonDefinition,
} from "../../prisma/content/types";
import type { PracticeUnitSetDefinition } from "../../prisma/content/exercises/types";

import { allCourses, allPracticeSets } from "../../prisma/content/courses";

// ---------------------------------------------------------------------
// Reconstrucción INDEPENDIENTE de los dos cursos legacy (C++ y C#), tal
// como los ensamblaban `prisma/content/index.ts` y
// `prisma/content/exercises/index.ts` ANTES de este refactor — a partir
// de las mismas fuentes crudas (`unidad-*.ts`, `exercises/u*.ts`), SIN
// pasar por `authoring.ts`. Es el oráculo de la prueba de equivalencia:
// si el registry nuevo no coincide con esto, el refactor cambió
// contenido.
// ---------------------------------------------------------------------

import { unidad01 } from "../../prisma/content/unidad-01-primer-programa";
import { unidadCin } from "../../prisma/content/unidad-02-cin";
import { unidadVariables } from "../../prisma/content/unidad-03-variables";
import { unidad04 } from "../../prisma/content/unidad-04-control-flujo";
import { unidad05 } from "../../prisma/content/unidad-05-loops";
import { unidad06 } from "../../prisma/content/unidad-06-funciones";
import { unidad07 } from "../../prisma/content/unidad-07-printf-scanf";
import { unidad08 } from "../../prisma/content/unidad-08-arreglos";
import { unidad09 } from "../../prisma/content/unidad-09-archivos";
import { unidad10 } from "../../prisma/content/unidad-10-matrices";

import { u01PrimerProgramaExercises } from "../../prisma/content/exercises/u01-primer-programa";
import { u02CinExercises } from "../../prisma/content/exercises/u02-cin";
import { u03VariablesExercises } from "../../prisma/content/exercises/u03-variables";
import { u04ControlFlujoExercises } from "../../prisma/content/exercises/u04-control-flujo";
import { u05LoopsExercises } from "../../prisma/content/exercises/u05-loops";
import { u06FuncionesExercises } from "../../prisma/content/exercises/u06-funciones";
import { u07PrintfScanfExercises } from "../../prisma/content/exercises/u07-printf-scanf";
import { u08ArreglosExercises } from "../../prisma/content/exercises/u08-arreglos";
import { u09ArchivosExercises } from "../../prisma/content/exercises/u09-archivos";
import { u10MatricesExercises } from "../../prisma/content/exercises/u10-matrices";

import { cursoCsharpPoo1 } from "../../prisma/content/csharp";
import { csharpPracticeSets } from "../../prisma/content/exercises/csharp";

const legacyCursoCpp: CourseDefinition = {
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description:
    "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. " +
    "Cada concepto va seguido de práctica inmediata.",
  subjectName: "Programación en C++",
  academicContext: "Curso introductorio CETI",
  language: "cpp",
  executionProfile: "cpp17-wandbox",
  units: [
    unidad01,
    unidadVariables,
    unidadCin,
    unidad04,
    unidad05,
    unidad06,
    unidad07,
    unidad08,
    unidad09,
    unidad10,
  ],
};

const legacyCppPracticeSets: PracticeUnitSetDefinition[] = [
  u01PrimerProgramaExercises,
  u02CinExercises,
  u03VariablesExercises,
  u04ControlFlujoExercises,
  u05LoopsExercises,
  u06FuncionesExercises,
  u07PrintfScanfExercises,
  u08ArreglosExercises,
  u09ArchivosExercises,
  u10MatricesExercises,
];

const legacyCursoCsharp = cursoCsharpPoo1;
const legacyCsharpPracticeSets = csharpPracticeSets;

function byUnitSlug(sets: readonly PracticeUnitSetDefinition[]) {
  return new Map(sets.map((s) => [s.unitSlug, s] as const));
}

// =======================================================================
// defineLesson / defineUnit — identidad
// =======================================================================

describe("defineLesson / defineUnit", () => {
  it("defineLesson devuelve la misma lección sin modificarla", () => {
    const lesson: LessonDefinition = {
      slug: "l1",
      title: "Lección 1",
      description: "Una lección de prueba.",
      steps: [{ type: "theory", markdown: "# Hola" }],
    };
    const result = defineLesson(lesson);
    expect(result).toBe(lesson);
  });

  it("defineUnit devuelve la misma unidad sin modificarla, preservando practice", () => {
    const lesson = defineLesson({
      slug: "l1",
      title: "Lección 1",
      description: "Una lección de prueba.",
      steps: [{ type: "theory", markdown: "# Hola" }],
    });
    const unit: AuthoredUnitDefinition = {
      slug: "u1",
      title: "Unidad 1",
      description: "Una unidad de prueba.",
      icon: "🧪",
      lessons: [lesson],
      practice: [
        {
          slug: "ex1",
          title: "Ejercicio 1",
          description: "desc",
          prompt: "prompt",
          starterCode: "",
          solutionCode: "sol",
          difficulty: "easy",
          testCases: [{ expectedStdout: "ok" }],
        },
      ],
    };
    const result = defineUnit(unit);
    expect(result).toBe(unit);
    expect(result.lessons).toBe(unit.lessons);
    expect(result.practice).toBe(unit.practice);
  });
});

// =======================================================================
// defineCourse — deriva courseSlug/unitSlug/unitTitle/unitIcon y separa
// la práctica colocalizada en su propio PracticeUnitSetDefinition
// =======================================================================

describe("defineCourse", () => {
  function buildToyPackage(): CoursePackageDefinition {
    const unitA = defineUnit({
      slug: "unidad-a",
      title: "Unidad A",
      icon: "🅰️",
      description: "desc A",
      lessons: [
        defineLesson({
          slug: "leccion-a1",
          title: "Lección A1",
          description: "desc",
          steps: [
            { type: "theory", markdown: "teoría 1" },
            { type: "theory", markdown: "teoría 2" },
          ],
        }),
      ],
      practice: [
        {
          slug: "ex-a-1",
          title: "Ejercicio A1",
          description: "desc",
          prompt: "prompt",
          starterCode: "",
          solutionCode: "sol",
          difficulty: "easy",
          testCases: [
            { expectedStdout: "1" },
            { expectedStdout: "2" },
            { expectedStdout: "3" },
          ],
        },
        {
          slug: "ex-a-2",
          title: "Ejercicio A2",
          description: "desc",
          prompt: "prompt",
          starterCode: "",
          solutionCode: "sol",
          difficulty: "medium",
          testCases: [{ expectedStdout: "x" }],
        },
      ],
    });

    const unitB = defineUnit({
      slug: "unidad-b",
      title: "Unidad B",
      description: "desc B",
      lessons: [
        defineLesson({
          slug: "leccion-b1",
          title: "Lección B1",
          description: "desc",
          steps: [{ type: "theory", markdown: "teoría b" }],
        }),
      ],
      // sin practice
    });

    return defineCourse({
      slug: "curso-juguete",
      title: "Curso juguete",
      description: "desc curso",
      subjectName: "Materia",
      academicContext: "Contexto",
      language: "cpp",
      executionProfile: "cpp17-wandbox",
      units: [unitA, unitB],
    });
  }

  it("deriva courseSlug, unitSlug, unitTitle y unitIcon de la unidad", () => {
    const pkg = buildToyPackage();
    expect(pkg.practiceSets).toHaveLength(1);
    const [set] = pkg.practiceSets;
    expect(set.courseSlug).toBe("curso-juguete");
    expect(set.unitSlug).toBe("unidad-a");
    expect(set.unitTitle).toBe("Unidad A");
    expect(set.unitIcon).toBe("🅰️");
  });

  it("la práctica vive colocalizada en la unidad pero sale como PracticeUnitSetDefinition aparte", () => {
    const pkg = buildToyPackage();
    // El curso emitido NO trae `practice` colgando de la unidad.
    expect((pkg.course.units[0] as unknown as { practice?: unknown }).practice).toBeUndefined();
    expect(pkg.practiceSets[0].exercises).toHaveLength(2);
    expect(pkg.practiceSets[0].exercises[0].slug).toBe("ex-a-1");
  });

  it("preserva el orden de units, lessons, steps, practice exercises y test cases", () => {
    const pkg = buildToyPackage();
    expect(pkg.course.units.map((u) => u.slug)).toEqual(["unidad-a", "unidad-b"]);
    expect(pkg.course.units[0].lessons.map((l) => l.slug)).toEqual(["leccion-a1"]);
    expect(
      pkg.course.units[0].lessons[0].steps.map((s) =>
        s.type === "theory" ? s.markdown : "?",
      ),
    ).toEqual(["teoría 1", "teoría 2"]);
    expect(pkg.practiceSets[0].exercises.map((e) => e.slug)).toEqual([
      "ex-a-1",
      "ex-a-2",
    ]);
    expect(pkg.practiceSets[0].exercises[0].testCases.map((t) => t.expectedStdout)).toEqual([
      "1",
      "2",
      "3",
    ]);
  });

  it("una unidad sin practice no produce PracticeUnitSetDefinition", () => {
    const pkg = buildToyPackage();
    expect(pkg.practiceSets.find((s) => s.unitSlug === "unidad-b")).toBeUndefined();
  });
});

// =======================================================================
// buildContentRegistry — preserva orden de cursos, valida antes de
// aceptar, rechaza slugs de curso duplicados
// =======================================================================

describe("buildContentRegistry", () => {
  function minimalPackage(slug: string): CoursePackageDefinition {
    return defineCourse({
      slug,
      title: `Curso ${slug}`,
      description: "desc",
      subjectName: "Materia",
      academicContext: "Contexto",
      language: "cpp",
      executionProfile: "cpp17-wandbox",
      units: [
        defineUnit({
          slug: "u1",
          title: "Unidad 1",
          description: "desc",
          lessons: [
            defineLesson({
              slug: "l1",
              title: "Lección 1",
              description: "desc",
              steps: [{ type: "theory", markdown: "hola" }],
            }),
          ],
        }),
      ],
    });
  }

  it("preserva el orden del arreglo packages en allCourses", () => {
    const pkgB = minimalPackage("curso-b");
    const pkgA = minimalPackage("curso-a");
    const registry = buildContentRegistry([pkgB, pkgA]);
    expect(registry.allCourses.map((c) => c.slug)).toEqual(["curso-b", "curso-a"]);
  });

  it("rechaza course slugs duplicados", () => {
    const pkg1 = minimalPackage("curso-dup");
    const pkg2 = minimalPackage("curso-dup");
    expect(() => buildContentRegistry([pkg1, pkg2])).toThrow(ContentValidationError);
  });
});

// =======================================================================
// adaptLegacyUnits
// =======================================================================

describe("adaptLegacyUnits", () => {
  const baseCourse: CourseDefinition = {
    slug: "curso-legacy",
    title: "Curso legacy",
    description: "desc",
    subjectName: "Materia",
    academicContext: "Contexto",
    language: "cpp",
    executionProfile: "cpp17-wandbox",
    units: [
      {
        slug: "unidad-1",
        title: "Unidad Uno",
        icon: "1️⃣",
        description: "desc",
        lessons: [
          {
            slug: "l1",
            title: "Lección 1",
            description: "desc",
            steps: [{ type: "theory", markdown: "hola" }],
          },
        ],
      },
    ],
  };

  const validSet: PracticeUnitSetDefinition = {
    courseSlug: "curso-legacy",
    unitSlug: "unidad-1",
    unitTitle: "Un título legacy que ya NO coincide",
    unitIcon: "🐌",
    exercises: [
      {
        slug: "ex1",
        title: "Ejercicio 1",
        description: "desc",
        prompt: "prompt",
        starterCode: "",
        solutionCode: "sol",
        difficulty: "easy",
        testCases: [{ expectedStdout: "ok" }],
      },
    ],
  };

  it("preserva el orden de course.units", () => {
    const course: CourseDefinition = {
      ...baseCourse,
      units: [
        { ...baseCourse.units[0], slug: "u1" },
        { ...baseCourse.units[0], slug: "u2" },
        { ...baseCourse.units[0], slug: "u3" },
      ],
    };
    const authored = adaptLegacyUnits(course, []);
    expect(authored.map((u) => u.slug)).toEqual(["u1", "u2", "u3"]);
  });

  it("rechaza un courseSlug que no es el del curso", () => {
    const badSet: PracticeUnitSetDefinition = {
      ...validSet,
      courseSlug: "otro-curso",
    };
    expect(() => adaptLegacyUnits(baseCourse, [badSet])).toThrow();
  });

  it("rechaza un unitSlug inexistente", () => {
    const badSet: PracticeUnitSetDefinition = {
      ...validSet,
      unitSlug: "unidad-fantasma",
    };
    expect(() => adaptLegacyUnits(baseCourse, [badSet])).toThrow();
  });

  it("rechaza dos sets para la misma unidad", () => {
    expect(() =>
      adaptLegacyUnits(baseCourse, [validSet, { ...validSet }]),
    ).toThrow();
  });

  it("NO falla por unitTitle/unitIcon legacy distintos; el IR canónico usa unit.title/unit.icon", () => {
    const authored = adaptLegacyUnits(baseCourse, [validSet]);
    expect(authored).toHaveLength(1);
    expect(authored[0].practice).toBe(validSet.exercises);

    const pkg = defineCourse({ ...baseCourse, units: authored });
    expect(pkg.practiceSets[0].unitTitle).toBe("Unidad Uno");
    expect(pkg.practiceSets[0].unitIcon).toBe("1️⃣");
    // Explícitamente NO igual a la metadata legacy del set original.
    expect(pkg.practiceSets[0].unitTitle).not.toBe(validSet.unitTitle);
    expect(pkg.practiceSets[0].unitIcon).not.toBe(validSet.unitIcon);
  });

  it("permite unidades sin práctica", () => {
    const authored = adaptLegacyUnits(baseCourse, []);
    expect(authored).toHaveLength(1);
    expect(authored[0].practice).toBeUndefined();
  });
});

// =======================================================================
// Errores del validador incluyen un path preciso
// =======================================================================

describe("validate: paths precisos", () => {
  it("un curso sin unidades reporta un path courses[slug]", () => {
    const pkg = defineCourse({
      slug: "curso-vacio",
      title: "t",
      description: "d",
      subjectName: "s",
      academicContext: "a",
      language: "cpp",
      executionProfile: "cpp17-wandbox",
      units: [],
    });
    try {
      buildContentRegistry([pkg]);
      throw new Error("se esperaba que buildContentRegistry lanzara");
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const validationErr = err as ContentValidationError;
      expect(
        validationErr.issues.some(
          (i) => i.path === "courses[curso-vacio]" && /unidad/.test(i.message),
        ),
      ).toBe(true);
    }
  });

  it("un quiz con correctIndex fuera de rango reporta el path del step", () => {
    const pkg = defineCourse({
      slug: "curso-quiz",
      title: "t",
      description: "d",
      subjectName: "s",
      academicContext: "a",
      language: "cpp",
      executionProfile: "cpp17-wandbox",
      units: [
        defineUnit({
          slug: "u1",
          title: "U1",
          description: "d",
          lessons: [
            defineLesson({
              slug: "leccion-x",
              title: "L",
              description: "d",
              steps: [
                { type: "theory", markdown: "ok" },
                {
                  type: "quiz",
                  question: "?",
                  options: ["a", "b"],
                  correctIndex: 5,
                  explanation: "e",
                },
              ],
            }),
          ],
        }),
      ],
    });
    try {
      buildContentRegistry([pkg]);
      throw new Error("se esperaba que buildContentRegistry lanzara");
    } catch (err) {
      expect(err).toBeInstanceOf(ContentValidationError);
      const validationErr = err as ContentValidationError;
      expect(
        validationErr.issues.some(
          (i) =>
            i.path === "courses[curso-quiz].units[u1].lessons[leccion-x].steps[1]" &&
            /correctIndex/.test(i.message),
        ),
      ).toBe(true);
    }
  });
});

// =======================================================================
// C++ y C# actuales pasan por el registry nuevo
// =======================================================================

describe("los cursos actuales pasan por el registry nuevo", () => {
  it("cpp-desde-cero y csharp-poo-1 están en allCourses", () => {
    expect(allCourses.map((c) => c.slug).sort()).toEqual(
      ["cpp-desde-cero", "csharp-poo-1"].sort(),
    );
  });

  it("sus prácticas están en allPracticeSets", () => {
    const slugs = new Set(allPracticeSets.map((s) => s.courseSlug));
    expect(slugs.has("cpp-desde-cero")).toBe(true);
    expect(slugs.has("csharp-poo-1")).toBe(true);
  });
});

// =======================================================================
// PRUEBA DE EQUIVALENCIA LEGACY
//
// Compara el contenido que emite el registry nuevo (`prisma/content/courses`)
// contra una reconstrucción independiente hecha a mano desde las mismas
// fuentes crudas, SIN pasar por `authoring.ts`.
//
// La única normalización permitida: `unitTitle`/`unitIcon` de
// `PracticeUnitSetDefinition` se derivan de la `UnitDefinition` canónica
// en vez de copiarse del set legacy. Hoy, para C++ y C#, ambos valores YA
// coinciden -- así que esto no cambia ningún dato real, sólo su origen.
//
// El orden EN QUE APARECEN LOS GRUPOS de práctica top-level (qué unidad
// va primero en el arreglo) no es contenido: ninguna consulta de la app
// ni del seed lo usa como posición (`seed-practice.ts` numera `position`
// DENTRO de cada set; `practice/queries.ts` ordena por
// `{unitSlug: "asc"}`, no por índice de arreglo). Por eso
// `buildContentRegistry`, que aplana curso→unidad en el orden de
// `course.units` (arquitectura ya cerrada), agrupa el mismo contenido en
// un orden distinto al del arreglo legacy escrito a mano para C++ (que
// listaba `leer-datos` antes que `variables-y-tipos`, aunque el CURSO ya
// tenía a `variables-y-tipos` primero). Esta prueba compara los GRUPOS
// como conjunto (por unitSlug) y, dentro de cada grupo, el orden de
// ejercicios y de test cases ESTRICTAMENTE.
// =======================================================================

describe("equivalencia legacy: el refactor de authoring no cambia contenido", () => {
  it("C++: metadata de curso idéntica", () => {
    const cpp = allCourses.find((c) => c.slug === "cpp-desde-cero")!;
    expect(cpp.slug).toBe(legacyCursoCpp.slug);
    expect(cpp.title).toBe(legacyCursoCpp.title);
    expect(cpp.description).toBe(legacyCursoCpp.description);
    expect(cpp.subjectName).toBe(legacyCursoCpp.subjectName);
    expect(cpp.academicContext).toBe(legacyCursoCpp.academicContext);
    expect(cpp.language).toBe(legacyCursoCpp.language);
    expect(cpp.executionProfile).toBe(legacyCursoCpp.executionProfile);
  });

  it("C++: mismo orden de unidades", () => {
    const cpp = allCourses.find((c) => c.slug === "cpp-desde-cero")!;
    expect(cpp.units.map((u) => u.slug)).toEqual(
      legacyCursoCpp.units.map((u) => u.slug),
    );
  });

  it("C++: unidades, lecciones, orden de lecciones, steps y orden de steps idénticos", () => {
    const cpp = allCourses.find((c) => c.slug === "cpp-desde-cero")!;
    expect(cpp.units).toEqual(legacyCursoCpp.units);
  });

  it("C#: metadata de curso idéntica", () => {
    const csharp = allCourses.find((c) => c.slug === "csharp-poo-1")!;
    expect(csharp.slug).toBe(legacyCursoCsharp.slug);
    expect(csharp.title).toBe(legacyCursoCsharp.title);
    expect(csharp.description).toBe(legacyCursoCsharp.description);
    expect(csharp.subjectName).toBe(legacyCursoCsharp.subjectName);
    expect(csharp.academicContext).toBe(legacyCursoCsharp.academicContext);
    expect(csharp.language).toBe(legacyCursoCsharp.language);
    expect(csharp.executionProfile).toBe(legacyCursoCsharp.executionProfile);
  });

  it("C#: mismo orden de unidades, unidades, lecciones y steps idénticos", () => {
    const csharp = allCourses.find((c) => c.slug === "csharp-poo-1")!;
    expect(csharp.units.map((u) => u.slug)).toEqual(
      legacyCursoCsharp.units.map((u) => u.slug),
    );
    expect(csharp.units).toEqual(legacyCursoCsharp.units);
  });

  it("C++: mismos grupos de práctica (por unidad), exercises y test cases idénticos y en el mismo orden dentro de cada grupo", () => {
    const canonical = byUnitSlug(
      allPracticeSets.filter((s) => s.courseSlug === "cpp-desde-cero"),
    );
    const legacy = byUnitSlug(legacyCppPracticeSets);

    expect(new Set(canonical.keys())).toEqual(new Set(legacy.keys()));

    for (const [unitSlug, legacySet] of legacy) {
      const canonicalSet = canonical.get(unitSlug)!;
      expect(canonicalSet.courseSlug).toBe(legacySet.courseSlug);
      expect(canonicalSet.exercises).toEqual(legacySet.exercises);
      // Normalización permitida: título/ícono derivan de la unidad
      // canónica. Hoy coincide con el legacy, pero la fuente de verdad
      // cambió de "el set" a "la unidad".
      const cpp = allCourses.find((c) => c.slug === "cpp-desde-cero")!;
      const unit = cpp.units.find((u) => u.slug === unitSlug)!;
      expect(canonicalSet.unitTitle).toBe(unit.title);
      expect(canonicalSet.unitIcon).toBe(unit.icon);
    }
  });

  it("C#: mismos grupos de práctica (por unidad), exercises y test cases idénticos y en el mismo orden dentro de cada grupo", () => {
    const canonical = byUnitSlug(
      allPracticeSets.filter((s) => s.courseSlug === "csharp-poo-1"),
    );
    const legacy = byUnitSlug(legacyCsharpPracticeSets);

    expect(new Set(canonical.keys())).toEqual(new Set(legacy.keys()));
    // Para C# el orden del arreglo legacy YA coincide con el orden de
    // unidades del curso: lo comprobamos también posicionalmente.
    expect(
      allPracticeSets
        .filter((s) => s.courseSlug === "csharp-poo-1")
        .map((s) => s.unitSlug),
    ).toEqual(legacyCsharpPracticeSets.map((s) => s.unitSlug));

    for (const [unitSlug, legacySet] of legacy) {
      const canonicalSet = canonical.get(unitSlug)!;
      expect(canonicalSet.courseSlug).toBe(legacySet.courseSlug);
      expect(canonicalSet.exercises).toEqual(legacySet.exercises);
      const csharp = allCourses.find((c) => c.slug === "csharp-poo-1")!;
      const unit = csharp.units.find((u) => u.slug === unitSlug)!;
      expect(canonicalSet.unitTitle).toBe(unit.title);
      expect(canonicalSet.unitIcon).toBe(unit.icon);
    }
  });

  it("no hay ninguna otra diferencia: mismos published, xp, tiempos y runtime metadata", () => {
    const cpp = allCourses.find((c) => c.slug === "cpp-desde-cero")!;
    expect(cpp.language).toBe(legacyCursoCpp.language);
    expect(cpp.executionProfile).toBe(legacyCursoCpp.executionProfile);
    for (let i = 0; i < cpp.units.length; i++) {
      expect(cpp.units[i].published).toBe(legacyCursoCpp.units[i].published);
      for (let j = 0; j < cpp.units[i].lessons.length; j++) {
        expect(cpp.units[i].lessons[j].xpReward).toBe(
          legacyCursoCpp.units[i].lessons[j].xpReward,
        );
        expect(cpp.units[i].lessons[j].estimatedMinutes).toBe(
          legacyCursoCpp.units[i].lessons[j].estimatedMinutes,
        );
        expect(cpp.units[i].lessons[j].published).toBe(
          legacyCursoCpp.units[i].lessons[j].published,
        );
      }
    }

    const csharp = allCourses.find((c) => c.slug === "csharp-poo-1")!;
    for (let i = 0; i < csharp.units.length; i++) {
      expect(csharp.units[i].published).toBe(legacyCursoCsharp.units[i].published);
    }
  });
});
