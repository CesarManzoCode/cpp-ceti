import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-modelo-incremental";
import { leccion02 } from "./lessons/02-iteracion-feedback";
import { leccion03 } from "./lessons/03-plan-incrementos";
import { leccion04 } from "./lessons/04-cronograma-entregas";
import { leccion05 } from "./lessons/05-cascada-vs-incremental";

import { practice } from "./practice";

export const mmIncremental = defineUnit({
  slug: "mm-09-incremental",
  title: "Desarrollo incremental e iterativo",
  description:
    "Divide una entrega en incrementos de valor demostrable, refínalos con feedback y planea su cronograma frente a cascada.",
  icon: "📈",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
