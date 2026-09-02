import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-select-where-order";
import { leccion02 } from "./lessons/02-join";
import { leccion03 } from "./lessons/03-agregados";
import { leccion04 } from "./lessons/04-group-by";
import { leccion05 } from "./lessons/05-having";
import { leccion06 } from "./lessons/06-reporte-negocio";

import { practice } from "./practice";

export const bd1ConsultasReportes = defineUnit({
  slug: "bd1-09-consultas-reportes",
  title: "Consultas SQL y reportes",
  description:
    "Combina SELECT, JOIN, agregados, GROUP BY y HAVING para construir reportes que responden una pregunta de negocio.",
  icon: "📊",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05, leccion06],
  practice,
});
