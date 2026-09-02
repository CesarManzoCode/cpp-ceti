import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "frontera-transaccional",
  title: "Elegir la frontera",
  description: "Diseñar qué cambios pertenecen a una transacción.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Caso: cerrar ticket y registrar pago deben ocurrir juntos si el negocio exige que todo cierre facturable tenga pago. La regla de negocio define la frontera.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cerrar ticket", right: "Cambio 1" },
        { left: "Registrar pago", right: "Cambio 2" },
        { left: "Invariante conjunta", right: "Misma transacción" },
        { left: "Reporte", right: "Lectura posterior" },
      ],
      explanation: "Agrupa lo inseparable.",
    },
    {
      type: "quiz",
      question: "¿Un ROLLBACK revierte un COMMIT anterior?",
      options: ["Sí", "No", "Sólo SQLite", "Sólo Mongo"],
      correctIndex: 1,
      explanation: "Un commit previo ya terminó esa transacción.",
    },
    {
      type: "fill_blank",
      template: "frontera = cambios que preservan una {{0}} conjunta",
      blanks: [{ answer: "invariante" }],
      explanation: "Diseña desde la regla.",
    },
  ],
});
