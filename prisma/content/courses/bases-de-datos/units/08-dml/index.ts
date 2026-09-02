import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-insert";
import { leccion02 } from "./lessons/02-update";
import { leccion03 } from "./lessons/03-delete";
import { leccion04 } from "./lessons/04-crud-relacional";

import { practice } from "./practice";

export const bd1Dml = defineUnit({
  slug: "bd1-08-dml",
  title: "DML: insertar, modificar y eliminar",
  description: "Inserta, actualiza y elimina datos respetando restricciones e integridad referencial.",
  icon: "✍️",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
