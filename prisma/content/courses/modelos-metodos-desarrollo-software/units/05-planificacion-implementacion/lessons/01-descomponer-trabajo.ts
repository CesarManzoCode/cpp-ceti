import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "descomponer-trabajo",
  title: "De requisito a tareas implementables",
  description: "Dividir entregables en trabajo pequeño con condición de terminado.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `"Hacer sistema" no es una tarea. "Implementar transición ABIERTO→EN_PROCESO con casos de prueba" sí tiene frontera.

Descomponer permite estimar, detectar dependencias y revisar avance real.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Crear proyecto", right: "Demasiado amplio" },
        { left: "Definir modelo Ticket", right: "Acotada" },
        { left: "Implementar cierre con pruebas", right: "Acotada" },
        { left: "Mejorar todo", right: "No verificable" },
      ],
      explanation: "Si no sabes demostrar que terminó, aún no está bien descompuesta.",
    },
    {
      type: "quiz",
      question: "¿Cuál es mejor definición de terminado?",
      options: [
        "Ya me cansé",
        "Compila",
        "Cumple criterio, pasa pruebas y queda registrable/revisable",
        "Tiene muchas líneas",
      ],
      correctIndex: 2,
      explanation: "Terminar combina comportamiento, evidencia y estado versionado.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt: "Horas estimadas: complejidad*2 y suma 3 si hay dependencia externa.",
        starterCode: `using System;
class Program
{
    static int Horas(int c, bool externa)
    {
        return 0;
    }
    static void Main()
    {
        int c = int.Parse(Console.ReadLine());
        bool e = Console.ReadLine() == "SI";
        Console.WriteLine(Horas(c, e));
    }
}`,
        solutionCode: `using System;
class Program
{
    static int Horas(int c, bool externa)
    {
        int h = c * 2;
        if (externa) h += 3;
        return h;
    }
    static void Main()
    {
        int c = int.Parse(Console.ReadLine());
        bool e = Console.ReadLine() == "SI";
        Console.WriteLine(Horas(c, e));
    }
}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            visible: true,
            stdin: "3\nNO\n",
            expectedStdout: "6\n",
            description: "Sin dependencia",
          },
          {
            visible: false,
            stdin: "3\nSI\n",
            expectedStdout: "9\n",
            description: "Con dependencia",
          },
          {
            visible: false,
            stdin: "1\nSI\n",
            expectedStdout: "5\n",
            description: "Pequeña",
          },
        ],
      },
    },
  ],
});
