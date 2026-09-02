import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "requisitos-no-funcionales",
  title: "Requisitos no funcionales",
  description: "Traduce atributos de calidad abstractos a restricciones verificables.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Rendimiento, seguridad, disponibilidad, mantenibilidad y usabilidad son atributos de calidad. El error común es dejarlos como adjetivos.

"Debe ser rápido" no se puede aceptar o rechazar. "La consulta por folio responde en menos de 500 ms bajo la carga definida" sí establece una medida.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Tiempo máximo de respuesta", right: "Rendimiento" },
        { left: "Sólo técnicos pueden cerrar", right: "Seguridad" },
        { left: "Restaurar operación <4h", right: "Recuperación" },
        { left: "Aislar regla de prioridad", right: "Mantenibilidad" },
      ],
      explanation: "El atributo nombra la preocupación; el requisito fija una condición.",
    },
    {
      type: "quiz",
      question: '¿Qué mejora "el sistema debe ser seguro"?',
      options: ['Agregar "muy"', "Nombrar quién puede hacer qué y bajo qué control", "Cambiar lenguaje", "Añadir pantallas"],
      correctIndex: 1,
      explanation: "Seguridad se vuelve evaluable con permisos/amenazas/controles concretos.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa autorización: ADMIN y TECNICO pueden VER/CERRAR; EMPLEADO sólo VER; cualquier otro caso NO.",
        starterCode: `using System;
class Program
{
    static bool Permitido(string rol, string accion)
    {
        return false;
    }
    static void Main()
    {
        Console.WriteLine(Permitido(Console.ReadLine(), Console.ReadLine()) ? "SI" : "NO");
    }
}`,
        solutionCode: `using System;
class Program
{
    static bool Permitido(string rol, string accion)
    {
        if (rol == "ADMIN" || rol == "TECNICO") return accion == "VER" || accion == "CERRAR";
        if (rol == "EMPLEADO") return accion == "VER";
        return false;
    }
    static void Main()
    {
        Console.WriteLine(Permitido(Console.ReadLine(), Console.ReadLine()) ? "SI" : "NO");
    }
}`,
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            visible: true,
            stdin: "EMPLEADO\nVER\n",
            expectedStdout: "SI\n",
            description: "Permiso básico",
          },
          {
            visible: false,
            stdin: "EMPLEADO\nCERRAR\n",
            expectedStdout: "NO\n",
            description: "Acción negada",
          },
          {
            visible: false,
            stdin: "TECNICO\nCERRAR\n",
            expectedStdout: "SI\n",
            description: "Técnico autorizado",
          },
          {
            visible: false,
            stdin: "INVITADO\nVER\n",
            expectedStdout: "NO\n",
            description: "Rol desconocido",
          },
        ],
      },
    },
  ],
});
