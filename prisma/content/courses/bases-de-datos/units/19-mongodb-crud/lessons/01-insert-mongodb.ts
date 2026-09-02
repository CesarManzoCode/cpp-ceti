import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "insert-mongodb",
  title: "Insertar documentos",
  description: "Leer insertOne y el documento creado.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `MongoDB usa colecciones y documentos BSON. Este bloque es laboratorio local con \`mongosh\`; no se envía al executor SQL.`,
    },
    {
      type: "code_example",
      code: `db.tickets.insertOne({
  folio: 'T-10',
  estado: 'ABIERTO',
  costo: 100
})`,
      explanation: "Inserta un documento.",
      runnable: false,
      localOnlyNote: "Requiere MongoDB + mongosh local.",
    },
    {
      type: "quiz",
      question: "¿Qué método inserta un documento?",
      options: ["find", "insertOne", "updateOne", "deleteOne"],
      correctIndex: 1,
      explanation: "CRUD Create.",
    },
    {
      type: "fill_blank",
      template: "Create → {{0}}",
      blanks: [{ answer: "insertOne" }],
      explanation: "Operación básica.",
    },
  ],
});
