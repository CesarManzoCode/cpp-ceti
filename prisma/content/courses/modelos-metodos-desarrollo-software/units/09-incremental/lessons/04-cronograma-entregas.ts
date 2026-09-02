import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "cronograma-entregas",
  title: "Cronograma de entregas graduales",
  description: "Transforma el plan incremental en hitos verificables.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El cronograma incremental no sólo pone fechas: asocia cada entrega con alcance concreto y criterio de aceptación.

Si una entrega se retrasa, puedes mover capacidad posterior, reducir alcance o resolver dependencia; lo importante es conservar visibilidad.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Fecha", right: "Cuándo se espera demostrar" },
        { left: "Alcance", right: "Qué capacidades incluye" },
        { left: "Criterio", right: "Cómo se acepta" },
        { left: "Dependencia", right: "Qué debe existir antes" },
      ],
      explanation: "Una fecha sin alcance no define entrega.",
    },
    {
      type: "quiz",
      question: "¿Qué hace verificable un hito?",
      options: ["Nombre bonito", "Fecha + alcance + criterio de aceptación", "Más personas", "Más commits"],
      correctIndex: 1,
      explanation: "Permite decidir si llegó o no.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee día inicial y duraciones de 3 incrementos. Imprime día de fin acumulado de cada uno, una línea por incremento.",
        starterCode: `using System; class Program{static void Main(){int d=int.Parse(Console.ReadLine());int a=int.Parse(Console.ReadLine());int b=int.Parse(Console.ReadLine());int c=int.Parse(Console.ReadLine());/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){int d=int.Parse(Console.ReadLine());int a=int.Parse(Console.ReadLine());int b=int.Parse(Console.ReadLine());int c=int.Parse(Console.ReadLine());d+=a;Console.WriteLine(d);d+=b;Console.WriteLine(d);d+=c;Console.WriteLine(d);}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          { stdin: "1\n2\n3\n4\n", expectedStdout: "3\n6\n10\n", visible: true, description: "Acumulado" },
          { stdin: "10\n1\n1\n1\n", expectedStdout: "11\n12\n13\n", visible: false, description: "Otro inicio" },
        ],
      },
    },
  ],
});
