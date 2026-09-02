import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "plan-mejora",
  title: "Plan de mejora y actualización",
  description: "Priorizar mantenimiento por impacto, riesgo, esfuerzo y evidencia.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un plan de mejora no es una lista de deseos. Cada propuesta necesita problema/evidencia, impacto esperado, esfuerzo aproximado, riesgo y criterio de aceptación.

Priorizar significa aceptar que no todo cabe a la vez.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Fallo que bloquea operación", right: "Prioridad alta" },
        { left: "Mejora estética sin impacto medido", right: "Menor prioridad" },
        { left: "Dependencia sin soporte próximo", right: "Riesgo preventivo relevante" },
        { left: "Duplicación que causa defectos repetidos", right: "Mejora preventiva respaldada" },
      ],
      explanation: "Prioridad se justifica con evidencia y riesgo.",
    },
    {
      type: "quiz",
      question: "¿Qué elemento vuelve accionable una mejora?",
      options: [
        "“Hacerlo mejor”",
        "Problema concreto + criterio de aceptación + prioridad",
        "Más reuniones",
        "Nombre creativo",
      ],
      correctIndex: 1,
      explanation: "Permite decidir y verificar.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt: "Puntaje de prioridad = impacto*3 + riesgo*2 - esfuerzo. Lee tres enteros e imprime puntaje.",
        starterCode: `using System; class Program{static void Main(){int i=int.Parse(Console.ReadLine());int r=int.Parse(Console.ReadLine());int e=int.Parse(Console.ReadLine());/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){int i=int.Parse(Console.ReadLine());int r=int.Parse(Console.ReadLine());int e=int.Parse(Console.ReadLine());Console.WriteLine(i*3+r*2-e);}}`,
        difficulty: "easy",
        xpReward: 20,
        testCases: [
          {
            stdin: "5\n4\n3\n",
            expectedStdout: "20\n",
            visible: true,
            description: "Alta",
          },
          {
            stdin: "1\n1\n5\n",
            expectedStdout: "0\n",
            visible: false,
            description: "Baja",
          },
        ],
      },
    },
  ],
});
