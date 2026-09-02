import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-mantener",
  title: "Por qué mantener",
  description: "Relacionar crecimiento/cambios con mantenimiento del SGBD.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Inserciones, updates y deletes cambian estructuras físicas. Según el motor pueden requerirse estadísticas, limpieza o reorganización. Mantenimiento debe responder a medición, no superstición.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "crecimiento", right: "Más espacio" },
        { left: "borrados", right: "Espacio reutilizable/fragmentación según motor" },
        { left: "estadísticas", right: "Ayudan al optimizador" },
        { left: "mantenimiento", right: "Responde a evidencia" },
      ],
      explanation: "No hay comando universal.",
    },
    {
      type: "quiz",
      question: "¿Antes de una operación destructiva?",
      options: ["Nada", "Backup/plan y medición", "DROP", "Cambiar lenguaje"],
      correctIndex: 1,
      explanation: "Necesitas reversibilidad.",
    },
    {
      type: "fill_blank",
      template: "medir → decidir → respaldar → {{0}} → verificar",
      blanks: [{ answer: "mantener" }],
      explanation: "Proceso controlado.",
    },
  ],
});
