import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-mantener";
import { leccion02 } from "./lessons/02-fragmentacion";
import { leccion03 } from "./lessons/03-analizar-mysql";
import { leccion04 } from "./lessons/04-plan-mantenimiento";

export const bd2Mantenimiento = defineUnit({
  slug: "bd2-15-mantenimiento",
  title: "Mantenimiento y fragmentación",
  description:
    "Relaciona crecimiento y cambios con mantenimiento del SGBD y diseña un plan basado en evidencia, no en superstición.",
  icon: "🧰",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
