import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-identidad-autorizacion";
import { leccion02 } from "./lessons/02-minimo-privilegio";
import { leccion03 } from "./lessons/03-grant-revoke";
import { leccion04 } from "./lessons/04-matriz-permisos";

export const bd2UsuariosPermisos = defineUnit({
  slug: "bd2-14-usuarios-permisos",
  title: "Usuarios, roles, privilegios y permisos",
  description:
    "Separa identidad de autorización, aplica mínimo privilegio y traduce responsabilidades a una matriz de permisos.",
  icon: "🛡️",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
