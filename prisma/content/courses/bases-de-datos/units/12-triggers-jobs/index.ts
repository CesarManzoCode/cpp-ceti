import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-evento-accion";
import { leccion02 } from "./lessons/02-trigger-auditoria";
import { leccion03 } from "./lessons/03-trigger-vs-restriccion";
import { leccion04 } from "./lessons/04-jobs";
import { leccion05 } from "./lessons/05-automatizacion-segura";

import { practice } from "./practice";

export const bd2TriggersJobs = defineUnit({
  slug: "bd2-12-triggers-jobs",
  title: "Triggers y automatización programada",
  description:
    "Reacciona a eventos de datos con triggers, distingue jobs por tiempo y diseña automatización observable.",
  icon: "⚡",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
