import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "dependencias-gantt",
  title: "Dependencias, estimación y carta Gantt",
  description: "Construir una secuencia temporal que respete dependencias.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La carta Gantt sirve si refleja tareas, duración, dependencias e hitos. No vuelve cierta una estimación; vuelve visibles sus supuestos.

Si "probar cierre" depende de "implementar cierre", programarlas como independientes oculta información.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Diseñar modelo", right: "Puede bloquear implementación" },
        { left: "Implementar cierre", right: "Bloquea pruebas de cierre" },
        { left: "Preparar datos de prueba", right: "Puede adelantarse con requisito claro" },
        { left: "Reporte final", right: "Depende de resultados" },
      ],
      explanation: "Dependencia describe qué resultado necesita otra tarea.",
    },
    {
      type: "quiz",
      question: "Una tarea estimada 2 días tarda 4. ¿Qué haces?",
      options: [
        "Ocultarlo",
        "Actualizar seguimiento y analizar impacto",
        "Cambiar historia para fingir 4 desde el inicio",
        "Eliminar tarea",
      ],
      correctIndex: 1,
      explanation: "El plan sirve para detectar desviaciones.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee duraciones A, B, C. B y C dependen de A y pueden ir en paralelo. Imprime duración mínima A+max(B,C).",
        starterCode: `using System;
class Program
{
    static void Main()
    {
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        int c = int.Parse(Console.ReadLine());
        /* completa */
    }
}`,
        solutionCode: `using System;
class Program
{
    static void Main()
    {
        int a = int.Parse(Console.ReadLine());
        int b = int.Parse(Console.ReadLine());
        int c = int.Parse(Console.ReadLine());
        Console.WriteLine(a + (b > c ? b : c));
    }
}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            visible: true,
            stdin: "2\n3\n5\n",
            expectedStdout: "7\n",
            description: "C domina",
          },
          {
            visible: false,
            stdin: "4\n1\n1\n",
            expectedStdout: "5\n",
            description: "Iguales",
          },
          {
            visible: false,
            stdin: "1\n8\n2\n",
            expectedStdout: "9\n",
            description: "B domina",
          },
        ],
      },
    },
  ],
});
