import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "find-mongodb",
  title: "Consultar documentos",
  description: "Usar filtros de igualdad/comparación simples.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`find\` recibe un filtro documental. Empieza por condiciones explícitas y proyecta sólo campos necesarios cuando el reporte lo requiera.`,
    },
    {
      type: "code_example",
      code: `db.tickets.find(
  { estado: 'ABIERTO', costo: { $gte: 100 } },
  { folio: 1, costo: 1, _id: 0 }
)`,
      explanation: "Filtra y proyecta.",
      runnable: false,
      localOnlyNote: "MongoDB local.",
    },
    {
      type: "quiz",
      question: "¿Qué representa $gte?",
      options: ["igual", "mayor o igual", "menor", "borrar"],
      correctIndex: 1,
      explanation: "Operador de comparación.",
    },
    {
      type: "matching",
      pairs: [
        { left: "filtro", right: "Qué documentos" },
        { left: "proyección", right: "Qué campos" },
        { left: "$gte", right: "Comparación" },
        { left: "find", right: "Read" },
      ],
      explanation: "Consulta documental.",
    },
  ],
});
