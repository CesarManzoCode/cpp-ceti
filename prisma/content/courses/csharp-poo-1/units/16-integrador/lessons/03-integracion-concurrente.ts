import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "integracion-concurrente",
  title: "Integración concurrente sin corromper el inventario",
  description:
    "Aplica comandos desde varios hilos sobre un servicio que protege internamente su recurso crítico.",
  estimatedMinutes: 19,
  xpReward: 70,
  steps: [
    {
      type: "theory",
      markdown: `# La sincronización pertenece al dueño del estado

Si dos clientes pueden pedir ajustes de stock al mismo tiempo, el inventario es un recurso compartido. No conviene exigir que cada UI/socket recuerde hacer \`lock\`: la clase que **posee** el estado debe protegerlo.

Un método \`Ajustar\` puede encerrar en el mismo \`lock\`:

1. verificar el stock actual;
2. comprobar la regla de no-negatividad;
3. escribir el nuevo valor.

Las tres operaciones forman una sola sección crítica. Separar “consultar” y “actualizar” con locks distintos reabre una carrera entre ambas.

El servicio thread-safe sigue siendo usable desde consola y desde un futuro servidor TCP.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Threading;
class ContadorStock
{
    private int stock;
    private readonly object candado=new object();
    public void AgregarUno(){lock(candado){stock++;}}
    public int Leer(){lock(candado){return stock;}}
}
class Program
{
    static ContadorStock inventario=new ContadorStock();
    static void Worker(){for(int i=0;i<1000;i++)inventario.AgregarUno();}
    static void Main(){Thread a=new Thread(Worker),b=new Thread(Worker);a.Start();b.Start();a.Join();b.Join();Console.WriteLine(inventario.Leer());}
}`,
      explanation:
        "la sincronización está dentro del objeto que protege `stock`; los consumidores no necesitan conocer su candado.",
      runnable: true,
      expectedOutput: `2000`,
    },
    {
      type: "code_completion",
      prompt: "Orden dentro de una actualización segura:",
      lines: [
        "entrar al mismo `lock`;",
        "leer estado actual;",
        "validar la transición;",
        "escribir el nuevo estado;",
        "salir del `lock`.",
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `Inventario` con un stock entero privado y `Ajustar(int cambio)` protegido por `lock`. Lee `n`. Crea dos hilos; cada uno llama `Ajustar(1)` exactamente `n` veces. Tras ambos `Join` imprime el stock. La clase, no `Program`, debe poseer el candado.",
        starterCode: `using System;
using System.Threading;
class Inventario { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Threading;
class Inventario
{
    private int stock;
    private readonly object candado=new object();
    public void Ajustar(int cambio){lock(candado){stock+=cambio;}}
    public int Consultar(){lock(candado){return stock;}}
}
class Program
{
    static int n;static Inventario inv=new Inventario();
    static void W(){for(int i=0;i<n;i++)inv.Ajustar(1);}
    static void Main(){n=int.Parse(Console.ReadLine());Thread a=new Thread(W),b=new Thread(W);a.Start();b.Start();a.Join();b.Join();Console.WriteLine(inv.Consultar());}
}`,
        hints: [
          "el `object` de sincronización es campo privado de `Inventario`",
          "ambos hilos comparten la misma instancia",
          "imprime después de `Join`",
        ],
        difficulty: "medium",
        xpReward: 36,
        testCases: [
          {
            visible: true,
            stdin: "1000\n",
            expectedStdout: "2000\n",
          },
          {
            visible: false,
            stdin: "1\n",
            expectedStdout: "2\n",
          },
          {
            visible: false,
            stdin: "3000\n",
            expectedStdout: "6000\n",
          },
        ],
      },
    },
  ],
});
