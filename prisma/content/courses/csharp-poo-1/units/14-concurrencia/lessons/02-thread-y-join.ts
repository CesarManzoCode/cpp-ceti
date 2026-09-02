import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "thread-y-join",
  title: "Dos trabajadores y Join",
  description:
    "Divide una tarea en trabajadores independientes y usa Join como barrera antes de combinar resultados.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# Esperar es parte del algoritmo

Si dos hilos calculan resultados independientes, el hilo principal puede iniciarlos y luego esperar a ambos.

\`Join\` no “hace más rápido” el programa. Define una dependencia: **no puedo combinar resultados hasta que este trabajador termine**.

Una estrategia segura para empezar con concurrencia es minimizar el estado compartido:

- cada hilo escribe su propio resultado;
- ningún hilo modifica la variable del otro;
- \`Main\` combina después de ambos \`Join\`.

Eso evita sincronización innecesaria y hace el resultado determinista.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Threading;
class Program
{
    static int sumaPares;
    static int sumaImpares;

    static void Pares()
    {
        for(int i=2;i<=10;i+=2)sumaPares+=i;
    }
    static void Impares()
    {
        for(int i=1;i<=10;i+=2)sumaImpares+=i;
    }

    static void Main()
    {
        Thread a=new Thread(Pares);
        Thread b=new Thread(Impares);
        a.Start(); b.Start();
        a.Join(); b.Join();
        Console.WriteLine(sumaPares+sumaImpares);
    }
}`,
      explanation:
        "Cada hilo tiene una salida separada; Main combina después de esperar a ambos.",
      runnable: true,
      expectedOutput: "55",
    },
    {
      type: "quiz",
      question: "¿Qué propiedad hace sencillo este ejemplo?",
      options: [
        "Ambos hilos incrementan exactamente la misma variable.",
        "Cada hilo escribe un resultado distinto y Main combina después de Join.",
        "El orden de salida de los hilos está hardcodeado.",
        "Thread bloquea automáticamente todo el proceso.",
      ],
      correctIndex: 1,
      explanation:
        "Cada hilo escribe un resultado distinto y Main combina después de Join.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee n. Un hilo suma los números pares de 1..n; otro suma los impares. Cada hilo debe escribir su propia variable. Inicia ambos, espera ambos y muestra Pares: X, Impares: Y, Total: Z.",
        starterCode: `using System;
using System.Threading;
class Program
{
    static int n;
    static long pares, impares;
    static void SumarPares() { }
    static void SumarImpares() { }
    static void Main() { }
}`,
        solutionCode: `using System;
using System.Threading;
class Program
{
    static int n;
    static long pares, impares;
    static void SumarPares(){for(int i=2;i<=n;i+=2)pares+=i;}
    static void SumarImpares(){for(int i=1;i<=n;i+=2)impares+=i;}
    static void Main()
    {
        n=int.Parse(Console.ReadLine());
        Thread a=new Thread(SumarPares), b=new Thread(SumarImpares);
        a.Start();b.Start();a.Join();b.Join();
        Console.WriteLine("Pares: "+pares);
        Console.WriteLine("Impares: "+impares);
        Console.WriteLine("Total: "+(pares+impares));
    }
}`,
        hints: [
          "No hagas que ambos escriban total.",
          "Separa pares e impares.",
          "Los dos Join ocurren antes de imprimir.",
        ],
        difficulty: "medium",
        xpReward: 32,
        testCases: [
          {
            stdin: "5\n",
            expectedStdout: "Pares: 6\nImpares: 9\nTotal: 15\n",
            visible: true,
          },
          {
            stdin: "1\n",
            expectedStdout: "Pares: 0\nImpares: 1\nTotal: 1\n",
            visible: false,
          },
          {
            stdin: "10\n",
            expectedStdout: "Pares: 30\nImpares: 25\nTotal: 55\n",
            visible: false,
          },
        ],
      },
    },
  ],
});
