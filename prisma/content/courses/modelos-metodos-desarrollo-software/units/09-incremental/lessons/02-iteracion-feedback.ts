import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "iteracion-feedback",
  title: "Iteración y feedback",
  description: "Usa feedback para ajustar una capacidad ya entregada.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Incremental responde **qué capacidad nueva** se añade; iterativo responde **cómo una capacidad existente se refina** al aprender. Pueden combinarse.

Ejemplo: incremento 1 registra tickets; iteración posterior mejora validación de descripción a partir de uso real.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Añadir consulta por folio", right: "Incremento" },
        { left: "Mejorar validación del registro existente", right: "Iteración" },
        { left: "Añadir cierre de ticket", right: "Incremento" },
        { left: "Refinar mensaje de error tras feedback", right: "Iteración" },
      ],
      explanation: "Incremento agrega capacidad; iteración mejora una existente.",
    },
    {
      type: "quiz",
      question: "¿Cuál ejemplo es iterativo?",
      options: ["Agregar módulo nuevo", "Refinar búsqueda existente tras feedback", "Crear repo", "Añadir nuevo actor"],
      correctIndex: 1,
      explanation: "Se aprende y mejora algo ya disponible.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Versión 1 acepta descripción >=3; versión 2 exige >=5. Lee versión y texto, imprime VALIDA/INVALIDA.",
        starterCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());string d=Console.ReadLine();/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){int v=int.Parse(Console.ReadLine());string d=Console.ReadLine();int min=v>=2?5:3;Console.WriteLine(d.Length>=min?"VALIDA":"INVALIDA");}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          { stdin: "1\nabc\n", expectedStdout: "VALIDA\n", visible: true, description: "v1" },
          { stdin: "2\nabc\n", expectedStdout: "INVALIDA\n", visible: false, description: "v2 refina" },
          { stdin: "2\nabcde\n", expectedStdout: "VALIDA\n", visible: false, description: "v2 válida" },
        ],
      },
    },
  ],
});
