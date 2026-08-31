import { describe, expect, it } from "vitest";

import { cursoCsharpPoo1 } from "../../prisma/content/csharp";
import { csharpPracticeSets } from "../../prisma/content/exercises/csharp";
import type { CodeExampleStep, StepDefinition } from "../../prisma/content/types";

/**
 * Contrato de modalidad de Windows Forms.
 *
 * WinForms es un resultado real de POO I y NO se puede ejecutar honestamente
 * en un juez de Linux dentro del navegador. La respuesta del producto no es
 * simularlo: es tratarlo como laboratorio local, con la etiqueta a la vista
 * y sin control de ejecución. Estos tests fijan esa promesa por escrito.
 *
 * El rechazo del lado del servidor de un paso no ejecutable (aunque llegue
 * una petición forjada) vive en `tests/lib/execution-target.test.ts`.
 */

const units = cursoCsharpPoo1.units;
const gui = units.find((u) => u.slug === "csharp-poo-07-gui")!;

function steps(): { where: string; step: StepDefinition }[] {
  return units.flatMap((u) =>
    u.lessons.flatMap((l) =>
      l.steps.map((step, i) => ({ where: `${u.slug}/${l.slug}#${i + 1}`, step })),
    ),
  );
}

/** Señales inequívocas de un fragmento de Windows Forms. */
const WINFORMS_MARKERS =
  /\b(EventArgs|Form1|txt[A-Z]\w*|lbl[A-Z]\w*|btn[A-Z]\w*|\.Text\b|MessageBox)/;

describe("la unidad de Windows Forms existe y es local", () => {
  it("está publicada y tiene sus 4 lecciones", () => {
    expect(gui).toBeDefined();
    expect(gui.published).not.toBe(false);
    expect(gui.lessons).toHaveLength(4);
  });

  it("NINGÚN fragmento de WinForms es ejecutable", () => {
    for (const { where, step } of steps()) {
      if (step.type !== "code_example") continue;
      if (!WINFORMS_MARKERS.test(step.code)) continue;
      expect(
        step.runnable === true,
        `${where}: un fragmento de Windows Forms no puede ser ejecutable`,
      ).toBe(false);
    }
  });

  it("todo ejemplo no ejecutable dice dónde SÍ se ejecuta", () => {
    const nonRunnable = steps().filter(
      (s): s is { where: string; step: CodeExampleStep } =>
        s.step.type === "code_example" && s.step.runnable !== true,
    );
    expect(nonRunnable.length).toBeGreaterThan(0);
    for (const { where, step } of nonRunnable) {
      expect(step.localOnlyNote?.trim(), `${where}: falta localOnlyNote`).toBeTruthy();
    }
  });

  it("los fragmentos de WinForms nombran Visual Studio en su nota", () => {
    for (const { where, step } of steps()) {
      if (step.type !== "code_example") continue;
      if (!WINFORMS_MARKERS.test(step.code)) continue;
      expect(step.localOnlyNote ?? "", where).toMatch(/Visual Studio/i);
    }
  });

  it("ningún reto calificable de la unidad de GUI pide código de formulario", () => {
    // El navegador califica lógica de dominio, nunca una ventana.
    for (const lesson of gui.lessons) {
      for (const step of lesson.steps) {
        if (step.type !== "code_challenge") continue;
        expect(
          WINFORMS_MARKERS.test(step.exercise.solutionCode),
          `${lesson.slug}: la solución calificada contiene código de formulario`,
        ).toBe(false);
        expect(step.exercise.solutionCode).toContain("static void Main");
      }
    }
  });

  it("cada lección de GUI describe su laboratorio local con evidencia", () => {
    for (const lesson of gui.lessons) {
      const theory = lesson.steps
        .filter((s) => s.type === "theory")
        .map((s) => (s as { markdown: string }).markdown)
        .join("\n");
      expect(theory, `${lesson.slug}: sin laboratorio local`).toMatch(
        /Laboratorio local/i,
      );
      expect(theory, `${lesson.slug}: sin evidencia observable`).toMatch(
        /Evidencia observable/i,
      );
      // Un laboratorio sin artefactos concretos no es reproducible ni
      // revisable: "pon un botón" no se puede comprobar; `btnCalcular`,
      // `TableLayoutPanel` o `dotnet publish -c Release` sí. Se exige que
      // el laboratorio nombre al menos dos.
      const lab = theory.slice(theory.search(/Laboratorio local/i));
      const named = [...lab.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
      expect(
        named.length,
        `${lesson.slug}: el laboratorio no nombra artefactos concretos`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("la unidad nombra la plantilla de proyecto y el framework destino", () => {
    // Se declara UNA vez, donde se crea el proyecto; las demás lecciones
    // trabajan sobre ese mismo proyecto.
    const all = gui.lessons
      .flatMap((l) => l.steps)
      .filter((s) => s.type === "theory")
      .map((s) => (s as { markdown: string }).markdown)
      .join("\n");
    expect(all).toMatch(/Windows Forms App/i);
    expect(all).toMatch(/\.NET (10|8)/);
  });
});

describe("las prácticas de la unidad de GUI se califican como consola", () => {
  const guiSets = csharpPracticeSets.filter(
    (s) => s.unitSlug === "csharp-poo-07-gui",
  );

  it("existen y son ejercicios de consola", () => {
    expect(guiSets).toHaveLength(1);
    expect(guiSets[0].exercises.length).toBeGreaterThan(0);
    for (const ex of guiSets[0].exercises) {
      // Las prácticas de esta unidad ejercitan el DOMINIO que el formulario
      // consumirá. Si tocaran controles no se podrían calificar, y el
      // producto estaría fingiendo que evalúa una ventana.
      expect(
        WINFORMS_MARKERS.test(ex.solutionCode),
        `${ex.slug}: la solución calificada usa controles de formulario`,
      ).toBe(false);
      expect(ex.solutionCode, ex.slug).toContain("static void Main");
    }
  });
});
