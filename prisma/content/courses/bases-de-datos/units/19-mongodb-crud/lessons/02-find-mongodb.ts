import { defineLesson } from "../../../../../authoring";
import { MONGODB_LOCAL_LAB_GUIDE } from "../../../shared/local-lab-guides";

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
      type: "theory",
      markdown: MONGODB_LOCAL_LAB_GUIDE,
    },
    {
      type: "code_example",
      code: `db.tickets.find(
  { estado: 'ABIERTO', costo: { $gte: 100 } },
  { folio: 1, costo: 1, _id: 0 }
)`,
      explanation: "Filtra y proyecta. Inserta primero un par de documentos de prueba en `tickets` (como en la lección anterior) para tener algo que consultar.",
      runnable: false,
      localOnlyNote: "Requiere MongoDB local — ver el paso anterior para levantar el motor y correrlo.",
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
