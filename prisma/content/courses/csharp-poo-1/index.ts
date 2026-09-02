// =====================================================================
// Paquete de curso: Programación Orientada a Objetos I con C#.
//
// Legacy: las 8 unidades y los 8 sets de práctica siguen viviendo en
// `prisma/content/csharp/unidad-*.ts` y
// `prisma/content/exercises/csharp/u*.ts` — NO se movieron ni se
// editaron. Aquí sólo se reutilizan y se pasan por `adaptLegacyUnits` +
// `defineCourse` para entrar a la misma capa de authoring que los cursos
// nuevos.
// =====================================================================

import { adaptLegacyUnits, defineCourse } from "../../authoring";
import { cursoCsharpPoo1 } from "../../csharp";
import { csharpPracticeSets } from "../../exercises/csharp";

const authoredUnits = adaptLegacyUnits(cursoCsharpPoo1, csharpPracticeSets);

export const csharpPoo1 = defineCourse({
  ...cursoCsharpPoo1,
  units: authoredUnits,
});
