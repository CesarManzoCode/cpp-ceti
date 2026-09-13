import { defineLesson } from "../../../../../authoring";
import { MONGODB_LOCAL_LAB_GUIDE } from "../../../shared/local-lab-guides";

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
      type: "theory",
      markdown: MONGODB_LOCAL_LAB_GUIDE,
    },
    {
      type: "code_example",
      code: `db.tickets.updateOne(
  { folio: 'T-10' },
  { $set: { estado: 'CERRADO' } }
);

db.tickets.deleteOne({ folio: 'T-99' });`,
      explanation: "Update/Delete con filtro. Antes de correrlo, inserta documentos con esos folios (`T-10`, `T-99`) y comprueba el efecto con `db.tickets.find()`.",
      runnable: false,
      localOnlyNote: "Requiere MongoDB local — ver el paso anterior para levantar el motor y correrlo.",
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
