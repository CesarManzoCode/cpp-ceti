import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-genericos";
import { leccion02 } from "./lessons/02-clase-generica";
import { leccion03 } from "./lessons/03-metodo-generico";
import { leccion04 } from "./lessons/04-restricciones-genericas";
import { leccion05 } from "./lessons/05-repositorio-generico";

import { practice } from "./practice";

export const csharpPoo2Genericos = defineUnit({
  slug: "csharp-poo2-05-genericos",
  title: "Clases y métodos genéricos",
  description:
    "Reutiliza estructuras y operaciones sin perder type safety, y usa restricciones para expresar qué capacidades necesita un tipo genérico.",
  icon: "🧩",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
