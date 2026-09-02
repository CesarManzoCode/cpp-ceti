import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "cardinalidades",
  title: "Cardinalidad uno a uno, uno a muchos y muchos a muchos",
  description: "Representa cuántas ocurrencias pueden relacionarse.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Cardinalidad expresa una regla del dominio. Un cliente puede tener muchos tickets; cada ticket pertenece a un cliente: 1:N. Un técnico puede trabajar muchos tickets y un ticket podría tener varios técnicos si el negocio lo permite: potencial N:M.

La cardinalidad no se adivina por costumbre; se pregunta.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cliente → Ticket", right: "1:N" },
        { left: "Ticket → Cliente", right: "N:1" },
        { left: "Alumno ↔ Curso", right: "N:M típico" },
        { left: "Persona ↔ Perfil único", right: "1:1 posible" },
      ],
      explanation: "Lee ambas direcciones.",
    },
    {
      type: "quiz",
      question:
        "Si cada ticket tiene exactamente un cliente y un cliente puede tener muchos tickets, ¿qué cardinalidad es?",
      options: [
        "1:1",
        "1:N de Cliente a Ticket",
        "N:M",
        "N:1 de Cliente a Ticket",
      ],
      correctIndex: 1,
      explanation: "Una ocurrencia de cliente se relaciona con muchas de ticket.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Cliente 1 —— N {{0}}",
      blanks: [{ answer: "Ticket" }],
      explanation: "La notación resume una regla del dominio.",
    },
  ],
});
