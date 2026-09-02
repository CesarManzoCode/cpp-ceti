import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-normalizar";
import { leccion02 } from "./lessons/02-primera-forma-normal";
import { leccion03 } from "./lessons/03-segunda-forma-normal";
import { leccion04 } from "./lessons/04-tercera-forma-normal";
import { leccion05 } from "./lessons/05-normalizar-caso";

import { practice } from "./practice";

export const bd1Normalizacion = defineUnit({
  slug: "bd1-05-normalizacion",
  title: "Normalización",
  description: "Reduce redundancia y anomalías aplicando 1FN, 2FN y 3FN a un caso completo.",
  icon: "🧹",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
