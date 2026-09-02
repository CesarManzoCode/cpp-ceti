import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "having",
  title: "HAVING: filtrar grupos",
  description: "Distingue filtro de filas de filtro de resultados agregados.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`WHERE\` filtra filas antes de agrupar. \`HAVING\` filtra grupos después de calcular agregados.

"Clientes con al menos 2 tickets" necesita agrupar por cliente y luego aplicar \`HAVING COUNT(*)>=2\`.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT cliente_id,COUNT(*) FROM ticket GROUP BY cliente_id HAVING COUNT(*)>=2 ORDER BY cliente_id;`,
      explanation: "Sólo cliente 1 tiene dos tickets.",
      runnable: true,
      expectedOutput: `1|2`,
    },
    {
      type: "quiz",
      question: "¿Qué cláusula filtra por `COUNT(*)>=2`?",
      options: ["WHERE", "HAVING", "FROM", "INSERT"],
      correctIndex: 1,
      explanation: "El predicado usa un agregado, por eso filtra grupos.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "GROUP BY cliente_id {{0}} COUNT(*)>=2",
      blanks: [{ answer: "HAVING" }],
      explanation: "HAVING actúa tras agrupar.",
    },
  ],
});
