import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-criterio-de-orden";
import { leccion02 } from "./lessons/02-burbuja-con-objetos";
import { leccion03 } from "./lessons/03-insercion-con-objetos";
import { leccion04 } from "./lessons/04-icomparer-e-icomparer";
import { leccion05 } from "./lessons/05-buscar-objetos";

import { practice } from "./practice";

export const csharpPoo2Ordenamiento = defineUnit({
  slug: "csharp-poo2-03-ordenamiento",
  title: "Ordenamiento y búsqueda de objetos",
  description:
    "Define criterios de comparación, implementa ordenamientos básicos y aprovecha el orden para buscar objetos de forma predecible.",
  icon: "↕️",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
