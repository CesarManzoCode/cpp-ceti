import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "casos-fronteras",
  title: "Casos de prueba, fronteras y particiones",
  description: "Diseña pocos casos que discriminen reglas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Si una regla cambia en 60 y 80, probar 65,70,75 aporta menos que 59/60 y 79/80. Las **fronteras** concentran errores.

Las particiones agrupan inputs con comportamiento equivalente; elige representantes y fronteras.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Edad mínima 18", right: "17 y 18" },
        { left: "Máximo 5 intentos", right: "5 y 6" },
        { left: "Texto obligatorio", right: "vacío/no vacío" },
        { left: "Estado enum", right: "válido/desconocido" },
      ],
      explanation: "Diseña alrededor de cambios de comportamiento.",
    },
    {
      type: "quiz",
      question:
        "Para rango 10..20 inclusive, ¿qué conjunto discrimina mejor fronteras?",
      options: ["12,13,14", "10,15,20", "9,10,20,21", "1,100"],
      correctIndex: 2,
      explanation: "Comprueba justo fuera/dentro de ambos límites.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Descuento por cantidad: <1 INVALIDA; 1..9=0; 10..49=5; >=50=10.",
        starterCode: `using System; class Program{static void Main(){int n=int.Parse(Console.ReadLine());/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){int n=int.Parse(Console.ReadLine());if(n<1)Console.WriteLine("INVALIDA");else if(n<10)Console.WriteLine(0);else if(n<50)Console.WriteLine(5);else Console.WriteLine(10);}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            stdin: "9\n",
            expectedStdout: "0\n",
            visible: true,
            description: "9",
          },
          {
            stdin: "10\n",
            expectedStdout: "5\n",
            visible: false,
            description: "10",
          },
          {
            stdin: "49\n",
            expectedStdout: "5\n",
            visible: false,
            description: "49",
          },
          {
            stdin: "50\n",
            expectedStdout: "10\n",
            visible: false,
            description: "50",
          },
          {
            stdin: "0\n",
            expectedStdout: "INVALIDA\n",
            visible: false,
            description: "0",
          },
        ],
      },
    },
  ],
});
