import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-capas-conexion";
import { leccion02 } from "./lessons/02-especifica-generica";
import { leccion03 } from "./lessons/03-ciclo-conexion";
import { leccion04 } from "./lessons/04-parametros";
import { leccion05 } from "./lessons/05-conexion-local";

export const bd2Conexiones = defineUnit({
  slug: "bd2-16-conexiones",
  title: "Conectar aplicaciones con bases de datos",
  description:
    "Entiende las capas app-driver-SGBD, gestiona el ciclo de vida de una conexión y usa consultas parametrizadas.",
  icon: "🔌",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
});
