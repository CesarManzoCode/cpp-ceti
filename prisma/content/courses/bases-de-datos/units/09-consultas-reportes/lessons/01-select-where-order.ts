import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "select-where-order",
  title: "SELECT, WHERE y ORDER BY",
  description: "Recupera columnas/filas concretas en un orden determinista.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una consulta útil responde una pregunta. \`SELECT\` elige atributos, \`FROM\` la fuente, \`WHERE\` filtra y \`ORDER BY\` hace determinista el orden cuando importa.

No uses \`SELECT *\` por defecto en reportes: pide las columnas que la decisión necesita.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT id,estado,costo FROM ticket WHERE estado='ABIERTO' ORDER BY costo DESC,id;`,
      explanation: "La consulta filtra y ordena.",
      runnable: true,
      expectedOutput: `10|ABIERTO|200
12|ABIERTO|100`,
    },
    {
      type: "quiz",
      question: "¿Qué cláusula limita filas?",
      options: ["ORDER BY", "WHERE", "SELECT", "FROM"],
      correctIndex: 1,
      explanation: "WHERE expresa predicado.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "SELECT id FROM ticket {{0}} estado='ABIERTO' {{1}} BY id;",
      blanks: [{ answer: "WHERE" }, { answer: "ORDER" }],
      explanation: "Filtra y luego ordena.",
    },
  ],
});
