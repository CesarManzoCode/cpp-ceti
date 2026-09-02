import { adaptLegacyUnits, defineCourse } from "../../authoring";
import { cursoCsharpPoo1 } from "../../csharp";
import { csharpPracticeSets } from "../../exercises/csharp";

import { csharpPoo2Colecciones } from "./units/09-colecciones";
import { csharpPoo2Diccionarios } from "./units/10-diccionarios";
import { csharpPoo2Ordenamiento } from "./units/11-ordenamiento";
import { csharpPoo2Xml } from "./units/12-xml";
import { csharpPoo2Genericos } from "./units/13-genericos";
import { csharpPoo2Concurrencia } from "./units/14-concurrencia";
import { csharpPoo2Redes } from "./units/15-redes";
import { csharpPoo2Integrador } from "./units/16-integrador";

// =====================================================================
// Paquete de curso: Programación Orientada a Objetos con C#.
//
// S3 (legacy): las 8 unidades y los 8 sets de práctica de POO I siguen
// viviendo en `prisma/content/csharp/unidad-*.ts` y
// `prisma/content/exercises/csharp/u*.ts` — NO se movieron ni se editaron.
// Aquí sólo se reutilizan vía `adaptLegacyUnits`.
//
// S4 (nueva, POO II): capa de authoring completa, colocalizada por unidad
// bajo `./units/`. Las 8 unidades entran con `published: false` — el
// release gate de S4 es una tarea posterior.
// =====================================================================

const authoredUnitsS3 = adaptLegacyUnits(cursoCsharpPoo1, csharpPracticeSets);

export const csharpPoo1 = defineCourse({
  slug: "csharp-poo-1",
  title: "Programación Orientada a Objetos con C#",
  description:
    "Modela, implementa y conecta aplicaciones orientadas a objetos en C#, desde clases y relaciones hasta colecciones, persistencia, concurrencia y redes.",
  subjectName: "Programación Orientada a Objetos",
  academicContext: "CETI · Tecnólogo en Desarrollo de Software",
  language: cursoCsharpPoo1.language,
  executionProfile: cursoCsharpPoo1.executionProfile,
  curriculum: [
    {
      key: "s3-programacion-orientada-objetos-1",
      semester: 3,
      subjectName: "Programación Orientada a Objetos I",
      units: authoredUnitsS3,
    },
    {
      key: "s4-programacion-orientada-objetos-2",
      semester: 4,
      subjectName: "Programación Orientada a Objetos II",
      units: [
        csharpPoo2Colecciones,
        csharpPoo2Diccionarios,
        csharpPoo2Ordenamiento,
        csharpPoo2Xml,
        csharpPoo2Genericos,
        csharpPoo2Concurrencia,
        csharpPoo2Redes,
        csharpPoo2Integrador,
      ],
    },
  ],
});
