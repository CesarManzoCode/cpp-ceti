import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-que-es-xml";
import { leccion02 } from "./lessons/02-bien-formado-y-valido";
import { leccion03 } from "./lessons/03-objetos-a-xml";
import { leccion04 } from "./lessons/04-xml-a-objetos";
import { leccion05 } from "./lessons/05-persistencia-xml";

import { practice } from "./practice";

export const csharpPoo2Xml = defineUnit({
  slug: "csharp-poo2-04-xml",
  title: "XML y persistencia",
  description:
    "Representa objetos como XML, valida su estructura, transforma texto en datos tipados y separa serialización de persistencia física.",
  icon: "🧾",
  published: false,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
