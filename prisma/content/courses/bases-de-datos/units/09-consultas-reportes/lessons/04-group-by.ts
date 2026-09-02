import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "group-by",
  title: "GROUP BY y reportes por categoría",
  description: "Obtén métricas por cliente, estado u otra dimensión.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`GROUP BY\` particiona las filas por una dimensión y calcula agregados dentro de cada grupo.

Ejemplo: cantidad de tickets por estado. Es la base de muchos reportes operativos.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT estado,COUNT(*) FROM ticket GROUP BY estado ORDER BY estado;`,
      explanation: "Cada estado produce su conteo.",
      runnable: true,
      expectedOutput: `ABIERTO|2
CERRADO|2`,
    },
    {
      type: "quiz",
      question: "¿Qué cláusula crea grupos para agregados?",
      options: ["WHERE", "GROUP BY", "ORDER BY", "DELETE"],
      correctIndex: 1,
      explanation: "GROUP BY define grupos.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "SELECT estado,COUNT(*) FROM ticket {{0}} estado;",
      blanks: [{ answer: "GROUP BY" }],
      explanation: "Agrupa por la dimensión reportada.",
    },
  ],
});
