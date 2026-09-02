import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "seguimiento-desviaciones",
  title: "Seguimiento y desviaciones",
  description: "Usar datos de avance para replanear sin maquillar estado.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Seguimiento no es preguntar "¿cómo vamos?". Necesitas tareas previstas, completadas, bloqueadas y evidencia.

Reportar "80%" sin criterio suele ser ruido. Es mejor saber qué entregables están terminados y qué bloqueo impide avanzar.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Terminada", right: "Cumple definición de terminado" },
        { left: "Bloqueada", right: "Depende de impedimento no resuelto" },
        { left: "En curso", right: "Tiene trabajo pendiente identificable" },
        { left: "No iniciada", right: "Sin evidencia de ejecución" },
      ],
      explanation: "Los estados deben significar algo observable.",
    },
    {
      type: "quiz",
      question: "¿Qué dato permite mejor decisión?",
      options: [
        "Se siente casi listo",
        "7/10 verificadas, 2 bloqueadas, 1 no iniciada",
        "Trabajamos mucho",
        "Hay muchos commits",
      ],
      correctIndex: 1,
      explanation: "Permite actuar sobre entregables/bloqueos.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt: "Lee total y completadas. Imprime porcentaje entero truncado; si total=0 imprime 0.",
        starterCode: `using System;
class Program
{
    static void Main()
    {
        int total = int.Parse(Console.ReadLine());
        int hechas = int.Parse(Console.ReadLine());
        /* completa */
    }
}`,
        solutionCode: `using System;
class Program
{
    static void Main()
    {
        int total = int.Parse(Console.ReadLine());
        int hechas = int.Parse(Console.ReadLine());
        Console.WriteLine(total == 0 ? 0 : hechas * 100 / total);
    }
}`,
        difficulty: "easy",
        xpReward: 20,
        testCases: [
          {
            visible: true,
            stdin: "10\n7\n",
            expectedStdout: "70\n",
            description: "Normal",
          },
          {
            visible: false,
            stdin: "3\n1\n",
            expectedStdout: "33\n",
            description: "Truncado",
          },
          {
            visible: false,
            stdin: "0\n0\n",
            expectedStdout: "0\n",
            description: "Sin división por cero",
          },
        ],
      },
    },
  ],
});
