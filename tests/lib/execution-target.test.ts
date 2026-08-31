import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FakeDb } from "../helpers/fake-prisma";

vi.mock("@/lib/db", async () => {
  const { createFakeDb } = await import("../helpers/fake-prisma");
  return { db: createFakeDb() };
});

import {
  ExecutionTargetError,
  resolveExecutionTarget,
} from "@/lib/execution-target";
import { db } from "@/lib/db";

const fake = db as unknown as FakeDb;

const CPP_COURSE = {
  id: "course_cpp",
  slug: "cpp-desde-cero",
  published: true,
  language: "cpp",
  executionProfile: "cpp17-wandbox",
};
const CS_COURSE = {
  id: "course_cs",
  slug: "csharp-poo-1",
  published: true,
  language: "csharp",
  executionProfile: "csharp-mono-6.12",
};

function lessonOf(course: typeof CPP_COURSE, published = true) {
  return {
    id: `lesson_${course.id}`,
    published,
    unit: { published: true, course },
  };
}

beforeEach(() => {
  fake.reset();

  // Dos cursos con recursos que se llaman igual: es el escenario que la
  // resolución por curso tiene que distinguir.
  fake.seed("practiceExercise", [
    {
      id: "pex_cpp",
      published: true,
      contentRevision: "rev_cpp",
      unit: { published: true },
      course: CPP_COURSE,
    },
    {
      id: "pex_cs",
      published: true,
      contentRevision: "rev_cs",
      unit: { published: true },
      course: CS_COURSE,
    },
    {
      id: "pex_unpublished",
      published: false,
      contentRevision: null,
      unit: { published: true },
      course: CPP_COURSE,
    },
    // Práctica publicada, pero colgada de una unidad que todavía no sale al
    // aire (ej. Windows Forms). La UI no la muestra; el servidor tampoco la
    // ejecuta.
    {
      id: "pex_unidad_oculta",
      published: true,
      contentRevision: "rev_oculta",
      unit: { published: false },
      course: CPP_COURSE,
    },
  ]);

  fake.seed("exercise", [
    {
      id: "ex_cpp",
      contentRevision: "rev_ex_cpp",
      step: { id: "step_cpp", lesson: lessonOf(CPP_COURSE) },
    },
    {
      id: "ex_cs",
      contentRevision: "rev_ex_cs",
      step: { id: "step_cs", lesson: lessonOf(CS_COURSE) },
    },
    {
      id: "ex_hidden",
      contentRevision: null,
      step: { id: "step_hidden", lesson: lessonOf(CPP_COURSE, false) },
    },
  ]);

  fake.seed("lessonStep", [
    {
      id: "step_runnable",
      type: "code_example",
      content: { code: "int main(){}", runnable: true },
      contentRevision: "rev_step",
      lesson: lessonOf(CPP_COURSE),
    },
    {
      id: "step_winforms",
      type: "code_example",
      content: { code: "public class Form1 : Form {}", runnable: false },
      contentRevision: "rev_winforms",
      lesson: lessonOf(CS_COURSE),
    },
    {
      id: "step_theory",
      type: "theory",
      content: { markdown: "texto" },
      contentRevision: "rev_theory",
      lesson: lessonOf(CPP_COURSE),
    },
  ]);
});

async function reason(input: Parameters<typeof resolveExecutionTarget>[0]) {
  try {
    await resolveExecutionTarget(input);
    return "resolved";
  } catch (err) {
    if (err instanceof ExecutionTargetError) return err.reason;
    throw err;
  }
}

