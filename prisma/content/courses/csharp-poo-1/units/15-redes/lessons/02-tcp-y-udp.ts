import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "tcp-y-udp",
  title: "TCP y UDP: garantías distintas",
  description:
    "Elige transporte según necesidad de conexión, entrega ordenada y tolerancia a pérdida.",
  estimatedMinutes: 15,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# TCP y UDP no son versiones “buena” y “mala” de lo mismo

**TCP** ofrece un flujo orientado a conexión. El receptor recibe los bytes en orden y el protocolo de transporte gestiona retransmisiones necesarias. Eso no significa que una llamada \`Read\` corresponda exactamente a un mensaje de aplicación: el flujo debe delimitarse.

**UDP** envía datagramas independientes. No establece una conexión equivalente a TCP y no garantiza entrega, orden ni ausencia de duplicados.

Elegir depende del problema:

- operación de inventario que no quieres perder → TCP suele ser una base razonable;
- telemetría frecuente donde una muestra vieja puede descartarse → UDP puede tener sentido.

La aplicación sigue siendo responsable de validar mensajes en ambos casos.`,
    },
    {
      type: "code_example",
      code: `using System.Net;
using System.Net.Sockets;

class Ejemplos
{
    static void CrearSockets()
    {
        Socket tcp = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        Socket udp = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
    }
}`,
      explanation:
        "`Stream/Tcp` y `Dgram/Udp` expresan modelos distintos de transporte. Crear/usar sockets reales pertenece al laboratorio local.",
      runnable: false,
      localOnlyNote:
        "Ejemplo de API de sockets. El runner web no abre conexiones de red; compílalo localmente dentro del laboratorio de redes.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Entrega ordenada y conexión", right: "TCP." },
        { left: "Datagramas independientes", right: "UDP." },
        {
          left: "Una lectura TCP puede traer parte o varios mensajes",
          right: "Debes definir framing de aplicación.",
        },
        {
          left: "UDP puede perder un datagrama",
          right: "La aplicación decide si necesita compensarlo.",
        },
      ],
    },
    {
      type: "quiz",
      question: "¿qué afirmación es correcta sobre TCP?",
      options: [
        "Cada `Read` equivale exactamente a un mensaje enviado.",
        "Garantiza que tu JSON/XML sea semánticamente válido.",
        "Ofrece un flujo ordenado de bytes; tu protocolo debe delimitar sus mensajes.",
        "No usa puertos.",
      ],
      correctIndex: 2,
      explanation:
        "Ofrece un flujo ordenado de bytes; tu protocolo debe delimitar sus mensajes.",
    },
  ],
});
