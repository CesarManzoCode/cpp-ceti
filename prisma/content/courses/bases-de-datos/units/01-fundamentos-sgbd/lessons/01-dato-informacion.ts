import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "dato-informacion",
  title: "Dato, información y necesidad",
  description: "Distingue dato almacenado de información útil para una decisión.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un **dato** es una representación registrada: \`13\`, \`CERRADO\`, \`2026-09-02\`. Se vuelve información cuando se interpreta dentro de un contexto para responder una pregunta.

Una base de datos no es valiosa por guardar mucho, sino por conservar datos con estructura suficiente para recuperarlos, relacionarlos y producir información confiable.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "13", right: "Dato sin contexto" },
        { left: "13 tickets abiertos", right: "Información contextualizada" },
        { left: "¿Qué técnico tiene más carga?", right: "Necesidad de información" },
        { left: "Conteo por técnico", right: "Resultado que ayuda a decidir" },
      ],
      explanation: "La pregunta de negocio determina qué datos hay que conservar.",
    },
    {
      type: "quiz",
      question: "¿Cuál es la mejor razón para usar una base de datos?",
      options: [
        "Guardar cualquier cosa",
        "Conservar y consultar datos relacionados de forma controlada",
        "Evitar modelar",
        "Sustituir la aplicación",
      ],
      correctIndex: 1,
      explanation: "El SGBD ayuda a organizar, proteger y consultar información.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "datos + {{0}} + contexto → {{1}}",
      blanks: [
        { answer: "estructura" },
        { answer: "información" },
      ],
      explanation: "La estructura permite interpretar y relacionar datos.",
    },
  ],
});
