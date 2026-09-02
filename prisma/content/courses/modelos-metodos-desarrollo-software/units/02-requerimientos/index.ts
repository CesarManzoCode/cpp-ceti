import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-problema-actores-alcance";
import { leccion02 } from "./lessons/02-requisitos-funcionales";
import { leccion03 } from "./lessons/03-requisitos-no-funcionales";
import { leccion04 } from "./lessons/04-criterios-aceptacion";
import { leccion05 } from "./lessons/05-cambio-de-alcance";

import { practice } from "./practice";

export const mmRequerimientos = defineUnit({
  slug: "mm-02-requerimientos",
  title: "Requerimientos, alcance y criterios de aceptación",
  description:
    "Convierte una petición vaga en problema, actores, alcance y requisitos funcionales y no funcionales verificables.",
  icon: "📋",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
