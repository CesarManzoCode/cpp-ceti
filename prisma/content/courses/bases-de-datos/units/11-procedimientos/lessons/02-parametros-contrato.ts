import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "parametros-contrato",
  title: "Parámetros y pre/postcondiciones",
  description: "Diseñar entradas y efectos antes de escribir sintaxis.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Antes de crear \`cerrar_ticket(id)\` define precondición, efecto y comportamiento si el ticket no existe. La definición del contrato importa más que memorizar delimitadores.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "IN", right: "Entrada" },
        { left: "OUT", right: "Salida" },
        { left: "INOUT", right: "Entrada/salida" },
        { left: "Precondición", right: "Debe cumplirse antes" },
        { left: "Postcondición", right: "Debe cumplirse después" },
      ],
      explanation: "Parámetros son parte de la interfaz.",
    },
    {
      type: "quiz",
      question: "¿Qué debe quedar claro primero?",
      options: ["Editor", "Qué recibe y qué cambia", "Número de líneas", "Color"],
      correctIndex: 1,
      explanation: "Un contrato verificable evita operaciones opacas.",
    },
    {
      type: "fill_blank",
      template: "precondición → CALL → {{0}}",
      blanks: [{ answer: "postcondición" }],
      explanation: "La postcondición describe el resultado.",
    },
  ],
});
