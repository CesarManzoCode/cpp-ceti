import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-seleccion-proyeccion";
import { leccion02 } from "./lessons/02-union-diferencia";
import { leccion03 } from "./lessons/03-producto-y-join";
import { leccion04 } from "./lessons/04-composicion-consulta";

import { practice } from "./practice";

export const bd1AlgebraRelacional = defineUnit({
  slug: "bd1-06-algebra-relacional",
  title: "Álgebra relacional",
  description:
    "Conecta selección, proyección, unión, diferencia y join con las cláusulas SQL que los expresan.",
  icon: "∑",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
