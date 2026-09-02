import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "informes",
  title: "Informes que responden decisiones",
  description: "Convertir consultas en salidas útiles de la aplicación.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un informe no es "mostrar toda la tabla". Define una pregunta, columnas, agregados, filtros y orden. La UI puede presentar el resultado en tabla/gráfica, pero el SQL debe producir información correcta.`,
    },
    {
      type: "code_completion",
      lines: [
        "Definir pregunta",
        "Diseñar query",
        "Probar con datos variados",
        "Presentar resultado",
        "Verificar interpretación",
      ],
      explanation: "Primero la pregunta, luego la pantalla.",
    },
    {
      type: "quiz",
      question: "¿Cuál es mejor reporte?",
      options: [
        "SELECT *",
        "Tickets abiertos por técnico con conteo y orden",
        "Todos los campos siempre",
        "Captura manual",
      ],
      correctIndex: 1,
      explanation: "Responde una necesidad.",
    },
    {
      type: "fill_blank",
      template: "pregunta → query → {{0}} → decisión",
      blanks: [{ answer: "informe" }],
      explanation: "La presentación tiene propósito.",
    },
  ],
});
