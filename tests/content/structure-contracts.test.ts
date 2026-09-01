import { describe, expect, it } from "vitest";

import { allCourses } from "../../prisma/content";
import { allPracticeSets } from "../../prisma/content/exercises";
import type { StructureContract } from "../../prisma/content/types";
import { checkStructure } from "@/lib/structure";
import { structureContractSchema } from "@/lib/structure/contract";
import type { LanguageId } from "@/lib/code-languages";

/**
 * LEARN-01: los contratos estructurales publicados tienen que ser
 * verdaderos. Si una solución de referencia no satisface su propio
 * contrato, el reto sería imposible; si un contrato es inválido, dejaría
 * de calificar en silencio.
 */

interface PublishedChallenge {
  id: string;
  language: LanguageId;
  solutionCode: string;
  structure?: StructureContract;
}

function publishedChallenges(): PublishedChallenge[] {
  const out: PublishedChallenge[] = [];

  for (const course of allCourses) {
    for (const unit of course.units) {
      if (unit.published === false) continue;
      for (const lesson of unit.lessons) {
        if (lesson.published === false) continue;
        for (const step of lesson.steps) {
          if (step.type !== "code_challenge") continue;
          out.push({
            id: `${course.slug}/${unit.slug}/${lesson.slug}`,
            language: course.language,
            solutionCode: step.exercise.solutionCode,
            structure: step.exercise.structure,
          });
        }
      }
    }
  }

  const publishedUnit = new Map(
    allCourses.flatMap((c) =>
      c.units.map((u) => [`${c.slug}/${u.slug}`, u.published !== false] as const),
    ),
  );
  const languageOf = new Map(allCourses.map((c) => [c.slug, c.language]));

  for (const set of allPracticeSets) {
    if (!publishedUnit.get(`${set.courseSlug}/${set.unitSlug}`)) continue;
    for (const exercise of set.exercises) {
      out.push({
        id: `${set.courseSlug}/${set.unitSlug}/${exercise.slug}`,
        language: languageOf.get(set.courseSlug)!,
        solutionCode: exercise.solutionCode,
        structure: exercise.structure,
      });
    }
  }

  return out;
}

const challenges = publishedChallenges();
const withContract = challenges.filter((c) => c.structure !== undefined);

describe("contratos estructurales publicados", () => {
  it("hay contratos declarados", () => {
    expect(withContract.length).toBeGreaterThan(0);
  });

  it.each(withContract.map((c) => [c.id, c] as const))(
    "%s: el contrato es válido y la solución de referencia lo satisface",
    (_id, challenge) => {
      expect(
        structureContractSchema.safeParse(challenge.structure).success,
      ).toBe(true);

      const result = checkStructure(
        challenge.structure,
        challenge.solutionCode,
        challenge.language,
      );
      expect(result.failures).toEqual([]);
    },
  );

  it("ningún reto de C++ declara contrato estructural", () => {
    const cpp = withContract.filter((c) => c.language === "cpp");
    expect(cpp).toEqual([]);
  });

  it("todo reto de lección de C# publicado declara su objetivo", () => {
    // "Declara su objetivo" = o tiene contrato (comportamiento + estructura)
    // o está en la lista de los que sólo evalúan comportamiento.
    const soloComportamiento = new Set<string>([
      // La clase ya viene completa y sin cambios: el reto evalúa que el
      // alumno EXTRAIGA el diagrama UML correcto como texto, no la
      // estructura de clases (que no escribe).
      "csharp-poo-1/csharp-poo-03-uml/csharp-poo-codigo-a-uml-pelicula",
    ]);
    const sinContrato = challenges
      .filter((c) => c.language === "csharp" && c.structure === undefined)
      .map((c) => c.id)
      .filter((id) => !soloComportamiento.has(id));
    expect(sinContrato).toEqual([]);
  });
});
