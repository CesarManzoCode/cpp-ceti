import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "cascada-vs-incremental",
  title: "Elegir modelo según evidencia",
  description: "Compara cascada e incremental sin convertir uno en caricatura.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Cascada favorece compromiso de fases completas; incremental divide la entrega en capacidades progresivas. Ambos requieren planificación, requisitos, diseño, implementación y pruebas; cambia cómo se organizan y cuándo llega feedback.

Elegir modelo es justificar supuestos, no seguir moda.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Requisitos muy estables + auditoría documental", right: "Cascada puede encajar" },
        { left: "Necesidad de validar valor temprano", right: "Incremental gana atractivo" },
        { left: "Alto riesgo desconocido", right: "Incrementos/prototipos reducen incertidumbre" },
        { left: "Contrato rígido de fase", right: "Puede favorecer cascada" },
      ],
      explanation: "No hay elección universal.",
    },
    {
      type: "quiz",
      question: "¿Qué argumento es válido para elegir incremental?",
      options: [
        "Es moderno",
        "Permite entregar/validar capacidades antes y ajustar con feedback",
        "No necesita documentación",
        "No necesita pruebas",
      ],
      correctIndex: 1,
      explanation: "La ventaja está en feedback y reducción de compromiso.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Cascada compromete más {{0}} antes de entrega; incremental reparte el compromiso en {{1}}.",
      blanks: [
        { answer: "alcance", hint: "Se diseña/implementa una porción amplia antes de feedback de producto." },
        { answer: "entregas", hint: "Cada incremento agrega capacidad integrada." },
      ],
      explanation: "Comparación sin caricaturas.",
    },
  ],
});
