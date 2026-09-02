import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-protocolo-mensaje-socket";
import { leccion02 } from "./lessons/02-tcp-y-udp";
import { leccion03 } from "./lessons/03-ip-puerto-endpoint";
import { leccion04 } from "./lessons/04-cliente-servidor-tcp";
import { leccion05 } from "./lessons/05-udp-y-mensajes";
import { leccion06 } from "./lessons/06-seguridad-del-mensaje";

import { practice } from "./practice";

export const csharpPoo2Redes = defineUnit({
  slug: "csharp-poo2-07-redes",
  title: "Redes, protocolos y sockets",
  description:
    "Diseña mensajes, identifica protocolos y direccionamiento, y construye la lógica de una aplicación cliente-servidor sin confundir el protocolo con el transporte.",
  icon: "🌐",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04, leccion05, leccion06],
  practice,
});
