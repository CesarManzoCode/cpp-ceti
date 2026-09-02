import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "plan-incrementos",
  title: "Planear incrementos por dependencia y valor",
  description: "Ordena capacidades para que cada entrega sea coherente.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `No todo orden de features produce entregas utilizables. Si consultar requiere que existan tickets, registrar debe llegar antes.

Un buen plan equilibra valor, dependencias, riesgo y tamaño; cada incremento tiene criterio de terminado.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena los elementos.",
      lines: [
        "Incremento 1: registrar ticket",
        "Incremento 2: consultar ticket por folio",
        "Incremento 3: asignar técnico",
        "Incremento 4: cerrar y conservar historial",
      ],
      explanation: "Cada paso usa capacidades anteriores y deja producto demostrable.",
    },
    {
      type: "quiz",
      question: "¿Qué feature conviene adelantar si es muy riesgosa técnicamente pero fundamental?",
      options: ["Siempre dejarla al final", "Considerar validarla temprano para descubrir riesgo", "Ocultarla", "Eliminar tests"],
      correctIndex: 1,
      explanation: "Los incrementos también sirven para reducir incertidumbre.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee tres valores de valor (V), riesgo (R) y esfuerzo (E). Puntaje de prioridad = V*2 + R - E. Imprime puntaje.",
        starterCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());int r=int.Parse(Console.ReadLine());int e=int.Parse(Console.ReadLine());/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());int r=int.Parse(Console.ReadLine());int e=int.Parse(Console.ReadLine());Console.WriteLine(v*2+r-e);}}`,
        difficulty: "easy",
        xpReward: 20,
        testCases: [
          { stdin: "5\n4\n2\n", expectedStdout: "12\n", visible: true, description: "Alta" },
          { stdin: "1\n1\n3\n", expectedStdout: "0\n", visible: false, description: "Baja" },
        ],
      },
    },
  ],
});
