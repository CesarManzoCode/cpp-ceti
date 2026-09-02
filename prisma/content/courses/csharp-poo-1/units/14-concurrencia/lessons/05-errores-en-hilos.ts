import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "errores-en-hilos",
  title: "Errores y excepciones dentro de hilos",
  description:
    "Maneja fallos en el hilo que los produce y comunica un resultado explícito al hilo coordinador.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Un hilo también tiene fronteras de error

Una excepción lanzada dentro de un worker no debe asumirse como si hubiera ocurrido directamente en \`Main\`. El trabajo concurrente necesita decidir cómo comunicar éxito o fallo.

Una estrategia sencilla y determinista:

1. el hilo ejecuta su \`try/catch\`;
2. guarda resultado o mensaje de error en variables propias;
3. \`Main\` hace \`Join\`;
4. \`Main\` decide qué mostrar o hacer después.

La meta no es esconder la excepción. Es convertirla en estado explícito que el coordinador pueda manejar.

En sistemas mayores existen abstracciones de más alto nivel para tareas asíncronas, pero aquí el programa oficial pide hilos y el objetivo es comprender su comportamiento directamente.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Threading;
class Program
{
    static int divisor;
    static string salida;
    static void Calcular()
    {
        try{salida=(100/divisor).ToString();}
        catch(DivideByZeroException){salida="ERROR";}
    }
    static void Main()
    {
        divisor=0;
        Thread t=new Thread(Calcular);
        t.Start();t.Join();
        Console.WriteLine(salida);
    }
}`,
      explanation:
        "El worker captura el error donde ocurre y publica una salida que Main lee sólo después de Join.",
      runnable: true,
      expectedOutput: "ERROR",
    },
    {
      type: "quiz",
      question:
        "¿Cuál es una estrategia segura para este nivel cuando un worker puede fallar?",
      options: [
        "Ignorar todas las excepciones.",
        "Capturar dentro del worker, guardar resultado/error y leerlo tras Join.",
        "Confiar en que Join convierta la excepción en valor de retorno.",
        "Hacer Thread.Sleep después del fallo.",
      ],
      correctIndex: 1,
      explanation:
        "Capturar dentro del worker, guardar resultado/error y leerlo tras Join.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee un entero divisor. Un hilo debe calcular 100 / divisor. Si ocurre DivideByZeroException, el mismo hilo guarda ERROR: division por cero. Main espera y después imprime el resultado o el error. El worker no imprime.",
        starterCode: `using System;
using System.Threading;
class Program
{
    static int divisor;
    static string salida;
    static void Worker() { }
    static void Main() { }
}`,
        solutionCode: `using System;
using System.Threading;
class Program
{
    static int divisor;
    static string salida;
    static void Worker()
    {
        try{salida=(100/divisor).ToString();}
        catch(DivideByZeroException){salida="ERROR: division por cero";}
    }
    static void Main()
    {
        divisor=int.Parse(Console.ReadLine());
        Thread t=new Thread(Worker);t.Start();t.Join();
        Console.WriteLine(salida);
    }
}`,
        hints: [
          "El try/catch pertenece al worker.",
          "Guarda texto en una variable.",
          "Main imprime después de Join.",
        ],
        difficulty: "medium",
        xpReward: 32,
        testCases: [
          { stdin: "4\n", expectedStdout: "25\n", visible: true },
          {
            stdin: "0\n",
            expectedStdout: "ERROR: division por cero\n",
            visible: false,
          },
          { stdin: "-5\n", expectedStdout: "-20\n", visible: false },
        ],
      },
    },
  ],
});
