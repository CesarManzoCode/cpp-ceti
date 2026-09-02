import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-procedimientos";
import { leccion02 } from "./lessons/02-parametros-contrato";
import { leccion03 } from "./lessons/03-create-procedure-mysql";
import { leccion04 } from "./lessons/04-limites-procedimientos";

export const bd2Procedimientos = defineUnit({
  slug: "bd2-11-procedimientos",
  title: "Procedimientos almacenados y modularización",
  description:
    "Diseña el contrato de un procedimiento almacenado y reconoce cuándo modularizar dentro del SGBD.",
  icon: "🧱",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
