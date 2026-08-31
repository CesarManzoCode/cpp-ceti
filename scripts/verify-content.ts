/**
 * Verificador de contenido ejecutable.
 *
 * Compila y CORRE, con un toolchain local, cada pieza de código que la
 * plataforma promete que se ejecuta:
 *   · ejemplos marcados `runnable: true`  → se compara con `expectedOutput`
 *   · retos dentro de lecciones           → se corren TODOS sus test cases
 *   · ejercicios de práctica              → se corren TODOS sus test cases
 *
 * Los snippets marcados `runnable: false` (Windows Forms) se saltan a
 * propósito: no son programas de consola y no deben compilarse aquí.
 *
 * Por qué existe: transcribir 30 lecciones y 32 prácticas y "asumir que
 * funcionan" garantiza que algún `expectedOutput` esté mal. Un enunciado
 * puede discutirse; una salida que no coincide es un hecho.
 *
 * Toolchains (locales, NO el proveedor de producción):
 *   cpp    → g++ -std=c++17 -O0 -Wall
 *   csharp → mcs + mono   (mismo compilador que el perfil csharp-mono-6.12)
 *
 * Uso:
 *   npx tsx scripts/verify-content.ts             # todos los cursos
 *   npx tsx scripts/verify-content.ts csharp-poo-1
 */
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import { allCourses } from "../prisma/content";
import { allPracticeSets } from "../prisma/content/exercises";
import type { LanguageId } from "../src/lib/code-languages";
import { normalizeOutput } from "../src/lib/executor/normalize";

const run = promisify(execFile);

const RUN_TIMEOUT_MS = 15_000;

/**
 * Desviaciones CONOCIDAS del contenido, toleradas a propósito.
 *
 * Hoy está vacío: todo lo ejecutable compila y da la salida que promete.
 * La lista existe para que una desviación aceptada quede a la vista en el
 * código en vez de desaparecer detrás de un verificador verde — no para
 * silenciar fallos nuevos.
 *
 * La única entrada que tuvo (`archivos/validar-archivo`, reto 1) ya está
 * corregida: la solución de referencia terminaba con `return 1`, y los
 * tres adapters (Wandbox, Piston, Judge0) traducen un exit distinto de
 * cero a `runtime_error`, así que el reto no se podía aprobar ni con su
 * propia solución. Ahora reporta la falla y sale con `return 0`; el
 * enunciado explica por qué.
 */
const KNOWN_DEVIATIONS = new Set<string>();

interface Case {
  stdin: string;
  expectedStdout: string;
  visible: boolean;
  description?: string | null;
  /**
   * `false` cuando el contenido no declara una salida verificable: un
   * ejemplo sin `expectedOutput`, o uno INTERACTIVO cuyo `expectedOutput`
   * sólo muestra la pregunta que aparece antes de leer. Comparar esos
   * casos contra una corrida sin entrada reprobaría al ejemplo por hacer
   * justo lo que enseña.
   */
  compareOutput: boolean;
  /**
   * `true` sólo para ejemplos: algunos enseñan códigos de salida
   * (`return 1`). En un caso CALIFICADO un exit distinto de cero es un
   * fallo, igual que en producción: el ejecutor lo reporta como
   * runtime_error y el alumno no aprueba.
   */
  allowNonZeroExit: boolean;
}

interface Unit {
  id: string;
  language: LanguageId;
  code: string;
  cases: Case[];
}

interface Failure {
  id: string;
  kind: "compile" | "output" | "runtime";
  detail: string;
}

async function compileAndRun(unit: Unit, dir: string): Promise<Failure[]> {
  const failures: Failure[] = [];

  if (unit.language === "cpp") {
    const src = join(dir, "main.cpp");
    const bin = join(dir, "program");
    await writeFile(src, unit.code, "utf8");
    try {
      await run("g++", ["-std=c++17", "-O0", "-Wall", "-o", bin, src], {
        timeout: 60_000,
      });
    } catch (err) {
      return [{ id: unit.id, kind: "compile", detail: stderrOf(err) }];
    }
    for (const testCase of unit.cases) {
      failures.push(...(await runCase(unit, bin, [], testCase, dir)));
    }
    return failures;
  }

  const src = join(dir, "Program.cs");
  const exe = join(dir, "Program.exe");
  await writeFile(src, unit.code, "utf8");
  try {
    await run("mcs", ["-out:" + exe, src], { timeout: 60_000 });
  } catch (err) {
    return [{ id: unit.id, kind: "compile", detail: stderrOf(err) }];
  }
  for (const testCase of unit.cases) {
    failures.push(...(await runCase(unit, "mono", [exe], testCase, dir)));
  }
  return failures;
}

/**
 * ¿El programa lee de la entrada estándar? Un ejemplo interactivo no se
 * puede verificar por salida sin darle una entrada que el contenido no
 * declara.
 */
