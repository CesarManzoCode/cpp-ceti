import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-casos-de-uso";
import { leccion02 } from "./lessons/02-uml-trazable";
import { leccion03 } from "./lessons/03-responsabilidades-acoplamiento";
import { leccion04 } from "./lessons/04-maquetado-reporte-diseno";

import { practice } from "./practice";

export const mmUmlDiseno = defineUnit({
  slug: "mm-03-uml-diseno",
  title: "UML, responsabilidades y diseño",
  description:
    "Usa UML como artefacto trazable a requisitos: casos de uso, responsabilidades, cohesión y maquetado antes de implementar.",
  icon: "📐",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
