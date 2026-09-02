import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "embeber-referenciar",
  title: "Embeber o referenciar",
  description: "Elegir según patrón de acceso y ciclo de vida.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `En un modelo documental puedes embeber datos relacionados o guardar referencias. Embeber favorece lectura conjunta y atomicidad del documento; referenciar evita duplicar entidades compartidas que cambian independientemente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Dirección única del cliente", right: "Puede embeberse" },
        { left: "Técnico compartido por miles de tickets", right: "Referencia puede ser mejor" },
        { left: "Datos que siempre se leen juntos", right: "Favorece embedding" },
        { left: "Entidad con vida propia", right: "Favorece referencia" },
      ],
      explanation: "El patrón de acceso guía la decisión.",
    },
    {
      type: "quiz",
      question: "¿Qué pregunta es clave?",
      options: [
        "Qué color tiene Mongo",
        "Cómo se leen y cambian juntos los datos",
        "Cuántas tablas había",
        "Qué IDE",
      ],
      correctIndex: 1,
      explanation: "El agregado/documento debe reflejar acceso.",
    },
    {
      type: "fill_blank",
      template: "leer/cambiar juntos → considerar {{0}}",
      blanks: [{ answer: "embedding" }],
      explanation: "Heurística, no regla absoluta.",
    },
  ],
});
