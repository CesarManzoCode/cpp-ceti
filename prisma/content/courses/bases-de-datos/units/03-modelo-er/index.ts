import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-entidades-atributos";
import { leccion02 } from "./lessons/02-identificadores";
import { leccion03 } from "./lessons/03-cardinalidades";
import { leccion04 } from "./lessons/04-relacion-muchos-muchos";
import { leccion05 } from "./lessons/05-modelo-er-del-caso";

import { practice } from "./practice";

export const bd1ModeloEr = defineUnit({
  slug: "bd1-03-modelo-er",
  title: "Modelo Entidad-Relación",
  description:
    "Modela entidades, atributos, identificadores y cardinalidades del sistema de soporte técnico.",
  icon: "🧩",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
