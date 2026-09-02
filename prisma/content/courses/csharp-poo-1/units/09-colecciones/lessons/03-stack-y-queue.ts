import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "stack-y-queue",
  title: "Pila y cola: el orden también es una regla",
  description:
    "Distingue LIFO y FIFO y usa la estructura cuya política de salida coincide con el problema.",
  estimatedMinutes: 14,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# No todas las secuencias deben salir por el mismo lado

Una \`List<T>\` te deja acceder por índice. A veces eso es demasiado poder: el problema ya define qué elemento debe salir primero.

- **Pila (\`Stack<T>\`)**: último en entrar, primero en salir (**LIFO**). Ejemplos: deshacer acciones, regresar por un historial, evaluar expresiones.
- **Cola (\`Queue<T>\`)**: primero en entrar, primero en salir (**FIFO**). Ejemplos: turnos, trabajos pendientes, solicitudes.

Las operaciones hacen explícita la regla:

- pila: \`Push\`, \`Pop\`, \`Peek\`;
- cola: \`Enqueue\`, \`Dequeue\`, \`Peek\`.

Elegir la estructura correcta hace que el código explique el comportamiento del sistema.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Stack<string> historial = new Stack<string>();
        historial.Push("abrir");
        historial.Push("editar");
        historial.Push("guardar");
        Console.WriteLine("Deshacer: " + historial.Pop());

        Queue<string> turnos = new Queue<string>();
        turnos.Enqueue("Ana");
        turnos.Enqueue("Luis");
        Console.WriteLine("Atender: " + turnos.Dequeue());
    }
}`,
      explanation:
        "la pila devuelve `guardar`, que fue lo último agregado. La cola devuelve `Ana`, que llegó primero.",
      runnable: true,
      expectedOutput: `Deshacer: guardar
Atender: Ana`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Historial de “deshacer”", right: "Stack<T> / LIFO" },
        { left: "Fila de atención", right: "Queue<T> / FIFO" },
        { left: "Agregar a pila", right: "Push" },
        { left: "Agregar a cola", right: "Enqueue" },
        { left: "Consultar sin retirar", right: "Peek" },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n` nombres y colócalos en una `Queue<string>` en el orden en que llegan. Después atiende toda la cola: imprime un nombre por línea usando `Dequeue` hasta que quede vacía.",
        starterCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Queue<string> turnos = new Queue<string>();

        // encolar

        // atender
    }
}`,
        solutionCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Queue<string> turnos = new Queue<string>();

        for (int i = 0; i < n; i++)
        {
            turnos.Enqueue(Console.ReadLine());
        }

        while (turnos.Count > 0)
        {
            Console.WriteLine(turnos.Dequeue());
        }
    }
}`,
        hints: [
          "`Enqueue` agrega al final de la fila.",
          "`Count > 0` indica que todavía hay alguien esperando.",
          "`Dequeue` devuelve y elimina al primero.",
        ],
        difficulty: "easy",
        xpReward: 24,
        testCases: [
          {
            visible: true,
            stdin: "3\nAna\nLuis\nMara\n",
            expectedStdout: "Ana\nLuis\nMara\n",
          },
          {
            visible: false,
            stdin: "1\nSolo\n",
            expectedStdout: "Solo\n",
          },
          {
            visible: false,
            stdin: "4\nA\nB\nC\nD\n",
            expectedStdout: "A\nB\nC\nD\n",
          },
        ],
      },
    },
  ],
});
