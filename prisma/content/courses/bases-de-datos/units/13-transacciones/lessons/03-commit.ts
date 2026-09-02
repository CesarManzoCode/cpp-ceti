import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "commit",
  title: "COMMIT",
  description: "Confirmar una unidad correcta.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `COMMIT hace definitivos los cambios de la transacción para las operaciones posteriores.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER);
INSERT INTO cuenta VALUES(1,100),(2,50);
BEGIN;
UPDATE cuenta SET saldo=saldo-30 WHERE id=1;
UPDATE cuenta SET saldo=saldo+30 WHERE id=2;
COMMIT;
SELECT id,saldo FROM cuenta ORDER BY id;`,
      explanation: "La transferencia se confirma.",
      runnable: true,
      expectedOutput: `1|70
2|80`,
    },
    {
      type: "quiz",
      question: "Total antes/después?",
      options: ["150/150", "150/120", "100/80", "depende"],
      correctIndex: 0,
      explanation: "Conserva el total.",
    },
    {
      type: "fill_blank",
      template: "cambios correctos → {{0}}",
      blanks: [{ answer: "COMMIT" }],
      explanation: "Confirmar al final.",
    },
  ],
});
