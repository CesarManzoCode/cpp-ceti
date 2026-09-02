import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-por-que-solid";
import { leccion02 } from "./lessons/02-srp";
import { leccion03 } from "./lessons/03-ocp";
import { leccion04 } from "./lessons/04-lsp";
import { leccion05 } from "./lessons/05-isp";
import { leccion06 } from "./lessons/06-dip";

import { practice } from "./practice";

export const mmSolid = defineUnit({
  slug: "mm-08-solid",
  title: "SOLID aplicado a código mantenible",
  description:
    "Presenta cada principio SOLID (SRP, OCP, LSP, ISP, DIP) como respuesta a un costo de cambio observable, no como una sigla aislada.",
  icon: "🧱",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05, leccion06],
  practice,
});
