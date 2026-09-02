import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "protocolo-mensaje-socket",
  title: "Protocolo, mensaje y socket",
  description:
    "Separa las reglas de comunicación, los datos enviados y el extremo técnico usado para transportarlos.",
  estimatedMinutes: 14,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Hablar por red exige acordar un idioma

Tres conceptos aparecen juntos pero no significan lo mismo:

- **Protocolo:** reglas que ambas partes acuerdan: comandos, orden de campos, respuestas, errores.
- **Mensaje:** una instancia concreta enviada siguiendo esas reglas.
- **Socket:** extremo de comunicación que una aplicación usa para enviar o recibir bytes a través de la red.

Ejemplo de protocolo propio de inventario:

\`\`\`text
BUSCAR|P1
ALTA|P2|7
OK|P1|5
ERROR|NO_ENCONTRADO
\`\`\`

El socket no sabe qué significa \`BUSCAR\`. Sólo transporta datos. Tu código de aplicación interpreta el mensaje según el protocolo.

Diseñar primero el formato del mensaje reduce ambigüedades cuando llegue el código de red real.

## Dónde encaja dentro de la red

Usaremos el modelo por capas como mapa conceptual: el protocolo propio vive en **aplicación**; TCP/UDP resuelven **transporte** entre procesos; IP aporta **direccionamiento de red**; Ethernet/Wi-Fi operan más abajo en el enlace. La meta no es memorizar capas aisladas, sino no atribuirle a TCP la semántica de \`BUSCAR\` ni al dominio responsabilidades de transporte.`,
    },
    {
      type: "code_example",
      code: `using System;
class Mensaje
{
    public string Comando{get;private set;}
    public string[] Argumentos{get;private set;}
    public Mensaje(string comando,string[] argumentos){Comando=comando;Argumentos=argumentos;}
}
class Protocolo
{
    public static Mensaje Parsear(string texto)
    {
        string[] partes=texto.Split('|');
        string[] args=new string[partes.Length-1];
        for(int i=1;i<partes.Length;i++)args[i-1]=partes[i];
        return new Mensaje(partes[0],args);
    }
}
class Program
{
    static void Main()
    {
        Mensaje m=Protocolo.Parsear("ALTA|P2|7");
        Console.WriteLine(m.Comando);
        Console.WriteLine(m.Argumentos[0]);
        Console.WriteLine(m.Argumentos[1]);
    }
}`,
      explanation:
        "esta lógica no abre red. Aísla la gramática del mensaje y se puede probar completamente con strings.",
      runnable: true,
      expectedOutput: `ALTA
P2
7`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Regla `COMANDO|ARG1|ARG2`", right: "Protocolo." },
        { left: "`ALTA|P2|7`", right: "Mensaje." },
        { left: "Extremo que transmite bytes", right: "Socket." },
        {
          left: "Código que decide qué significa `ALTA`",
          right: "Lógica de aplicación/protocolo.",
        },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee una línea con formato `COMANDO|ARG1|ARG2...`. Imprime primero `Comando: X`, luego `Argumentos: N` y finalmente cada argumento en una línea. La entrada siempre tiene al menos el comando.",
        starterCode: `using System;
class Program { static void Main() { } }`,
        solutionCode: `using System;
class Program
{
    static void Main()
    {
        string[] p=Console.ReadLine().Split('|');
        Console.WriteLine("Comando: "+p[0]);
        Console.WriteLine("Argumentos: "+(p.Length-1));
        for(int i=1;i<p.Length;i++)Console.WriteLine(p[i]);
    }
}`,
        hints: [
          "Split('|')",
          "el comando está en índice 0",
          "Length - 1 es la cantidad de argumentos.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: "ALTA|P2|7\n",
            expectedStdout: "Comando: ALTA\nArgumentos: 2\nP2\n7\n",
          },
          {
            visible: false,
            stdin: "PING\n",
            expectedStdout: "Comando: PING\nArgumentos: 0\n",
          },
          {
            visible: false,
            stdin: "BUSCAR|A&B\n",
            expectedStdout: "Comando: BUSCAR\nArgumentos: 1\nA&B\n",
          },
        ],
      },
    },
  ],
});
