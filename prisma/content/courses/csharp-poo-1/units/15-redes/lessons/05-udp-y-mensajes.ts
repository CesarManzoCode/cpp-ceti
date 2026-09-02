import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "udp-y-mensajes",
  title: "UDP y mensajes independientes",
  description:
    "Modela datagramas autocontenidos y diseña mensajes que puedan interpretarse sin depender de un flujo previo.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# Un datagrama debe poder sostenerse solo

Con UDP cada envío produce un datagrama. Eso facilita conservar fronteras de mensaje, pero elimina garantías que TCP ofrece: un datagrama puede perderse, repetirse o llegar fuera de orden.

Por eso una aplicación UDP suele incluir suficiente contexto dentro del propio mensaje: tipo, identificador y, si importa, número de secuencia.

Ejemplo:

\`\`\`text
STOCK|42|P1|7
\`\`\`

- \`STOCK\`: tipo;
- \`42\`: secuencia;
- \`P1\`: producto;
- \`7\`: valor.

No agregues confirmaciones o reintentos por reflejo: primero decide si el caso de uso los necesita.`,
    },
    {
      type: "code_example",
      code: `using System.Net;
using System.Net.Sockets;
using System.Text;

class EjemploUdp
{
    static void Enviar()
    {
        using(UdpClient udp=new UdpClient())
        {
            byte[] datos=Encoding.UTF8.GetBytes("PING|1");
            udp.Send(datos,datos.Length,"127.0.0.1",5051);
        }
    }
}`,
      explanation:
        "`UdpClient.Send` transmite un datagrama. No se ejecuta en el juez porque abre comunicación de red.",
      runnable: false,
      localOnlyNote:
        "Laboratorio UDP local. El runner web no permite transmisión de datagramas.",
    },
    {
      type: "quiz",
      question: "¿qué debe asumir una aplicación básica sobre UDP?",
      options: [
        "Todos los datagramas llegan exactamente una vez y en orden.",
        "UDP crea un stream continuo como TCP.",
        "La aplicación no recibe garantía de entrega/orden y debe diseñar su protocolo según esa realidad.",
        "UDP no utiliza puertos.",
      ],
      correctIndex: 2,
      explanation:
        "La aplicación no recibe garantía de entrega/orden y debe diseñar su protocolo según esa realidad.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `tipo`, `secuencia`, `codigo`, `valor` en líneas separadas. Construye el mensaje `TIPO|SECUENCIA|CODIGO|VALOR`, luego vuelve a separarlo con `Split` e imprime `Secuencia X: CODIGO=VALOR`. No abras red.",
        starterCode: `using System;
class Program { static void Main() { } }`,
        solutionCode: `using System;
class Program
{
    static void Main()
    {
        string tipo=Console.ReadLine();
        int secuencia=int.Parse(Console.ReadLine());
        string codigo=Console.ReadLine();
        int valor=int.Parse(Console.ReadLine());
        string mensaje=tipo+"|"+secuencia+"|"+codigo+"|"+valor;
        string[] p=mensaje.Split('|');
        Console.WriteLine("Secuencia "+p[1]+": "+p[2]+"="+p[3]);
    }
}`,
        hints: [
          "construye primero un único string",
          "Split('|') recupera campos",
          "el ejercicio evalúa framing lógico, no red.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: "STOCK\n42\nP1\n7\n",
            expectedStdout: "Secuencia 42: P1=7\n",
          },
          {
            visible: false,
            stdin: "TEMP\n1\nSENSOR-A\n0\n",
            expectedStdout: "Secuencia 1: SENSOR-A=0\n",
          },
          {
            visible: false,
            stdin: "DATO\n999\nX\n-3\n",
            expectedStdout: "Secuencia 999: X=-3\n",
          },
        ],
      },
    },
  ],
});
