import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "fases-cascada",
  title: "Fases y ciclo de vida en cascada",
  description: "Ordena las fases y explica qué evidencia produce cada una.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `En cascada las fases avanzan con dependencia fuerte: requisitos, diseño, implementación, verificación, entrega y mantenimiento.

El valor no está en dibujar flechas hacia abajo, sino en hacer explícitos los **criterios de salida**. Si requisitos termina ambiguo, el diseño hereda ambigüedad; programar más rápido sólo acelera el error.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena los elementos.",
      lines: [
        "Requisitos",
        "Diseño",
        "Implementación",
        "Verificación",
        "Entrega",
        "Mantenimiento",
      ],
      explanation:
        "Cada fase usa resultados de la anterior y deja una salida comprobable.",
    },
    {
      type: "quiz",
      question: "¿Cuál es la mejor condición para cerrar requisitos?",
      options: [
        "Ya pasaron dos semanas",
        "El equipo empezó a programar",
        "Los requisitos están revisados y tienen criterios verificables",
        "Existe un repo Git",
      ],
      correctIndex: 2,
      explanation: "Una fase se cierra por evidencia suficiente, no por calendario.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Requisitos", right: "Necesidades/restricciones acordadas" },
        { left: "Diseño", right: "Modelo de solución" },
        { left: "Implementación", right: "Producto construido" },
        { left: "Verificación", right: "Resultados de pruebas" },
        { left: "Mantenimiento", right: "Correcciones/evolución" },
      ],
      explanation: "Los entregables hacen observable el ciclo de vida.",
    },
  ],
});
