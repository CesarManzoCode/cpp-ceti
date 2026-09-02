import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "abstraer-clasificar-filtrar",
  title: "Abstracción, clasificación y filtrado",
  description: "Separa datos relevantes del ruido y agrúpalos por significado.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Abstraer es conservar las propiedades relevantes para el problema. Clasificar agrupa datos con significado común. Filtrar excluye lo que no aporta al objetivo o pertenece fuera del alcance.

Guardar todo "por si acaso" aumenta coste, riesgo y confusión.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "color favorito del técnico", right: "Normalmente fuera del dominio de soporte" },
        { left: "folio del ticket", right: "Identidad operativa" },
        { left: "estado", right: "Dato necesario para flujo" },
        { left: "fecha de cierre", right: "Dato útil para seguimiento/reportes" },
      ],
      explanation: "La relevancia depende del problema.",
    },
    {
      type: "quiz",
      question: "¿Qué criterio decide si un dato entra al modelo?",
      options: [
        "Que sea fácil obtenerlo",
        "Que sea necesario para requisito, regla o consulta justificada",
        "Que sea texto",
        "Que lo tenga otro sistema",
      ],
      correctIndex: 1,
      explanation: "Cada dato debería poder justificar su existencia.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Dato relevante = responde a {{0}} o soporta una {{1}}.",
      blanks: [{ answer: "requisito" }, { answer: "regla" }],
      explanation: "Evita coleccionar campos sin propósito.",
    },
  ],
});
