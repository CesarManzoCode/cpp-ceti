import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "repositorio-evidencia",
  title: "Repositorio como evidencia del proyecto",
  description:
    "Relaciona commits con requisitos, tareas y pruebas para que el repositorio sirva como evidencia del proyecto.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un buen repositorio permite responder: ¿cuándo apareció esta regla?, ¿qué tarea la justificó?, ¿qué pruebas la acompañaron?

Para el integrador se espera historial real, no un único commit final. Trazabilidad mínima: tarea identificable, commits enfocados y evidencia de prueba.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "REQ-03 cerrar ticket", right: "Tarea implementable" },
        { left: "Commit Implementa REQ-03", right: "Evidencia de cambio" },
        { left: "Casos REQ-03", right: "Evidencia de verificación" },
        { left: "Reporte de entrega", right: "Estado de fase" },
      ],
      explanation: "La trazabilidad conecta intención y evidencia.",
    },
    {
      type: "quiz",
      question: "¿Cuál historial demuestra mejor proceso?",
      options: [
        "Un commit final enorme",
        "Commits coherentes asociados a tareas/pruebas",
        "Muchos commits x",
        "Recrear repo cada semana",
      ],
      correctIndex: 1,
      explanation: "El objetivo es reconstruir decisiones.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "requisito → tarea → {{0}} → pruebas → entrega",
      blanks: [
        {
          answer: "commit",
          hint: "Registra el cambio de manera rastreable.",
        },
      ],
      explanation: "Cadena mínima de trazabilidad práctica.",
    },
  ],
});
