import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-alcance-integrador";
import { leccion02 } from "./lessons/02-automatizacion-integrador";
import { leccion03 } from "./lessons/03-seguridad-mantenimiento-integrador";
import { leccion04 } from "./lessons/04-gui-conexion-integrador";
import { leccion05 } from "./lessons/05-entrega-integrador";

import { practice } from "./practice";

export const bd2Integrador = defineUnit({
  slug: "bd2-20-integrador",
  title: "Proyecto integrador de Base de Datos II",
  description:
    "Cierra el sistema de soporte con automatización justificada, transacciones, permisos, respaldo y una interfaz CRUD conectada.",
  icon: "🧪",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05],
  practice,
});
