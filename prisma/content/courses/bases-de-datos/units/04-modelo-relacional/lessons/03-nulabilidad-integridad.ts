import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "nulabilidad-integridad",
  title: "Nulos e integridad",
  description: "Decide obligatoriedad según reglas del dominio.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`NOT NULL\` debe responder a una regla real. Si todo ticket debe pertenecer a un cliente, \`cliente_id\` es obligatorio. Si el técnico puede asignarse más tarde, una relación directa \`tecnico_id\` podría ser nullable.

No uses NULL como valor mágico para "cualquier cosa"; representa ausencia/desconocimiento según el modelo.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "cliente_id en Ticket", right: "NOT NULL si todo ticket tiene cliente" },
        { left: "fecha_cierre", right: "Puede ser NULL mientras esté abierto" },
        { left: "nombre_cliente", right: "NOT NULL si es obligatorio" },
        { left: "costo_final", right: "Puede ser NULL hasta terminar servicio" },
      ],
      explanation: "La nulabilidad expresa estado permitido.",
    },
    {
      type: "quiz",
      question: "¿Qué representa mejor `fecha_cierre NULL` en un ticket abierto?",
      options: ["Cero", "No existe fecha de cierre todavía", "Error de SQL", "Cadena vacía"],
      correctIndex: 1,
      explanation: "NULL representa ausencia del valor.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Atributo obligatorio → {{0}}",
      blanks: [{ answer: "NOT NULL" }],
      explanation: "La restricción debe reflejar el requerimiento.",
    },
  ],
});
