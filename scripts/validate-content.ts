/**
 * Valida el registry canónico de contenido (`prisma/content/courses`) sin
 * tocar DB ni ejecutar compiladores.
 *
 * La validación semántica (`ContentValidationError`) corre DURANTE el
 * import del registry — `buildContentRegistry` la ejecuta antes de dejar
 * pasar un registry canónico. Por eso el import va con dynamic import
 * dentro de un try/catch: así un error de contenido se imprime como una
 * lista de issues legible, no como un stack trace de un módulo que
 * truena al cargarse.
 *
 * Uso:
 *   npx tsx scripts/validate-content.ts
 *   npm run content:validate
 */
import { ContentValidationError } from "../prisma/content/validate";

async function main() {
  let registry: {
    allCourses: import("../prisma/content/types").CourseDefinition[];
    allPracticeSets: import("../prisma/content/exercises/types").PracticeUnitSetDefinition[];
  };

  try {
    registry = await import("../prisma/content/courses");
  } catch (err) {
    if (err instanceof ContentValidationError) {
      console.error(`❌ Contenido inválido — ${err.issues.length} problema(s):\n`);
      for (const issue of err.issues) {
        console.error(`  · ${issue.path}: ${issue.message}`);
      }
      process.exit(1);
    }
    console.error("❌ Error inesperado cargando el registry de contenido:");
    console.error(err);
    process.exit(1);
  }

  const { allCourses, allPracticeSets } = registry;

  const totalUnits = allCourses.reduce((n, c) => n + c.units.length, 0);
  const totalLessons = allCourses.reduce(
    (n, c) => n + c.units.reduce((m, u) => m + u.lessons.length, 0),
    0,
  );
  const totalSteps = allCourses.reduce(
    (n, c) =>
      n +
      c.units.reduce(
        (m, u) =>
          m + u.lessons.reduce((k, l) => k + l.steps.length, 0),
        0,
      ),
    0,
  );
  const totalExercises = allPracticeSets.reduce(
    (n, s) => n + s.exercises.length,
    0,
  );

  console.log("✅ Contenido válido.\n");
  console.log(`  Cursos:      ${allCourses.length}`);
  for (const course of allCourses) {
    const lessons = course.units.reduce((n, u) => n + u.lessons.length, 0);
    const steps = course.units.reduce(
      (n, u) => n + u.lessons.reduce((m, l) => m + l.steps.length, 0),
      0,
    );
    const exercises = allPracticeSets
      .filter((s) => s.courseSlug === course.slug)
      .reduce((n, s) => n + s.exercises.length, 0);
    console.log(
      `    - ${course.slug}: ${course.units.length} unidades, ${lessons} lecciones, ` +
        `${steps} steps, ${exercises} ejercicios de práctica`,
    );
  }
  console.log(`  Unidades:    ${totalUnits}`);
  console.log(`  Lecciones:   ${totalLessons}`);
  console.log(`  Steps:       ${totalSteps}`);
  console.log(`  Prácticas:   ${totalExercises}`);

  process.exit(0);
}

main();
