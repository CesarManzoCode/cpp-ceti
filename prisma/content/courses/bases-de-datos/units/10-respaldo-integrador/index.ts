import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-respaldar";
import { leccion02 } from "./lessons/02-estrategia-respaldo";
import { leccion03 } from "./lessons/03-integrador-modelo";
import { leccion04 } from "./lessons/04-integrador-sql";
import { leccion05 } from "./lessons/05-integrador-entrega";

import { practice } from "./practice";

export const bd1RespaldoIntegrador = defineUnit({
  slug: "bd1-10-respaldo-integrador",
  title: "Respaldo, restauración y proyecto integrador",
  description:
    "Diseña una estrategia de respaldo/restauración y cierra el proyecto integrador de la materia.",
  icon: "🧰",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
