import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "fragmentacion",
  title: "Concepto de fragmentación",
  description: "Entender que la definición física depende del SGBD.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Fragmentación puede referirse a espacio no aprovechado u organización interna. Los datos pueden seguir lógicamente correctos. El diagnóstico y la corrección dependen del motor.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Integridad", right: "Corrección lógica" },
        { left: "Fragmentación", right: "Organización física" },
        { left: "Síntoma", right: "Espacio/rendimiento" },
        { left: "Acción", right: "Específica del motor" },
      ],
      explanation: "No confundir conceptos.",
    },
    {
      type: "quiz",
      question: "¿Fragmentación implica corrupción?",
      options: ["Sí", "No", "Sólo Mongo", "Sólo triggers"],
      correctIndex: 1,
      explanation: "Puede ser un problema físico sin pérdida lógica.",
    },
    {
      type: "fill_blank",
      template: "fragmentación = problema de organización {{0}}",
      blanks: [{ answer: "física" }],
      explanation: "No necesariamente integridad.",
    },
  ],
});
