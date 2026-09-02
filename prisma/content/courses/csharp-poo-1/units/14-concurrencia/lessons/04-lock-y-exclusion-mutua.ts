import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "lock-y-exclusion-mutua",
  title: "lock y exclusión mutua",
  description:
    "Protege una sección crítica para que sólo un hilo a la vez modifique el estado compartido.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Exclusión mutua: uno dentro, los demás esperan

\`lock(objeto)\` protege un bloque asociado a un objeto de sincronización. Mientras un hilo está dentro, otro hilo que intenta entrar usando **el mismo objeto** espera.

\`\`\`csharp
lock (candado)
{
    contador++;
}
\`\`\`

La sección crítica debe ser lo más pequeña posible: sólo el trabajo que realmente necesita exclusividad.

Buenas reglas para este nivel:

- usa un objeto privado dedicado como candado;
- todos los accesos que modifican el recurso crítico deben respetar el mismo candado;
- no hagas I/O lento dentro del \`lock\` si no es necesario;
- \`lock\` protege consistencia, no garantiza orden de turnos.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Threading;
class Program
{
    static int contador;
    static readonly object candado=new object();
    static void Incrementar()
    {
        for(int i=0;i<10000;i++)
        {
            lock(candado){contador++;}
        }
    }
    static void Main()
    {
        Thread a=new Thread(Incrementar),b=new Thread(Incrementar);
        a.Start();b.Start();a.Join();b.Join();
        Console.WriteLine(contador);
    }
}`,
      explanation:
        "Ambos hilos usan el mismo candado; cada read-modify-write de contador termina antes de que el otro entre.",
      runnable: true,
      expectedOutput: "20000",
    },
    {
      type: "fill_blank",
      template: `static readonly object {{0}} = new object();
...
{{1}} (candado)
{
    contador++;
}`,
      blanks: [
        { answer: "candado" },
        { answer: "lock" },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee n. Crea dos hilos; cada uno incrementa contador exactamente n veces. Protege cada incremento con lock sobre el mismo objeto. Después de ambos Join, imprime contador, que debe ser siempre 2*n.",
        starterCode: `using System;
using System.Threading;
class Program
{
    static int n, contador;
    static readonly object candado=new object();
    static void Trabajar() { }
    static void Main() { }
}`,
        solutionCode: `using System;
using System.Threading;
class Program
{
    static int n, contador;
    static readonly object candado=new object();
    static void Trabajar(){for(int i=0;i<n;i++){lock(candado){contador++;}}}
    static void Main(){n=int.Parse(Console.ReadLine());Thread a=new Thread(Trabajar),b=new Thread(Trabajar);a.Start();b.Start();a.Join();b.Join();Console.WriteLine(contador);}
}`,
        hints: [
          "El objeto de lock es compartido.",
          "lock va alrededor del incremento.",
          "Espera a ambos hilos antes de imprimir.",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          { stdin: "1000\n", expectedStdout: "2000\n", visible: true },
          { stdin: "1\n", expectedStdout: "2\n", visible: false },
          { stdin: "5000\n", expectedStdout: "10000\n", visible: false },
        ],
      },
    },
  ],
});
