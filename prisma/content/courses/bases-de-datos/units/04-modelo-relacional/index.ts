import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-tablas-y-dominios";
import { leccion02 } from "./lessons/02-pk-fk";
import { leccion03 } from "./lessons/03-nulabilidad-integridad";
import { leccion04 } from "./lessons/04-restricciones-check-unique";
import { leccion05 } from "./lessons/05-traducir-nm";

import { practice } from "./practice";

export const bd1ModeloRelacional = defineUnit({
  slug: "bd1-04-modelo-relacional",
  title: "Del modelo ER al modelo relacional",
  description:
    "Traduce entidades y relaciones a tablas, claves primarias/foráneas y restricciones.",
  icon: "🔗",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
