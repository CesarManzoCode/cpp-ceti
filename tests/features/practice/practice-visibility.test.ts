import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FakeDb } from "../../helpers/fake-prisma";

vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("../../helpers/fake-prisma");
  return { db: createFakeDb() };
});

import { getPracticeBySlug, getPracticeGroups } from "@/features/practice/queries";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;
const COURSE = "course_csharp";

/**
 * UX-02: la publicación es jerárquica. Una práctica publicada bajo una
 * unidad "Próximamente" no se lista ni se abre por URL directa.
 */
describe("visibilidad de práctica bajo unidad no publicada", () => {
  beforeEach(() => {
    fake.reset();
    fake.seed("unit", [
      {
        id: "u1",
        courseId: COURSE,
        slug: "objetos",
        title: "De problemas a objetos",
        icon: null,
        order: 1,
        published: true,
      },
      {
        id: "u7",
        courseId: COURSE,
        slug: "windows-forms",
        title: "Aplicaciones de escritorio con Windows Forms",
        icon: null,
        order: 7,
        published: false,
      },
    ]);
    fake.seed("practiceExercise", [
      {
        id: "pex_u1",
        courseId: COURSE,
        slug: "u1-mascota",
        unitSlug: "objetos",
        title: "Mascota",
        description: "d",
        prompt: "p",
        starterCode: "",
        hints: [],
        difficulty: "easy",
        xpReward: 10,
        position: 1,
        published: true,
        contentRevision: "r1",
        testCases: [],
      },
      {
        id: "pex_u7",
        courseId: COURSE,
        slug: "u7-boton",
        unitSlug: "windows-forms",
        title: "Botón",
        description: "d",
        prompt: "prompt secreto",
        starterCode: "",
        hints: ["pista"],
        difficulty: "hard",
        xpReward: 30,
        position: 1,
        published: true,
        contentRevision: "r1",
        testCases: [],
      },
    ]);
  });

  it("la lista sólo agrupa unidades publicadas", async () => {
    const groups = await getPracticeGroups(COURSE, "user_1");
    expect(groups.map((g) => g.unitSlug)).toEqual(["objetos"]);
  });

  it("la unidad publicada conserva sus ejercicios y su orden", async () => {
    const groups = await getPracticeGroups(COURSE, "user_1");
    expect(groups[0].exercises.map((e) => e.slug)).toEqual(["u1-mascota"]);
    expect(groups[0].unitTitle).toBe("De problemas a objetos");
  });

  it("la URL directa a una práctica bloqueada no revela nada", async () => {
    const detail = await getPracticeBySlug(COURSE, "u7-boton", "user_1");
    expect(detail).toBeNull();
  });

  it("la práctica de una unidad publicada sí se abre", async () => {
    const detail = await getPracticeBySlug(COURSE, "u1-mascota", "user_1");
    expect(detail?.slug).toBe("u1-mascota");
  });

  it("publicar la unidad abre sus prácticas sin tocar el ejercicio", async () => {
    const unit = fake.table("unit").find((u) => u.slug === "windows-forms")!;
    unit.published = true;

    const groups = await getPracticeGroups(COURSE, "user_1");
    expect(groups.map((g) => g.unitSlug)).toEqual(["objetos", "windows-forms"]);
    expect(await getPracticeBySlug(COURSE, "u7-boton", "user_1")).not.toBeNull();
  });
});
