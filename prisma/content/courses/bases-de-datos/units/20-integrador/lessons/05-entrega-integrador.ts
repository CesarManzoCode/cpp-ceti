import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "entrega-integrador",
  title: "Entrega y reflexión",
  description: "Reunir respaldo, aplicación, scripts y reporte reproducible.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Entrega: aplicación, respaldo, scripts relevantes y reporte digital con datos del estudiante, problema, necesidades, modelado, conexión, evidencias de queries y reflexión. La reflexión debe explicar decisiones y límites, no sólo "aprendí mucho".`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Aplicación", right: "Producto ejecutable" },
        { left: "Respaldo", right: "Recuperación" },
        { left: "Scripts", right: "Reproducibilidad" },
        { left: "Reporte", right: "Trazabilidad/evidencia" },
        { left: "Reflexión", right: "Decisiones y límites" },
      ],
      explanation: "El producto oficial es compuesto.",
    },
    {
      type: "quiz",
      question: "¿Qué falta si sólo entregas capturas?",
      options: [
        "Nada",
        "Artefactos reproducibles: app/scripts/respaldo",
        "Más colores",
        "Más tablas",
      ],
      correctIndex: 1,
      explanation: "Las capturas no reconstruyen el sistema.",
    },
    {
      type: "fill_blank",
      template: "aplicación + respaldo + scripts + {{0}}",
      blanks: [{ answer: "reporte" }],
      explanation: "Entrega completa.",
    },
  ],
});
