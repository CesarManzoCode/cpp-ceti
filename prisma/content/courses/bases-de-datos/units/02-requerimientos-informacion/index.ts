import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-preguntas-antes-tablas";
import { leccion02 } from "./lessons/02-tecnicas-recoleccion";
import { leccion03 } from "./lessons/03-abstraer-clasificar-filtrar";
import { leccion04 } from "./lessons/04-requerimientos-documentados";

import { practice } from "./practice";

export const bd1Requerimientos = defineUnit({
  slug: "bd1-02-requerimientos-informacion",
  title: "Requerimientos de información",
  description:
    "Recolecta y documenta requerimientos de información antes de diseñar cualquier tabla.",
  icon: "🔎",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
