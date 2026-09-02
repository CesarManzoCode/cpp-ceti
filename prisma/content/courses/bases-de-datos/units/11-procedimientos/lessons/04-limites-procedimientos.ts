import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "limites-procedimientos",
  title: "Cuándo no usarlos",
  description: "Reconocer acoplamiento y complejidad.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La lógica propietaria dentro del SGBD reduce portabilidad y también necesita versionado, pruebas y migraciones. No conviertas cada query simple en un procedimiento.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Regla compartida por varias apps", right: "Puede justificarlo" },
        { left: "SELECT simple", right: "Normalmente no" },
        { left: "Sintaxis propietaria", right: "Reduce portabilidad" },
        { left: "Migración", right: "Debe versionarlo" },
      ],
      explanation: "Hay beneficios y costos.",
    },
    {
      type: "quiz",
      question: "¿Cuál criterio es correcto?",
      options: [
        "Todo procedimiento",
        "Nunca procedimientos",
        "Usarlos cuando el beneficio supera el acoplamiento",
        "Sólo por requisito académico",
      ],
      correctIndex: 2,
      explanation: "Es una decisión de diseño.",
    },
    {
      type: "fill_blank",
      template: "beneficio > costo de {{0}}",
      blanks: [{ answer: "acoplamiento" }],
      explanation: "Evalúa el trade-off.",
    },
  ],
});
