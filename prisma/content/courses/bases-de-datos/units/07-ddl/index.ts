import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-create-table";
import { leccion02 } from "./lessons/02-pk-unique-check";
import { leccion03 } from "./lessons/03-foreign-key-ddl";
import { leccion04 } from "./lessons/04-alter-drop";
import { leccion05 } from "./lessons/05-schema-completo";

import { practice } from "./practice";

export const bd1Ddl = defineUnit({
  slug: "bd1-07-ddl",
  title: "DDL: construir la estructura",
  description:
    "Define tablas, tipos y restricciones (PK, FK, UNIQUE, CHECK) y ensambla el esquema del caso.",
  icon: "🏗️",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
