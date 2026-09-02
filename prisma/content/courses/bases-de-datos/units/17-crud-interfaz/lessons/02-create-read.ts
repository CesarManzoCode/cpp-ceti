import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "create-read",
  title: "Create y Read",
  description: "Diseñar alta/consulta con parámetros y validación.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `CREATE valida datos, usa INSERT parametrizado y confirma resultado. READ recupera sólo columnas necesarias y maneja "no encontrado" explícitamente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Create", right: "INSERT" },
        { left: "Read", right: "SELECT" },
        { left: "input usuario", right: "Parámetro" },
        { left: "no encontrado", right: "Estado esperado, no crash" },
      ],
      explanation: "CRUD mapea a operaciones concretas.",
    },
    {
      type: "quiz",
      question: "¿Qué evita hardcodear salida?",
      options: ["Query con parámetros/fixtures", "SELECT fijo sin datos", "Captura", "Comentario"],
      correctIndex: 0,
      explanation: "Los tests deben variar datos.",
    },
    {
      type: "fill_blank",
      template: "Create={{0}}, Read={{1}}",
      blanks: [{ answer: "INSERT" }, { answer: "SELECT" }],
      explanation: "Operaciones básicas.",
    },
  ],
});
