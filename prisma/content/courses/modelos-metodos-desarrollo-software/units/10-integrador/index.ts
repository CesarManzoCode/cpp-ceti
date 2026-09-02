import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-problema-requisitos-plan";
import { leccion02 } from "./lessons/02-arquitectura-dominio";
import { leccion03 } from "./lessons/03-persistencia-gui-local";
import { leccion04 } from "./lessons/04-entrega-evolucion";

import { practice } from "./practice";

export const mmIntegrador = defineUnit({
  slug: "mm-10-integrador",
  title: "Proyecto integrador",
  description:
    "Construye un sistema de gestión de solicitudes de soporte técnico de principio a fin, desde requisitos hasta una evolución incremental controlada.",
  icon: "🧩",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
  practice,
});
