import { beforeEach, describe, expect, it } from "vitest";

import { resolveFeedbackContext, sanitizePath } from "@/features/feedback/context";
import { createFakeDb, type FakeDb } from "../../helpers/fake-prisma";

const db = createFakeDb();
const asPrisma = db as unknown as Parameters<typeof resolveFeedbackContext>[0];

beforeEach(() => {
  (db as FakeDb).reset();
  (db as FakeDb).seed("lesson", [
    { id: "lesson_1", slug: "primer-programa", unit: { slug: "u01" } },
  ]);
  (db as FakeDb).seed("practiceExercise", [
    { id: "p_1", slug: "u01-firma" },
  ]);
});

describe("sanitizePath", () => {
  it("conserva sólo el pathname", () => {
    expect(sanitizePath("/app/u/u01/leccion?p=3#hash")).toBe("/app/u/u01/leccion");
  });

  it("rechaza URLs absolutas y rutas raras", () => {
    expect(sanitizePath("https://otro.com/app")).toBeNull();
    expect(sanitizePath("/app/<script>")).toBeNull();
    expect(sanitizePath(undefined)).toBeNull();
  });

  it("acota la longitud", () => {
    expect(sanitizePath(`/app/${"a".repeat(500)}`)?.length).toBe(200);
  });
});

describe("resolveFeedbackContext", () => {
  it("deriva la lección desde la ruta, sin creerle ids al cliente", async () => {
    const context = await resolveFeedbackContext(
      asPrisma,
      "/app/u/u01/primer-programa?p=2",
    );
    expect(context).toEqual({
      path: "/app/u/u01/primer-programa",
      surface: "lesson",
      lessonId: "lesson_1",
      practiceExerciseId: null,
    });
  });

  it("deriva el ejercicio de práctica", async () => {
    const context = await resolveFeedbackContext(
      asPrisma,
      "/app/ejercicios/u01-firma",
    );
    expect(context.surface).toBe("practice");
    expect(context.practiceExerciseId).toBe("p_1");
  });

  it("una ruta cualquiera de la app queda como superficie app", async () => {
    const context = await resolveFeedbackContext(asPrisma, "/app/logros");
    expect(context.surface).toBe("app");
    expect(context.lessonId).toBeNull();
  });

  it("una ruta desconocida no inventa contexto", async () => {
    const context = await resolveFeedbackContext(
      asPrisma,
      "/app/u/u01/no-existe",
    );
    expect(context.surface).toBe("lesson");
    expect(context.lessonId).toBeNull();
  });

  it("sin ruta no hay contexto", async () => {
    expect(await resolveFeedbackContext(asPrisma, undefined)).toEqual({
      path: null,
      surface: null,
      lessonId: null,
      practiceExerciseId: null,
    });
  });
});
