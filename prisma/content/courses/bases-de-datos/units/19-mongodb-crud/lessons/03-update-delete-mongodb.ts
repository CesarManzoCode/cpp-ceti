import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "update-delete-mongodb",
  title: "Modificar y eliminar",
  description: "Aplicar filtros precisos en updateOne/deleteOne.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`updateOne\` modifica un documento que cumpla el filtro; \`$set\` cambia campos. \`deleteOne\` elimina un documento coincidente. Igual que en SQL, un filtro pobre puede cambiar el registro equivocado.`,
    },
    {
      type: "code_example",
      code: `db.tickets.updateOne(
  { folio: 'T-10' },
  { $set: { estado: 'CERRADO' } }
);

db.tickets.deleteOne({ folio: 'T-99' });`,
      explanation: "Update/Delete con filtro.",
      runnable: false,
      localOnlyNote: "MongoDB local.",
    },
    {
      type: "quiz",
      question: "¿Qué operador cambia campos sin reemplazar todo el documento?",
      options: ["$set", "$gte", "$find", "$drop"],
      correctIndex: 0,
      explanation: "$set actualiza campos.",
    },
    {
      type: "fill_blank",
      template: "Update → updateOne + {{0}}",
      blanks: [{ answer: "$set" }],
      explanation: "Patrón básico.",
    },
  ],
});
