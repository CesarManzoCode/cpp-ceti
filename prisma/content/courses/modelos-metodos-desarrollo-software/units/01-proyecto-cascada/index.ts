import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-de-programa-a-proyecto";
import { leccion02 } from "./lessons/02-fases-cascada";
import { leccion03 } from "./lessons/03-ventajas-limites-cascada";
import { leccion04 } from "./lessons/04-roles-y-entregables";

export const mmProyectoCascada = defineUnit({
  slug: "mm-01-proyecto-cascada",
  title: "Del programa al proyecto: modelo en cascada",
  description:
    "Reconoce qué distingue un proyecto de software de un programa aislado y recorre las fases del modelo en cascada.",
  icon: "🧭",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
