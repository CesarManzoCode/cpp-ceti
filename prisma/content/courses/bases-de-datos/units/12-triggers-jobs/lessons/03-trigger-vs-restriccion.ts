import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "trigger-vs-restriccion",
  title: "Trigger o restricción",
  description: "Preferir reglas declarativas simples.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Antes de usar trigger, pregunta si \`CHECK\`, \`UNIQUE\`, \`NOT NULL\` o FK expresan mejor la regla. Usa trigger cuando la reacción realmente requiere lógica adicional.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "costo>=0", right: "CHECK" },
        { left: "folio único", right: "UNIQUE" },
        { left: "cliente existente", right: "FK" },
        { left: "auditar cambios", right: "Trigger" },
      ],
      explanation: "Prefiere la herramienta más declarativa.",
    },
    {
      type: "quiz",
      question: "¿Qué usar primero para costo no negativo?",
      options: ["Trigger", "CHECK", "Job", "Procedure"],
      correctIndex: 1,
      explanation: "CHECK es directo.",
    },
    {
      type: "fill_blank",
      template: "regla simple → {{0}} antes que trigger",
      blanks: [{ answer: "restricción" }],
      explanation: "Reduce lógica oculta.",
    },
  ],
});
