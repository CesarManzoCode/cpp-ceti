import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "acid",
  title: "ACID con escenarios",
  description: "Relacionar cada propiedad con un riesgo.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Atomicidad = todo/nada; Consistencia = invariantes válidas; Aislamiento = interacción concurrente controlada; Durabilidad = cambios confirmados persisten según garantías del SGBD.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Atomicidad", right: "No media transferencia" },
        { left: "Consistencia", right: "Reglas válidas" },
        { left: "Aislamiento", right: "Concurrencia controlada" },
        { left: "Durabilidad", right: "Commit persistente" },
      ],
      explanation: "No memorices letras sin escenario.",
    },
    {
      type: "quiz",
      question: "Si se resta y falla antes de sumar, ¿qué propiedad importa?",
      options: ["Durabilidad", "Atomicidad", "Proyección", "Normalización"],
      correctIndex: 1,
      explanation: "Todo o nada.",
    },
    {
      type: "fill_blank",
      template: "A C I D = Atomicidad, Consistencia, {{0}}, Durabilidad",
      blanks: [{ answer: "Aislamiento" }],
      explanation: "Propiedades coordinadas.",
    },
  ],
});
