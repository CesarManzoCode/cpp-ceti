import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "proceso-hilo-concurrencia",
  title: "Proceso, hilo y concurrencia",
  description:
    "Distingue un proceso de sus hilos y entiende concurrencia como solapamiento de tareas, no como garantía de ejecución simultánea.",
  estimatedMinutes: 14,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Un programa en ejecución puede tener más de un hilo

Un **proceso** es una instancia de un programa con memoria y recursos propios. Dentro de ese proceso puede haber uno o más **hilos** de ejecución.

El hilo principal comienza en \`Main\`. Si creas otro \`Thread\`, ambos pertenecen al mismo proceso y pueden acceder a objetos compartidos del mismo espacio de memoria.

**Concurrencia** significa que varias tareas avanzan durante un mismo intervalo de tiempo. En una CPU con varios núcleos pueden ejecutarse físicamente al mismo tiempo; en otros casos el sistema operativo alterna entre ellas.

No debes depender de cuál hilo “gana” una carrera de tiempo. El programa correcto define cuándo necesita esperar y qué estado puede compartir.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Threading;
class Program
{
    static int resultado;

    static void Calcular()
    {
        resultado = 6 * 7;
    }

    static void Main()
    {
        Thread trabajador = new Thread(Calcular);
        trabajador.Start();
        trabajador.Join();
        Console.WriteLine(resultado);
    }
}`,
      explanation:
        "Start inicia el hilo y Join hace que Main espere su finalización antes de usar resultado.",
      runnable: true,
      expectedOutput: "42",
    },
    {
      type: "matching",
      pairs: [
        { left: "Proceso", right: "Programa en ejecución con recursos propios." },
        { left: "Hilo", right: "Flujo de ejecución dentro del proceso." },
        { left: "Start()", right: "Inicia el hilo." },
        { left: "Join()", right: "Espera a que el hilo termine." },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee n. Crea un Thread que calcule la suma 1 + 2 + ... + n y guarde el resultado en una variable compartida. Inícialo, espera con Join y después imprime la suma. El hilo no debe imprimir directamente.",
        starterCode: `using System;
using System.Threading;
class Program
{
    static int n;
    static long resultado;
    static void Calcular() { }
    static void Main() { }
}`,
        solutionCode: `using System;
using System.Threading;
class Program
{
    static int n;
    static long resultado;
    static void Calcular()
    {
        long suma=0;
        for(int i=1;i<=n;i++)suma+=i;
        resultado=suma;
    }
    static void Main()
    {
        n=int.Parse(Console.ReadLine());
        Thread t=new Thread(Calcular);
        t.Start();
        t.Join();
        Console.WriteLine(resultado);
    }
}`,
        hints: [
          "Lee n antes de Start.",
          "El worker escribe una variable compartida.",
          "Imprime sólo después de Join.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          { stdin: "5\n", expectedStdout: "15\n", visible: true },
          { stdin: "1\n", expectedStdout: "1\n", visible: false },
          { stdin: "100\n", expectedStdout: "5050\n", visible: false },
        ],
      },
    },
  ],
});
