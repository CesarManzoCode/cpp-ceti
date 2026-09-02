import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-nosql",
  title: "Por qué existe otro modelo",
  description: "Entender qué problema intenta resolver un modelo documental.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `NoSQL no significa "sin estructura". Un modelo documental agrupa datos en documentos flexibles dentro de colecciones. Puede encajar cuando los datos se consumen juntos y su forma varía razonablemente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Relacional", right: "Tablas/relaciones" },
        { left: "Documental", right: "Documentos/colecciones" },
        { left: "flexible", right: "No significa sin reglas" },
        { left: "elección", right: "Depende de acceso y consistencia" },
      ],
      explanation: "NoSQL no reemplaza universalmente SQL.",
    },
    {
      type: "quiz",
      question: "¿Qué afirmación es falsa?",
      options: [
        "Documentos tienen estructura",
        "NoSQL siempre es mejor",
        "Colecciones agrupan documentos",
        "El modelo depende del problema",
      ],
      correctIndex: 1,
      explanation: "No existe ganador universal.",
    },
    {
      type: "fill_blank",
      template: "NoSQL documental = {{0}} dentro de colecciones",
      blanks: [{ answer: "documentos" }],
      explanation: "Unidad principal.",
    },
  ],
});
