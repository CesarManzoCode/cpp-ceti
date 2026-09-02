import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "modelo-incremental",
  title: "Modelo incremental: valor por partes",
  description: "Distingue una entrega incremental de dividir tareas técnicas sin valor visible.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un **incremento** añade una porción utilizable del producto. No es "hicimos la mitad de las clases"; es una capacidad coherente que puede demostrarse.

El modelo reduce el tamaño de cada compromiso y permite aprender entre entregas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Registrar ticket completo", right: "Incremento funcional" },
        { left: "Crear 7 clases vacías", right: "Trabajo técnico, no incremento de valor" },
        { left: "Consultar por folio", right: "Incremento posible" },
        { left: "Sólo cambiar nombres internos", right: "No añade valor visible por sí mismo" },
      ],
      explanation: "Incremento se define por capacidad entregable.",
    },
    {
      type: "quiz",
      question: "¿Qué caracteriza mejor un incremento?",
      options: ["Más archivos", "Porción integrada y demostrable del producto", "Una semana de trabajo", "Un branch"],
      correctIndex: 1,
      explanation: "Debe producir valor verificable.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Simula dos incrementos con función `Disponible(version, funcion)`: v1 permite REGISTRAR; v2 permite REGISTRAR y CONSULTAR; otro NO.",
        starterCode: `using System; class Program{static bool Disponible(int v,string f){return false;}static void Main(){Console.WriteLine(Disponible(int.Parse(Console.ReadLine()),Console.ReadLine())?"SI":"NO");}}`,
        solutionCode: `using System; class Program{static bool Disponible(int v,string f){if(v>=1&&f=="REGISTRAR")return true;if(v>=2&&f=="CONSULTAR")return true;return false;}static void Main(){Console.WriteLine(Disponible(int.Parse(Console.ReadLine()),Console.ReadLine())?"SI":"NO");}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          { stdin: "1\nREGISTRAR\n", expectedStdout: "SI\n", visible: true, description: "v1" },
          { stdin: "1\nCONSULTAR\n", expectedStdout: "NO\n", visible: false, description: "Aún no" },
          { stdin: "2\nCONSULTAR\n", expectedStdout: "SI\n", visible: false, description: "v2" },
        ],
      },
    },
  ],
});
