import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-tipos-mantenimiento";
import { leccion02 } from "./lessons/02-reproducir-antes-corregir";
import { leccion03 } from "./lessons/03-impacto-regresion";
import { leccion04 } from "./lessons/04-plan-mejora";

import { practice } from "./practice";

export const mmMantenimiento = defineUnit({
  slug: "mm-07-mantenimiento",
  title: "Mantenimiento y evolución segura",
  description:
    "Clasifica el mantenimiento por intención, reproduce defectos antes de corregirlos y prioriza mejoras protegiendo el comportamiento previo.",
  icon: "🔧",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
