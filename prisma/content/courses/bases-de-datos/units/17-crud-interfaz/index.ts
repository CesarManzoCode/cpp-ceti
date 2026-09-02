import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-crud-capas";
import { leccion02 } from "./lessons/02-create-read";
import { leccion03 } from "./lessons/03-update-delete";
import { leccion04 } from "./lessons/04-views";
import { leccion05 } from "./lessons/05-informes";

import { practice } from "./practice";

export const bd2CrudInterfaz = defineUnit({
  slug: "bd2-17-crud-interfaz",
  title: "CRUD, vistas e informes desde una aplicación",
  description:
    "Separa UI, lógica y acceso a datos; implementa Create/Read/Update/Delete y usa vistas para informes.",
  icon: "🖥️",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
