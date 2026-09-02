import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-requisitos-y-uml";
import { leccion02 } from "./lessons/02-arquitectura-del-proyecto";
import { leccion03 } from "./lessons/03-integracion-concurrente";
import { leccion04 } from "./lessons/04-entrega-y-evidencias";

import { practice } from "./practice";

export const csharpPoo2Integrador = defineUnit({
  slug: "csharp-poo2-08-integrador",
  title: "Proyecto integrador: inventario distribuido",
  description:
    "Integra estructuras dinámicas, genéricos, XML, concurrencia y un protocolo cliente-servidor en una solución orientada a objetos documentada.",
  icon: "🏗️",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