function readsStdin(code: string, language: LanguageId): boolean {
  return language === "cpp"
    ? /\bcin\s*>>|\bscanf\s*\(|\bgetline\s*\(|\bfgets\s*\(/.test(code)
    : /\bConsole\s*\.\s*Read(Line|Key)?\s*\(/.test(code);
}

async function runCase(
  unit: Unit,
  command: string,
  args: string[],
  testCase: Case,
  cwd: string,
): Promise<Failure[]> {
  const label = testCase.description
    ? `${unit.id} [${testCase.description}]`
    : `${unit.id} [stdin=${JSON.stringify(testCase.stdin)}]`;
  try {
    const child = run(command, args, { timeout: RUN_TIMEOUT_MS, cwd });
    // Un programa que no lee la entrada cierra el pipe antes de que
    // terminemos de escribir: EPIPE es normal aquí, no un fallo del
    // ejercicio.
    child.child.stdin?.on("error", () => {});
    child.child.stdin?.end(testCase.stdin);
    const { stdout } = await child;
    if (!testCase.compareOutput) return [];
    const actual = normalizeOutput(stdout);
    const expected = normalizeOutput(testCase.expectedStdout);
    if (actual !== expected) {
      return [
        {
          id: label,
          kind: "output",
          detail: `esperado:\n${expected}\nobtenido:\n${actual}`,
        },
      ];
    }
    return [];
  } catch (err) {
    // Un ejemplo puede terminar con `return 1` a propósito (enseñar códigos
    // de salida). Ahí lo que importa es lo que imprimió, no el código de
    // salida — que sí importa, y mucho, en un caso calificado: el ejecutor
    // lo reporta como runtime_error y el alumno no aprueba.
    const failed = err as { code?: unknown; stdout?: string };
    if (testCase.allowNonZeroExit && typeof failed.code === "number") {
      if (!testCase.compareOutput) return [];
      const actual = normalizeOutput(failed.stdout ?? "");
      const expected = normalizeOutput(testCase.expectedStdout);
      if (actual === expected) return [];
      return [
        {
          id: label,
          kind: "output",
          detail: `esperado:\n${expected}\nobtenido:\n${actual}`,
        },
      ];
    }
    return [{ id: label, kind: "runtime", detail: stderrOf(err) }];
  }
}

function stderrOf(err: unknown): string {
  const e = err as { stderr?: string; message?: string };
  return (e.stderr || e.message || String(err)).trim().slice(0, 1200);
}

function collect(courseFilter: string | undefined): Unit[] {
  const units: Unit[] = [];

  for (const course of allCourses) {
    if (courseFilter && course.slug !== courseFilter) continue;
    const language = course.language;

    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        for (const [index, step] of lesson.steps.entries()) {
          const where = `${course.slug}/${unit.slug}/${lesson.slug}#${index + 1}`;

          if (step.type === "code_example" && step.runnable) {
            const interactive = readsStdin(step.code, language);
            const declaresOutput = Boolean(step.expectedOutput?.trim());
            const compareOutput = declaresOutput && !interactive;
            units.push({
              id: `ejemplo ${where}`,
              language,
              code: step.code,
              cases: [
                {
                  stdin: "",
                  expectedStdout: step.expectedOutput ?? "",
                  visible: true,
                  description: compareOutput
                    ? "salida mostrada al alumno"
                    : interactive
                      ? "interactivo: sólo compila y corre"
                      : "sólo compila y corre",
                  compareOutput,
                  allowNonZeroExit: true,
                },
              ],
            });
          }

          if (step.type === "code_challenge") {
            units.push({
              id: `reto ${where}`,
              language,
              code: step.exercise.solutionCode,
              cases: step.exercise.testCases.map((tc) => ({
                stdin: tc.stdin ?? "",
                expectedStdout: tc.expectedStdout,
                visible: tc.visible ?? true,
                description: tc.description ?? null,
                compareOutput: true,
                allowNonZeroExit: false,
              })),
            });
          }
        }
      }
    }
  }

  for (const set of allPracticeSets) {
    if (courseFilter && set.courseSlug !== courseFilter) continue;
    const course = allCourses.find((c) => c.slug === set.courseSlug);
    if (!course) {
      throw new Error(`Práctica ${set.unitSlug}: curso ${set.courseSlug} no existe`);
    }
    for (const exercise of set.exercises) {
      units.push({
        id: `práctica ${set.courseSlug}/${exercise.slug}`,
        language: course.language,
        code: exercise.solutionCode,
        cases: exercise.testCases.map((tc) => ({
          stdin: tc.stdin ?? "",
          expectedStdout: tc.expectedStdout,
          visible: tc.visible ?? true,
          description: tc.description ?? null,
          compareOutput: true,
          allowNonZeroExit: false,
        })),
      });
    }
  }

  return units;
}

async function main() {
  const courseFilter = process.argv[2];
  const units = collect(courseFilter);
  const cases = units.reduce((n, u) => n + u.cases.length, 0);
  console.log(
    `🔧 Verificando ${units.length} piezas de código (${cases} casos)` +
      (courseFilter ? ` del curso ${courseFilter}` : "") +
      "…",
  );

  const failures: Failure[] = [];
  let done = 0;

  // Concurrencia moderada: compilar es lo caro y la máquina de CI no es
  // infinita.
  const CONCURRENCY = 8;
  const queue = [...units];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (;;) {
        const unit = queue.shift();
        if (!unit) return;
        const dir = await mkdtemp(join(tmpdir(), "ceti-verify-"));
        try {
          failures.push(...(await compileAndRun(unit, dir)));
        } finally {
          await rm(dir, { recursive: true, force: true });
        }
        done++;
        if (done % 25 === 0) console.log(`   … ${done}/${units.length}`);
      }
    }),
  );

  const known = failures.filter((f) => KNOWN_DEVIATIONS.has(f.id));
  const real = failures.filter((f) => !KNOWN_DEVIATIONS.has(f.id));

  if (known.length > 0) {
    console.warn(
      `\n⚠️  ${known.length} desviación(es) conocida(s) y preexistente(s) ` +
        `del contenido de C++ (ver KNOWN_DEVIATIONS):`,
    );
    for (const f of known) console.warn(`   — ${f.id}`);
  }

  if (real.length === 0) {
    console.log(
      `\n✅ ${units.length} piezas compilan y producen la salida esperada.`,
    );
    return;
  }

  console.error(`\n❌ ${real.length} fallo(s):\n`);
  for (const f of real) {
    console.error(`— [${f.kind}] ${f.id}\n${f.detail}\n`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
