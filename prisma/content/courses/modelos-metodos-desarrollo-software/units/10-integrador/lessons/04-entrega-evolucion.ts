import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "entrega-evolucion",
  title: "Entrega, evidencia y cambio posterior",
  description: "Cierra el producto en cascada y demuestra una evolución incremental segura.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La entrega incluye sistema, reporte, requisitos, UML, maquetas, tareas/Gantt, historial Git y resultados de pruebas.

Después se introduce un cambio: **estado PAUSADO con motivo obligatorio**. El alumno debe analizar impacto, actualizar requisito/diseño, añadir pruebas y entregar como incremento posterior sin romper cierre/asignación existentes. Así la materia conecta cascada, mantenimiento, SOLID e incremental.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Primera entrega", right: "Baseline de cascada" },
        { left: "Cambio PAUSADO", right: "Solicitud de mantenimiento/evolución" },
        { left: "Actualización de requisito/UML", right: "Análisis de impacto" },
        { left: "Nuevo incremento", right: "Capacidad integrada con regresiones" },
      ],
      explanation: "El mismo producto recorre el ciclo completo.",
    },
    {
      type: "quiz",
      question: "¿Qué evidencia demuestra mejor que el cambio fue seguro?",
      options: [
        "Sólo captura nueva",
        "Nuevo criterio + tests del cambio + regresiones anteriores + commits trazables",
        "Más líneas",
        "Renombrar versión",
      ],
      correctIndex: 1,
      explanation: "Demuestra cambio y preservación del contrato anterior.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Extiende una máquina de estados: ABIERTO→EN_PROCESO; EN_PROCESO→PAUSADO/CERRADO; PAUSADO→EN_PROCESO. Cualquier otra NO. Lee estado actual y nuevo.",
        starterCode: `using System; class Program{static void Main(){string a=Console.ReadLine();string b=Console.ReadLine();/* completa */}}`,
        solutionCode: `using System; class Program{static void Main(){string a=Console.ReadLine();string b=Console.ReadLine();bool ok=(a=="ABIERTO"&&b=="EN_PROCESO")||(a=="EN_PROCESO"&&(b=="PAUSADO"||b=="CERRADO"))||(a=="PAUSADO"&&b=="EN_PROCESO");Console.WriteLine(ok?"SI":"NO");}}`,
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            stdin: "EN_PROCESO\nPAUSADO\n",
            expectedStdout: "SI\n",
            visible: true,
            description: "Nueva transición",
          },
          {
            stdin: "PAUSADO\nEN_PROCESO\n",
            expectedStdout: "SI\n",
            visible: false,
            description: "Reanudar",
          },
          {
            stdin: "ABIERTO\nCERRADO\n",
            expectedStdout: "NO\n",
            visible: false,
            description: "Regresión de regla anterior",
          },
        ],
      },
    },
  ],
});
