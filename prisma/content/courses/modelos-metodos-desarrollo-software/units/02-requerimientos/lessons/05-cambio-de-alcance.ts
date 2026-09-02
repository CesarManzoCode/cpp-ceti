import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "cambio-de-alcance",
  title: "Cambios e impacto",
  description: "Evalúa una solicitud de cambio antes de aceptarla.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Cambiar no es fallar; cambiar sin analizar sí. Una solicitud nueva puede ser válida y aun no pertenecer a la entrega actual.

Antes de aceptarla se analiza impacto en requisitos, diseño, pruebas, trabajo pendiente y riesgo. En cascada es especialmente importante porque una decisión tardía atraviesa fases ya cerradas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Nuevo estado PAUSADO", right: "Requisitos + lógica + pruebas + documentación" },
        { left: "Cambiar texto de ayuda", right: "UI/documentación, bajo impacto" },
        { left: "Cambiar quién puede cerrar", right: "Seguridad + requisitos + pruebas" },
        { left: "Nuevo reporte", right: "Alcance + diseño + implementación + pruebas" },
      ],
      explanation: "El impacto sigue las dependencias del cambio.",
    },
    {
      type: "quiz",
      question:
        "El cliente pide una función nueva a dos días de entrega. ¿Qué acción es profesional?",
      options: [
        "Aceptarla sin registrar",
        "Rechazar todo cambio",
        "Registrar, analizar impacto y decidir alcance/fecha",
        "Ocultarla en un commit",
      ],
      correctIndex: 2,
      explanation: "El control de cambios vuelve explícito coste y decisión.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Costo base=100; ALTA/CRITICA suma 50. Nuevo requisito: convenio aplica 20% de descuento al total final. Lee prioridad y SI/NO.",
        starterCode: `using System;
class Program
{
    static int Total(string prioridad, bool convenio)
    {
        int total = 100;
        return total;
    }
    static void Main()
    {
        string p = Console.ReadLine();
        bool convenio = Console.ReadLine() == "SI";
        Console.WriteLine(Total(p, convenio));
    }
}`,
        solutionCode: `using System;
class Program
{
    static int Total(string prioridad, bool convenio)
    {
        int total = 100;
        if (prioridad == "ALTA" || prioridad == "CRITICA") total += 50;
        if (convenio) total = total * 80 / 100;
        return total;
    }
    static void Main()
    {
        string p = Console.ReadLine();
        bool convenio = Console.ReadLine() == "SI";
        Console.WriteLine(Total(p, convenio));
    }
}`,
        difficulty: "medium",
        xpReward: 35,
        testCases: [
          {
            visible: true,
            stdin: "BAJA\nNO\n",
            expectedStdout: "100\n",
            description: "Regla anterior",
          },
          {
            visible: false,
            stdin: "ALTA\nNO\n",
            expectedStdout: "150\n",
            description: "Recargo",
          },
          {
            visible: false,
            stdin: "ALTA\nSI\n",
            expectedStdout: "120\n",
            description: "Cambio aplicado",
          },
          {
            visible: false,
            stdin: "BAJA\nSI\n",
            expectedStdout: "80\n",
            description: "Descuento",
          },
        ],
      },
    },
  ],
});
