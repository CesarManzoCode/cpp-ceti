import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-proceso-hilo-concurrencia";
import { leccion02 } from "./lessons/02-thread-y-join";
import { leccion03 } from "./lessons/03-estado-compartido";
import { leccion04 } from "./lessons/04-lock-y-exclusion-mutua";
import { leccion05 } from "./lessons/05-errores-en-hilos";

import { practice } from "./practice";

export const csharpPoo2Concurrencia = defineUnit({
  slug: "csharp-poo2-06-concurrencia",
  title: "Concurrencia e hilos",
  description:
    "Ejecuta trabajo concurrente, identifica estado compartido y protege recursos críticos con sincronización explícita.",
  icon: "🧵",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
