import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-verificacion-validacion";
import { leccion02 } from "./lessons/02-tipos-prueba";
import { leccion03 } from "./lessons/03-casos-fronteras";
import { leccion04 } from "./lessons/04-regresion-resultados";

import { practice } from "./practice";

export const mmPruebasCalidad = defineUnit({
  slug: "mm-06-pruebas-calidad",
  title: "Pruebas, verificación y calidad",
  description:
    "Distingue verificación de validación, elige el tipo de prueba adecuado y diseña casos de prueba que cubran fronteras, particiones y regresiones con evidencia documentada.",
  icon: "🧪",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
