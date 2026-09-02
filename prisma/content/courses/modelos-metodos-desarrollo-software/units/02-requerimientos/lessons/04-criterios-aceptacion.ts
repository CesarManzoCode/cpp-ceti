import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "criterios-aceptacion",
  title: "Criterios de aceptación",
  description:
    "Convierte expectativas en ejemplos que permiten aceptar o rechazar una entrega.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un requisito sin criterio puede discutirse para siempre. Un criterio de aceptación baja la expectativa a comportamiento observable.

Forma útil: **Dado / Cuando / Entonces**. No prescribe cómo guardar el dato; prescribe qué debe ser cierto.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena los elementos.",
      lines: [
        "Dado un ticket ABIERTO asignado a Ana",
        "Cuando Ana solicita cerrarlo",
        "Entonces el estado queda CERRADO",
        "Y se conserva Ana como responsable",
      ],
      explanation: "Contexto → acción → resultado verificable.",
    },
    {
      type: "quiz",
      question: "¿Para qué sirve principalmente un criterio de aceptación?",
      options: [
        "Elegir nombres de variables",
        "Acordar evidencia concreta de que un requisito se cumple",
        "Reemplazar todos los tests",
        "Diseñar DB",
      ],
      correctIndex: 1,
      explanation: "Es puente entre expectativa y verificación.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa tarifa por prioridad: BAJA=0, MEDIA=50, ALTA=100, CRITICA=200; otro valor imprime INVALIDA.",
        starterCode: `using System;
class Program
{
    static int Costo(string prioridad)
    {
        return -1;
    }
    static void Main()
    {
        int c = Costo(Console.ReadLine());
        Console.WriteLine(c < 0 ? "INVALIDA" : c.ToString());
    }
}`,
        solutionCode: `using System;
class Program
{
    static int Costo(string p)
    {
        if (p == "BAJA") return 0;
        if (p == "MEDIA") return 50;
        if (p == "ALTA") return 100;
        if (p == "CRITICA") return 200;
        return -1;
    }
    static void Main()
    {
        int c = Costo(Console.ReadLine());
        Console.WriteLine(c < 0 ? "INVALIDA" : c.ToString());
    }
}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            visible: true,
            stdin: "BAJA\n",
            expectedStdout: "0\n",
            description: "Baja",
          },
          {
            visible: false,
            stdin: "CRITICA\n",
            expectedStdout: "200\n",
            description: "Crítica",
          },
          {
            visible: false,
            stdin: "MEDIA\n",
            expectedStdout: "50\n",
            description: "Media",
          },
          {
            visible: false,
            stdin: "OTRA\n",
            expectedStdout: "INVALIDA\n",
            description: "Fuera del contrato",
          },
        ],
      },
    },
  ],
});
