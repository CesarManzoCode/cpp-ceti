import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "roles-y-entregables",
  title: "Roles, responsabilidades y entregables",
  description: "Distingue responsabilidad de rol y actividad de evidencia.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Analista, desarrollador o tester son agrupaciones de responsabilidades. En un equipo pequeño una persona puede cubrir varias; lo importante es que ninguna responsabilidad quede implícita.

También distingue **actividad** de **entregable**: reunirse no es evidencia; requisitos revisados sí. Programar no es evidencia de calidad; resultados de pruebas sí.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Analizar necesidades", right: "Requisitos revisados" },
        { left: "Diseñar solución", right: "UML/maquetado" },
        { left: "Implementar", right: "Código versionado" },
        { left: "Verificar", right: "Casos/resultados de prueba" },
        { left: "Gestionar avance", right: "Lista de tareas/seguimiento" },
      ],
      explanation: "Una responsabilidad debe dejar una salida observable.",
    },
    {
      type: "quiz",
      question: "En un equipo de dos personas, ¿hacen falta cinco personas para cubrir cinco roles?",
      options: [
        "Sí",
        "No; una persona puede asumir varias responsabilidades explícitas",
        "Sólo con cascada",
        "Sólo en proyectos grandes",
      ],
      correctIndex: 1,
      explanation: "Rol describe responsabilidad, no obliga a una persona diferente.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Entrevistar usuario", right: "Requisitos acordados" },
        { left: "Revisar diseño", right: "UML corregido" },
        { left: "Ejecutar pruebas", right: "Reporte de resultados" },
        { left: "Planear cambio", right: "Tarea/cronograma actualizado" },
      ],
      explanation: "El curso evalúa evidencia, no sólo actividad.",
    },
  ],
});
