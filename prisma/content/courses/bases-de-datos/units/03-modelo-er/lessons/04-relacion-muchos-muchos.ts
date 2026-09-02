import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "relacion-muchos-muchos",
  title: "Resolver relaciones N:M conceptualmente",
  description: "Reconoce cuándo la relación necesita atributos propios.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una relación N:M suele transformarse después en una tabla asociativa. Antes de pensar en SQL, observa si la relación tiene datos propios.

Si varios técnicos atienden varios tickets y necesitamos \`horas_trabajadas\`, ese dato pertenece a la **asignación**, no al técnico ni al ticket por separado.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Tecnico", right: "Entidad" },
        { left: "Ticket", right: "Entidad" },
        { left: "Asignacion", right: "Relación/entidad asociativa" },
        { left: "horas_trabajadas", right: "Atributo de Asignacion" },
      ],
      explanation: "Los atributos de la relación revelan la entidad asociativa.",
    },
    {
      type: "quiz",
      question: "¿Dónde guardar `horas_trabajadas` si depende de técnico + ticket?",
      options: ["Tecnico", "Ticket", "Asignacion técnico-ticket", "Cliente"],
      correctIndex: 2,
      explanation: "El valor existe para el par.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "N:M + datos propios → {{0}} asociativa",
      blanks: [{ answer: "entidad" }],
      explanation: "Luego se convierte en tabla con FKs.",
    },
  ],
});
