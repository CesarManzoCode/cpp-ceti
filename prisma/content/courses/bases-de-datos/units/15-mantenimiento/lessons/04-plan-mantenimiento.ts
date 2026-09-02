import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "plan-mantenimiento",
  title: "Plan de mantenimiento",
  description: "Diseñar tareas, frecuencia y evidencia.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un plan mínimo nombra qué se observa, umbral/condición, tarea, frecuencia, riesgo, respaldo y verificación. No conviertas mantenimiento en cronograma ciego.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Métrica", right: "Qué observas" },
        { left: "Umbral", right: "Cuándo actuar" },
        { left: "Acción", right: "Qué haces" },
        { left: "Verificación", right: "Cómo sabes que ayudó" },
      ],
      explanation: "El plan es falsable.",
    },
    {
      type: "quiz",
      question: "¿Cuál plan es mejor?",
      options: [
        "OPTIMIZE diario siempre",
        "Medir, actuar por criterio y verificar",
        "Nunca tocar",
        "Recrear DB",
      ],
      correctIndex: 1,
      explanation: "Evita mantenimiento sin evidencia.",
    },
    {
      type: "fill_blank",
      template: "métrica + criterio + acción + {{0}}",
      blanks: [{ answer: "verificación" }],
      explanation: "Cierra el ciclo.",
    },
  ],
});
