import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-nosql";
import { leccion02 } from "./lessons/02-documentos-colecciones";
import { leccion03 } from "./lessons/03-embeber-referenciar";
import { leccion04 } from "./lessons/04-relacional-vs-documental";

export const bd2NosqlModelo = defineUnit({
  slug: "bd2-18-nosql-modelo",
  title: "Pensar en documentos y colecciones",
  description:
    "Entiende el modelo documental, representa datos como documentos y elige entre embeber o referenciar.",
  icon: "📄",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
