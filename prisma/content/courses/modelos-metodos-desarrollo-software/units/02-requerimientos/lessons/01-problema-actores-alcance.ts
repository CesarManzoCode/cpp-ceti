import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "problema-actores-alcance",
  title: "Problema, actores y frontera del sistema",
  description: "Convierte una petición vaga en problema, actores y alcance explícito.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `"Necesitamos una app" no es un problema. "Las solicitudes de soporte se pierden entre mensajes y no existe trazabilidad de quién las atiende" sí describe una situación observable.

Después identifica actores y **frontera**: qué responsabilidad pertenece al sistema y qué queda fuera. El alcance protege al proyecto de una lista infinita de deseos.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Empleado", right: "Reporta una solicitud" },
        { left: "Técnico", right: "Atiende/cambia estado" },
        { left: "Administrador", right: "Gestiona catálogos/reglas acordadas" },
        { left: "Sistema", right: "Conserva solicitudes y aplica reglas" },
      ],
      explanation: "Actor es quien intercambia información con el sistema; no todo sustantivo es actor.",
    },
    {
      type: "quiz",
      question: "¿Cuál enunciado define mejor alcance?",
      options: [
        "Todo lo que el usuario pueda pedir algún día",
        "Qué responsabilidades sí pertenecen a esta entrega y cuáles no",
        "La lista de clases",
        "El número de commits",
      ],
      correctIndex: 1,
      explanation: "Alcance es una frontera acordada.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa la prioridad: servicio detenido→CRITICA; si no, >=10 afectados→ALTA; 2..9→MEDIA; 0..1→BAJA.",
        starterCode: `using System;
class Program
{
    static string Prioridad(int afectados, bool detenido)
    {
        return "";
    }
    static void Main()
    {
        int afectados = int.Parse(Console.ReadLine());
        bool detenido = Console.ReadLine() == "SI";
        Console.WriteLine(Prioridad(afectados, detenido));
    }
}`,
        solutionCode: `using System;
class Program
{
    static string Prioridad(int afectados, bool detenido)
    {
        if (detenido) return "CRITICA";
        if (afectados >= 10) return "ALTA";
        if (afectados >= 2) return "MEDIA";
        return "BAJA";
    }
    static void Main()
    {
        int afectados = int.Parse(Console.ReadLine());
        bool detenido = Console.ReadLine() == "SI";
        Console.WriteLine(Prioridad(afectados, detenido));
    }
}`,
        hints: ["Evalúa primero servicio detenido.", "Después usa los límites de afectados."],
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            visible: true,
            stdin: "25\nSI\n",
            expectedStdout: "CRITICA\n",
            description: "Servicio detenido domina",
          },
          {
            visible: false,
            stdin: "12\nNO\n",
            expectedStdout: "ALTA\n",
            description: "Muchos afectados",
          },
          {
            visible: false,
            stdin: "5\nNO\n",
            expectedStdout: "MEDIA\n",
            description: "Impacto medio",
          },
          {
            visible: false,
            stdin: "1\nNO\n",
            expectedStdout: "BAJA\n",
            description: "Impacto bajo",
          },
        ],
      },
    },
  ],
});
