import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-unidad-trabajo";
import { leccion02 } from "./lessons/02-acid";
import { leccion03 } from "./lessons/03-commit";
import { leccion04 } from "./lessons/04-rollback";
import { leccion05 } from "./lessons/05-frontera-transaccional";

import { practice } from "./practice";

export const bd2Transacciones = defineUnit({
  slug: "bd2-13-transacciones",
  title: "Transacciones y modelo ACID",
  description:
    "Agrupa cambios que deben ocurrir juntos, confirma o revierte con COMMIT/ROLLBACK y razona con ACID.",
  icon: "🔒",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
