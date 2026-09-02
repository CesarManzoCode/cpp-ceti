import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "integrador-entrega",
  title: "Integrador III: aplicación, respaldo y reporte",
  description: "Define la entrega completa sin fingir que el navegador reemplaza el laboratorio local.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Entrega final:

- script SQL completo;
- modelo ER y relacional normalizado;
- evidencias de queries;
- respaldo y restauración demostrada localmente;
- reporte con problema, necesidades, modelado, normalización y reflexión;
- integración local con una aplicación de escritorio que gestione la información, como pide el programa oficial.

cpp-ceti evalúa el núcleo relacional y SQL. La GUI y operación administrativa se validan como laboratorio local.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Script SQL", right: "Reproducibilidad" },
        { left: "ER/relacional", right: "Diseño" },
        { left: "Queries", right: "Evidencia de recuperación/análisis" },
        { left: "Backup+restore", right: "Recuperabilidad" },
        { left: "GUI local", right: "Integración con aplicación" },
      ],
      explanation: "El producto integrador une artefactos distintos.",
    },
    {
      type: "quiz",
      question: "¿Debe el Course ejecutar Windows Forms dentro de Wandbox SQL?",
      options: [
        "Sí",
        "No; la GUI es laboratorio local y el SQL se verifica en su runtime",
        "Sólo si usa SELECT",
        "Siempre",
      ],
      correctIndex: 1,
      explanation: "Cada runtime debe evaluar lo que realmente puede ejecutar.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Diseño + SQL + evidencias + backup/restore + {{0}} local",
      blanks: [{ answer: "aplicación" }],
      explanation: "Es el producto completo.",
    },
  ],
});
