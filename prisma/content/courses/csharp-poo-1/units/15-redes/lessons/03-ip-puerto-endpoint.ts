import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "ip-puerto-endpoint",
  title: "IP, puerto y endpoint",
  description:
    "Identifica un proceso de red mediante dirección y puerto y valida esos datos antes de intentar una conexión.",
  estimatedMinutes: 15,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Llegar al equipo no basta: hay que llegar al proceso

Una dirección IP identifica una interfaz/host dentro del contexto de red. Un **puerto** identifica un servicio o proceso lógico en ese host.

La combinación se suele representar como un **endpoint**:

\`\`\`text
192.168.1.20:5050
\`\`\`

Dos aplicaciones del mismo equipo pueden escuchar puertos distintos. El puerto TCP y el puerto UDP pertenecen a espacios de transporte independientes.

Antes de abrir un socket puedes validar sintaxis:

- \`IPAddress.TryParse\` para una dirección IP literal;
- puerto entre \`1\` y \`65535\` para este ejercicio (ignoramos \`0\`, que tiene usos especiales al pedir al sistema un puerto efímero).

La validación local evita intentar conexiones con configuración claramente inválida.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Net;
class Program
{
    static void Main()
    {
        IPAddress ip;
        bool ipValida=IPAddress.TryParse("127.0.0.1",out ip);
        int puerto=5050;
        bool puertoValido=puerto>=1 && puerto<=65535;
        Console.WriteLine(ipValida && puertoValido ? "Endpoint valido" : "Endpoint invalido");
    }
}`,
      explanation:
        "validar la configuración no abre red; sólo comprueba que los valores pueden representar un endpoint básico.",
      runnable: true,
      expectedOutput: "Endpoint valido",
    },
    {
      type: "fill_blank",
      template: `IPAddress ip;
bool okIp = IPAddress.{{0}}(textoIp, out ip);
bool okPuerto = puerto >= {{1}} && puerto <= {{2}};`,
      blanks: [
        { answer: "TryParse" },
        { answer: "1" },
        { answer: "65535" },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee una dirección IP y un entero `puerto`. Imprime `VALIDO` sólo si `IPAddress.TryParse` acepta la IP y el puerto está entre 1 y 65535; en otro caso `INVALIDO`. No abras sockets.",
        starterCode: `using System;
using System.Net;
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Net;
class Program
{
    static void Main()
    {
        string texto=Console.ReadLine(); int puerto=int.Parse(Console.ReadLine());
        IPAddress ip; bool ok=IPAddress.TryParse(texto,out ip) && puerto>=1 && puerto<=65535;
        Console.WriteLine(ok?"VALIDO":"INVALIDO");
    }
}`,
        hints: [
          "TryParse no lanza por formato inválido",
          "valida IP y puerto con &&",
          "no intentes conectarte.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: "127.0.0.1\n5050\n",
            expectedStdout: "VALIDO\n",
          },
          {
            visible: false,
            stdin: "999.1.1.1\n5050\n",
            expectedStdout: "INVALIDO\n",
          },
          {
            visible: false,
            stdin: "192.168.0.5\n70000\n",
            expectedStdout: "INVALIDO\n",
          },
        ],
      },
    },
  ],
});
