import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "evento-accion",
  title: "Evento y acción automática",
  description: "Entender trigger como reacción del SGBD.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un trigger ejecuta lógica cuando ocurre un evento sobre datos. Es útil para auditoría e invariantes que no encajan mejor en restricciones, pero puede ocultar efectos si no se documenta.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "INSERT", right: "Evento" },
        { left: "AFTER INSERT", right: "Momento" },
        { left: "NEW", right: "Fila nueva" },
        { left: "auditoria", right: "Efecto" },
      ],
      explanation: "Un trigger tiene causa y efecto.",
    },
    {
      type: "quiz",
      question: "¿Riesgo de abusar de triggers?",
      options: [
        "No modifican nada",
        "Efectos implícitos difíciles de rastrear",
        "No existen",
        "Siempre son lentos",
      ],
      correctIndex: 1,
      explanation: "La automatización invisible complica diagnóstico.",
    },
    {
      type: "fill_blank",
      template: "evento + momento + {{0}} = trigger",
      blanks: [{ answer: "acción" }],
      explanation: "La causalidad debe ser clara.",
    },
  ],
});
