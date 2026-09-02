import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "primera-forma-normal",
  title: "Primera forma normal",
  description: "Evita grupos repetidos y valores no atómicos para el modelo elegido.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Para este curso, 1FN significa que cada celda representa un valor del atributo y no hay grupos repetidos como \`telefono1, telefono2, telefono3\`.

Si un cliente puede tener muchos teléfonos, modela \`telefono_cliente\` como relación aparte en lugar de reservar columnas arbitrarias.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "telefono1,telefono2,telefono3", right: "Grupo repetido" },
        { left: "una fila por teléfono", right: "Diseño relacional más flexible" },
        { left: "lista 'A,B,C' en una celda", right: "Valor multivaluado problemático" },
      ],
      explanation: "1FN evita empaquetar colecciones dentro de una celda.",
    },
    {
      type: "quiz",
      question: "¿Qué diseño escala mejor para cantidad variable de teléfonos?",
      options: ["telefono1..telefono20", "Una tabla telefono_cliente", "Un TEXT con comas", "Copiar cliente"],
      correctIndex: 1,
      explanation: "La relación separada representa la multiplicidad.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Cliente 1:N {{0}}",
      blanks: [{ answer: "TelefonoCliente" }],
      explanation: "La repetición se transforma en filas.",
    },
  ],
});
