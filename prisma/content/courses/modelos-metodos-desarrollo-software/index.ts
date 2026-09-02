import { defineCourse } from "../../authoring";

import { mmProyectoCascada } from "./units/01-proyecto-cascada";
import { mmRequerimientos } from "./units/02-requerimientos";
import { mmUmlDiseno } from "./units/03-uml-diseno";
import { mmGitVersiones } from "./units/04-git-versiones";
import { mmPlanificacionImplementacion } from "./units/05-planificacion-implementacion";
import { mmPruebasCalidad } from "./units/06-pruebas-calidad";
import { mmMantenimiento } from "./units/07-mantenimiento";
import { mmSolid } from "./units/08-solid";
import { mmIncremental } from "./units/09-incremental";
import { mmIntegrador } from "./units/10-integrador";

// =====================================================================
// Paquete de curso: Modelos y métodos de desarrollo de software.
//
// S5 (nueva materia): 10 unidades, una sola CurriculumSection semestral.
// Lenguaje práctico C#, pero la identidad del Course es proceso/ingeniería
// de desarrollo (cascada, requisitos, UML, Git, planificación, pruebas,
// mantenimiento, SOLID, incrementos, proyecto integrador). Las 10 unidades
// nacen `published: true` — no hay release gate para esta entrega.
// =====================================================================

export const modelosMetodosDesarrolloSoftware = defineCourse({
  slug: "modelos-metodos-desarrollo-software",
  title: "Modelos y métodos de desarrollo de software",
  description:
    "Convierte problemas en proyectos de software trazables: requisitos, diseño, control de versiones, pruebas, mantenimiento, SOLID y entregas incrementales.",
  subjectName: "Modelos y métodos de desarrollo de software",
  academicContext: "CETI · Tecnólogo en Desarrollo de Software",
  language: "csharp",
  executionProfile: "csharp-mono-6.12",
  curriculum: [
    {
      key: "s5-modelos-metodos-desarrollo-software-1",
      semester: 5,
      subjectName: "Modelos y Métodos de Desarrollo de Software I",
      units: [
        mmProyectoCascada,
        mmRequerimientos,
        mmUmlDiseno,
        mmGitVersiones,
        mmPlanificacionImplementacion,
        mmPruebasCalidad,
        mmMantenimiento,
        mmSolid,
        mmIncremental,
        mmIntegrador,
      ],
    },
  ],
});