describe("el perfil sale del curso del recurso", () => {
  it("una práctica de C++ resuelve a cpp17-wandbox", async () => {
    const target = await resolveExecutionTarget({
      practiceExerciseId: "pex_cpp",
    });
    expect(target.profileId).toBe("cpp17-wandbox");
    expect(target.language).toBe("cpp");
    expect(target.surface).toBe("practice");
    expect(target.contentRevision).toBe("rev_cpp");
  });

  it("una práctica de C# resuelve a csharp-mono-6.12", async () => {
    const target = await resolveExecutionTarget({
      practiceExerciseId: "pex_cs",
    });
    expect(target.profileId).toBe("csharp-mono-6.12");
    expect(target.language).toBe("csharp");
    expect(target.courseSlug).toBe("csharp-poo-1");
  });

  it("un reto de C# resuelve a C# aunque el envío parezca de C++", async () => {
    const target = await resolveExecutionTarget({ exerciseId: "ex_cs" });
    expect(target.profileId).toBe("csharp-mono-6.12");
    expect(target.lessonId).toBe("lesson_course_cs");
    expect(target.stepId).toBe("step_cs");
  });

  it("un ejemplo ejecutable resuelve por su paso", async () => {
    const target = await resolveExecutionTarget({ stepId: "step_runnable" });
    expect(target.profileId).toBe("cpp17-wandbox");
    expect(target.exerciseId).toBeNull();
    expect(target.stepId).toBe("step_runnable");
  });

  it("la corrida de un ejemplo es playground, no un intento de reto", async () => {
    // Clasificarla como "lesson" partiría en dos la serie histórica y
    // contaminaría el denominador de "compilar → calificar" de los retos.
    const target = await resolveExecutionTarget({ stepId: "step_runnable" });
    expect(target.surface).toBe("playground");
    expect(target.exerciseId).toBeNull();
    expect(target.lessonId).toBe("lesson_course_cpp");
  });

  it("un reto sí es superficie de lección", async () => {
    const target = await resolveExecutionTarget({ exerciseId: "ex_cpp" });
    expect(target.surface).toBe("lesson");
  });
});

describe("falla cerrado", () => {
  it("sin recurso", async () => {
    expect(await reason({})).toBe("ambiguous");
  });

  it("con dos recursos", async () => {
    expect(
      await reason({ exerciseId: "ex_cpp", practiceExerciseId: "pex_cpp" }),
    ).toBe("ambiguous");
  });

  it("recurso inexistente", async () => {
    expect(await reason({ practiceExerciseId: "no_existe" })).toBe("not_found");
    expect(await reason({ exerciseId: "no_existe" })).toBe("not_found");
    expect(await reason({ stepId: "no_existe" })).toBe("not_found");
  });

  it("recurso despublicado", async () => {
    expect(await reason({ practiceExerciseId: "pex_unpublished" })).toBe(
      "unavailable",
    );
    expect(await reason({ exerciseId: "ex_hidden" })).toBe("unavailable");
  });

  it("una práctica publicada bajo una unidad despublicada no se ejecuta", async () => {
    // Regresión: `resolvePractice` sólo miraba la práctica y el curso, así
    // que una unidad todavía no publicada (U7/U8 de Windows Forms, por
    // ejemplo) dejaba pasar sus prácticas a compilar.
    expect(await reason({ practiceExerciseId: "pex_unidad_oculta" })).toBe(
      "unavailable",
    );
  });

  it("lessonId que no corresponde al recurso", async () => {
    expect(
      await reason({ exerciseId: "ex_cpp", lessonId: "lesson_course_cs" }),
    ).toBe("mismatch");
    expect(
      await reason({ stepId: "step_runnable", lessonId: "otra" }),
    ).toBe("mismatch");
  });

  it("una práctica no pertenece a una lección", async () => {
    expect(
      await reason({ practiceExerciseId: "pex_cpp", lessonId: "lesson_x" }),
    ).toBe("mismatch");
  });

  it("un snippet de Windows Forms NO se ejecuta, ni con petición forjada", async () => {
    expect(await reason({ stepId: "step_winforms" })).toBe("not_runnable");
  });

  it("un paso de teoría tampoco se ejecuta", async () => {
    expect(await reason({ stepId: "step_theory" })).toBe("not_runnable");
  });

  it("un curso con perfil inválido no cae a C++", async () => {
    fake.seed("practiceExercise", [
      {
        id: "pex_roto",
        published: true,
        contentRevision: null,
        unit: { published: true },
        course: {
          id: "course_roto",
          slug: "curso-roto",
          published: true,
          language: "csharp",
          // Perfil de OTRO lenguaje: configuración inválida.
          executionProfile: "cpp17-wandbox",
        },
      },
    ]);
    expect(await reason({ practiceExerciseId: "pex_roto" })).toBe(
      "invalid_profile",
    );
  });

  it("un lenguaje desconocido en la base es error, no default", async () => {
    fake.seed("practiceExercise", [
      {
        id: "pex_futuro",
        published: true,
        contentRevision: null,
        unit: { published: true },
        course: {
          id: "course_futuro",
          slug: "curso-futuro",
          published: true,
          language: "rust",
          executionProfile: "rust-1.80",
        },
      },
    ]);
    expect(await reason({ practiceExerciseId: "pex_futuro" })).toBe(
      "invalid_profile",
    );
  });
});
