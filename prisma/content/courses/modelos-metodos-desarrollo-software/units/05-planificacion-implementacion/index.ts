import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-descomponer-trabajo";
import { leccion02 } from "./lessons/02-dependencias-gantt";
import { leccion03 } from "./lessons/03-implementar-trazabilidad";
import { leccion04 } from "./lessons/04-seguimiento-desviaciones";

import { practice } from "./practice";

export const mmPlanificacionImplementacion = defineUnit({
  slug: "mm-05-planificacion-implementacion",
  title: "Planificación, tareas e implementación",
  description:
    "Descompone entregables en tareas verificables, ordénalas con dependencias y da seguimiento a su avance implementando contra requisitos y diseño de forma trazable.",
  icon: "🗓️",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
