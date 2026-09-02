import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-de-arreglos-a-colecciones";
import { leccion02 } from "./lessons/02-list-de-objetos";
import { leccion03 } from "./lessons/03-stack-y-queue";
import { leccion04 } from "./lessons/04-agregar-buscar-eliminar";
import { leccion05 } from "./lessons/05-inventario-en-memoria";

import { practice } from "./practice";

export const csharpPoo2Colecciones = defineUnit({
  slug: "csharp-poo2-01-colecciones",
  title: "Colecciones y estructuras lineales",
  description:
    "Sustituye arreglos de tamaño fijo por colecciones dinámicas y elige entre lista, pila y cola según la operación del problema.",
  icon: "📚",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
