import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "crud-documental-completo",
  title: "CRUD y evidencia",
  description: "Ejecutar una secuencia reproducible y verificar resultados.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El laboratorio debe partir de una colección conocida, insertar documentos, consultar, modificar, eliminar y demostrar el estado final. Capturas sin script reproducible son evidencia débil.`,
    },
    {
      type: "code_completion",
      lines: [
        "Preparar colección",
        "insertOne",
        "find",
        "updateOne",
        "deleteOne",
        "find final",
        "Guardar script/evidencia",
      ],
      explanation: "Secuencia verificable.",
    },
    {
      type: "quiz",
      question: "¿Qué evidencia es mejor?",
      options: ["Sólo captura", "Script + resultados reproducibles", "Memoria", "Nombre de DB"],
      correctIndex: 1,
      explanation: "Permite repetir la práctica.",
    },
    {
      type: "fill_blank",
      template: "script + resultados = {{0}} reproducible",
      blanks: [{ answer: "evidencia" }],
      explanation: "Cierra la práctica.",
    },
  ],
});
