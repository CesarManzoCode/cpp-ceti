import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-dato-informacion";
import { leccion02 } from "./lessons/02-evolucion-sistemas-datos";
import { leccion03 } from "./lessons/03-componentes-sgbd";
import { leccion04 } from "./lessons/04-relacional-en-una-frase";

import { practice } from "./practice";

export const bd1Fundamentos = defineUnit({
  slug: "bd1-01-fundamentos-sgbd",
  title: "Información, bases de datos y SGBD",
  description:
    "Distingue dato de información, entiende para qué sirve un SGBD y adopta el vocabulario relacional básico.",
  icon: "🗄️",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
