import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-clave-y-valor";
import { leccion02 } from "./lessons/02-dictionary-basico";
import { leccion03 } from "./lessons/03-buscar-seguro";
import { leccion04 } from "./lessons/04-actualizar-y-eliminar";
import { leccion05 } from "./lessons/05-elegir-coleccion";

import { practice } from "./practice";

export const csharpPoo2Diccionarios = defineUnit({
  slug: "csharp-poo2-02-diccionarios",
  title: "Diccionarios de objetos",
  description:
    "Organiza objetos por una clave estable y realiza altas, consultas, actualizaciones y bajas sin recorrer toda la colección.",
  icon: "🗂️",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
