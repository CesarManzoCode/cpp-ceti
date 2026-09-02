import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "automatizacion-integrador",
  title: "Automatización y transacciones",
  description: "Incorporar al menos una capacidad avanzada útil.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `En ruta relacional, el proyecto debe usar al menos una automatización justificada (trigger/procedure/job) y una transacción donde exista una invariante real. No se aceptan features sólo decorativas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Auditoría de cambios", right: "Trigger razonable" },
        { left: "Operación reutilizable MySQL", right: "Procedure posible" },
        { left: "Tarea temporal", right: "Job/Event" },
        { left: "Cambio inseparable", right: "Transacción" },
      ],
      explanation: "Cada herramienta responde a un problema.",
    },
    {
      type: "quiz",
      question: "¿Qué vale más?",
      options: [
        "Tres triggers sin motivo",
        "Una automatización justificada y probada",
        "Mucho SQL",
        "Nombres largos",
      ],
      correctIndex: 1,
      explanation: "La evidencia debe conectar con requisito.",
    },
    {
      type: "fill_blank",
      template: "feature avanzada + requisito + {{0}}",
      blanks: [{ answer: "prueba" }],
      explanation: "Debe justificarse.",
    },
  ],
});
