import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "rollback",
  title: "ROLLBACK",
  description: "Volver al estado previo ante fallo.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `ROLLBACK revierte cambios no confirmados de la transacción.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER);
INSERT INTO cuenta VALUES(1,100);
BEGIN;
UPDATE cuenta SET saldo=saldo-30 WHERE id=1;
ROLLBACK;
SELECT saldo FROM cuenta WHERE id=1;`,
      explanation: "La modificación desaparece.",
      runnable: true,
      expectedOutput: `100`,
    },
    {
      type: "quiz",
      question: "¿Qué descarta cambios pendientes?",
      options: ["COMMIT", "ROLLBACK", "GRANT", "TRIGGER"],
      correctIndex: 1,
      explanation: "ROLLBACK aborta.",
    },
    {
      type: "fill_blank",
      template: "error detectado → {{0}}",
      blanks: [{ answer: "ROLLBACK" }],
      explanation: "Protege estado.",
    },
  ],
});
