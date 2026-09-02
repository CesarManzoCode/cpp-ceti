import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "tipos-mantenimiento",
  title: "Tipos de mantenimiento",
  description: "Clasificar correctivo, adaptativo, perfectivo y preventivo por intención.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Mantenimiento empieza después de una entrega, pero no significa sólo "arreglar bugs".

- **Correctivo:** corrige defecto.
- **Adaptativo:** responde a cambio externo.
- **Perfectivo:** mejora capacidad/uso/rendimiento.
- **Preventivo:** reduce riesgo o deuda antes de fallo observable.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Corrige cálculo erróneo", right: "Correctivo" },
        { left: "Nueva versión obligatoria del SO/API", right: "Adaptativo" },
        { left: "Añade filtro solicitado", right: "Perfectivo" },
        { left: "Refactor para eliminar duplicación riesgosa", right: "Preventivo" },
      ],
      explanation: "Clasifica por motivo principal del cambio.",
    },
    {
      type: "quiz",
      question:
        "¿Qué mantenimiento es cambiar un formato de integración porque el proveedor dejó de aceptar el anterior?",
      options: ["Correctivo", "Adaptativo", "Perfectivo", "Ninguno"],
      correctIndex: 1,
      explanation: "El entorno externo cambió.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Clasifica código C/A/P/R: C→CORRECTIVO, A→ADAPTATIVO, P→PERFECTIVO, R→PREVENTIVO; otro INVALIDO.",
        starterCode: `using System; class Program{static void Main(){string x=Console.ReadLine();/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){string x=Console.ReadLine();if(x=="C")Console.WriteLine("CORRECTIVO");else if(x=="A")Console.WriteLine("ADAPTATIVO");else if(x=="P")Console.WriteLine("PERFECTIVO");else if(x=="R")Console.WriteLine("PREVENTIVO");else Console.WriteLine("INVALIDO");}}`,
        difficulty: "easy",
        xpReward: 20,
        testCases: [
          {
            stdin: "C\n",
            expectedStdout: "CORRECTIVO\n",
            visible: true,
            description: "Correctivo",
          },
          {
            stdin: "R\n",
            expectedStdout: "PREVENTIVO\n",
            visible: false,
            description: "Preventivo",
          },
          {
            stdin: "X\n",
            expectedStdout: "INVALIDO\n",
            visible: false,
            description: "Inválido",
          },
        ],
      },
    },
  ],
});
