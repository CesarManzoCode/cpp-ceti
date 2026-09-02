import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "jobs",
  title: "Jobs y Event Scheduler",
  description: "Separar automatización por tiempo de automatización por evento.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un trigger responde a un cambio de datos; un job responde a calendario/tiempo. MySQL concreta jobs con Event Scheduler. SQLite no tiene un scheduler interno equivalente.`,
    },
    {
      type: "code_example",
      code: `CREATE EVENT limpiar_sesiones
ON SCHEDULE EVERY 1 DAY
DO DELETE FROM sesion WHERE expira_en < NOW();`,
      explanation: "Ejemplo MySQL de trabajo periódico.",
      runnable: false,
      localOnlyNote: "Requiere MySQL Event Scheduler local.",
    },
    {
      type: "quiz",
      question: "¿Diferencia principal?",
      options: [
        "Trigger usa tiempo",
        "Trigger responde a datos; job a calendario",
        "Son iguales",
        "Job siempre DELETE",
      ],
      correctIndex: 1,
      explanation: "El disparador causal es distinto.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Trigger", right: "Evento de datos" },
        { left: "Event/Job", right: "Tiempo" },
        { left: "Procedure", right: "Operación invocable" },
        { left: "Scheduler", right: "Planifica" },
      ],
      explanation: "Mecanismos relacionados, no equivalentes.",
    },
  ],
});
