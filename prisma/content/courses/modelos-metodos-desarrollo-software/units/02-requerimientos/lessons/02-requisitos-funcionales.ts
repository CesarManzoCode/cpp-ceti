import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "requisitos-funcionales",
  title: "Requisitos funcionales",
  description:
    "Escribe comportamiento observable sin mezclar decisiones accidentales de diseño.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un requisito funcional describe una capacidad observable. "Usar \`Dictionary\`" normalmente es diseño; "consultar un ticket por folio" es comportamiento.

Evita "intuitivo", "moderno" o "fácil" si no tienen criterio concreto.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cerrar ticket abierto", right: "Funcional" },
        { left: "Responder en <500 ms", right: "No funcional" },
        { left: "Usar una clase Ticket", right: "Diseño" },
        { left: "Conservar historial de estado", right: "Funcional" },
      ],
      explanation: "Funcional describe capacidad; diseño describe cómo construirla.",
    },
    {
      type: "quiz",
      question: "¿Cuál requisito es más verificable?",
      options: [
        "El sistema será amigable",
        "Permitirá cerrar tickets",
        "Al cerrar registra fecha y técnico responsable",
        "La interfaz será bonita",
      ],
      correctIndex: 2,
      explanation: "Especifica evento y evidencia observable.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `PuedeCerrar(estado, tecnico)`: sólo ABIERTO o EN_PROCESO y técnico no vacío.",
        starterCode: `using System;
class Program
{
    static bool PuedeCerrar(string estado, string tecnico)
    {
        return false;
    }
    static void Main()
    {
        Console.WriteLine(PuedeCerrar(Console.ReadLine(), Console.ReadLine()) ? "SI" : "NO");
    }
}`,
        solutionCode: `using System;
class Program
{
    static bool PuedeCerrar(string estado, string tecnico)
    {
        bool estadoValido = estado == "ABIERTO" || estado == "EN_PROCESO";
        return estadoValido && tecnico.Length > 0;
    }
    static void Main()
    {
        Console.WriteLine(PuedeCerrar(Console.ReadLine(), Console.ReadLine()) ? "SI" : "NO");
    }
}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            visible: true,
            stdin: "ABIERTO\nAna\n",
            expectedStdout: "SI\n",
            description: "Abierto asignado",
          },
          {
            visible: false,
            stdin: "EN_PROCESO\nLuis\n",
            expectedStdout: "SI\n",
            description: "En proceso asignado",
          },
          {
            visible: false,
            stdin: "CERRADO\nAna\n",
            expectedStdout: "NO\n",
            description: "Cerrado",
          },
          {
            visible: false,
            stdin: "ABIERTO\n\n",
            expectedStdout: "NO\n",
            description: "Sin técnico",
          },
        ],
      },
    },
  ],
});
