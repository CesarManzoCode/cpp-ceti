import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-insert-mongodb";
import { leccion02 } from "./lessons/02-find-mongodb";
import { leccion03 } from "./lessons/03-update-delete-mongodb";
import { leccion04 } from "./lessons/04-crud-documental-completo";

export const bd2MongodbCrud = defineUnit({
  slug: "bd2-19-mongodb-crud",
  title: "CRUD en una base documental",
  description:
    "Practica insertOne, find, updateOne y deleteOne en un laboratorio local de MongoDB con evidencia reproducible.",
  icon: "🍃",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
