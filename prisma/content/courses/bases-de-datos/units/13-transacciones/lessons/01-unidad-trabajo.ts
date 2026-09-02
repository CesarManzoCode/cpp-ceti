import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "unidad-trabajo",
  title: "Transacción como unidad de trabajo",
  description: "Agrupar cambios que deben ocurrir juntos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una transacción delimita una unidad lógica. Si transferir saldo requiere restar y sumar, ambas operaciones deben confirmarse juntas o revertirse juntas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "BEGIN", right: "Iniciar" },
        { left: "COMMIT", right: "Confirmar" },
        { left: "ROLLBACK", right: "Revertir" },
        { left: "unidad lógica", right: "Cambios inseparables" },
      ],
      explanation: "Ciclo básico.",
    },
    {
      type: "quiz",
      question: "¿Cuándo conviene?",
      options: [
        "Varias operaciones preservan una invariante juntas",
        "Sólo SELECT",
        "Sólo triggers",
        "Nunca",
      ],
      correctIndex: 0,
      explanation: "La atomicidad protege operaciones compuestas.",
    },
    {
      type: "fill_blank",
      template: "BEGIN → cambios → {{0}} o {{1}}",
      blanks: [{ answer: "COMMIT" }, { answer: "ROLLBACK" }],
      explanation: "Hay dos finales principales.",
    },
  ],
});
