import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "minimo-privilegio",
  title: "Mínimo privilegio",
  description: "Otorgar sólo lo necesario.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una cuenta de reportes no necesita DROP TABLE. Una app CRUD no necesita privilegios administrativos. Menos permisos reducen daño potencial.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "report_reader", right: "SELECT" },
        { left: "app_writer", right: "CRUD necesario" },
        { left: "migrador", right: "DDL controlado" },
        { left: "admin", right: "Administración" },
      ],
      explanation: "Permiso sigue responsabilidad.",
    },
    {
      type: "quiz",
      question: "¿Qué cuenta debe ser especialmente limitada?",
      options: ["App pública", "DBA", "Migrador", "Todas root"],
      correctIndex: 0,
      explanation: "Es una superficie expuesta.",
    },
    {
      type: "fill_blank",
      template: "responsabilidad mínima → permisos {{0}}",
      blanks: [{ answer: "mínimos" }],
      explanation: "No empezar con ALL.",
    },
  ],
});
