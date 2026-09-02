import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "automatizacion-segura",
  title: "Automatización observable y repetible",
  description: "Limitar alcance y registrar efectos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una automatización debe limitar su alcance, registrar qué hizo y tolerar re-ejecuciones cuando sea razonable. Una tarea periódica amplifica cualquier error.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "WHERE preciso", right: "Alcance" },
        { left: "log", right: "Observabilidad" },
        { left: "re-ejecución segura", right: "Idempotencia" },
        { left: "backup", right: "Mitigación" },
      ],
      explanation: "Automatizar no elimina responsabilidad.",
    },
    {
      type: "quiz",
      question: "¿Qué es peor?",
      options: [
        "Registrar",
        "Job destructivo sin WHERE ni auditoría",
        "Probar primero",
        "Hacerlo repetible",
      ],
      correctIndex: 1,
      explanation: "El error se repetiría automáticamente.",
    },
    {
      type: "fill_blank",
      template: "automatización segura = alcance + observabilidad + {{0}}",
      blanks: [{ answer: "repetibilidad" }],
      explanation: "Debe poder auditarse.",
    },
  ],
});
