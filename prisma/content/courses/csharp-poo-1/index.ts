// =====================================================================
// Paquete de curso: Programación Orientada a Objetos I con C#.
//
// Legacy: las 8 unidades y los 8 sets de práctica siguen viviendo en
// `prisma/content/csharp/unidad-*.ts` y
// `prisma/content/exercises/csharp/u*.ts` — NO se movieron ni se
// editaron. Aquí sólo se reutilizan y se pasan por `adaptLegacyUnits` +
// `defineCourse` para entrar a la misma capa de authoring que los cursos
// nuevos.
//
// Segundo caso de `curriculum`, deliberadamente distinto de C++: UNA sola
// sección (3.er semestre) que envuelve las 8 unidades existentes tal
// cual, en su mismo orden. Demuestra que la agrupación curricular no está
// hardcodeada para C++ ni para dos semestres.
// =====================================================================

import { adaptLegacyUnits, defineCourse } from "../../authoring";
import { cursoCsharpPoo1 } from "../../csharp";
import { csharpPracticeSets } from "../../exercises/csharp";

const authoredUnits = adaptLegacyUnits(cursoCsharpPoo1, csharpPracticeSets);

const {
  slug,
  title,
  description,
  subjectName,
  academicContext,
  language,
  executionProfile,
} = cursoCsharpPoo1;

export const csharpPoo1 = defineCourse({
  slug,
  title,
  description,
  subjectName,
  academicContext,
  language,
  executionProfile,
  curriculum: [
    {
      key: "s3-programacion-orientada-objetos-1",
      semester: 3,
      subjectName: "Programación Orientada a Objetos I",
      units: authoredUnits,
    },
  ],
});
