import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "agregados",
  title: "COUNT, SUM, AVG, MIN y MAX",
  description: "Resume conjuntos de filas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Los agregados convierten muchas filas en medidas: contar tickets, sumar costos, calcular promedio, mínimos o máximos.

La pregunta debe definir claramente qué conjunto entra al cálculo.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT COUNT(*),SUM(costo),MIN(costo),MAX(costo) FROM ticket;`,
      explanation: "Cuatro métricas del mismo conjunto.",
      runnable: true,
      expectedOutput: `4|1100|100|500`,
    },
    {
      type: "quiz",
      question: "¿Qué función cuenta filas?",
      options: ["SUM", "COUNT", "AVG", "MAX"],
      correctIndex: 1,
      explanation: "COUNT(*) cuenta filas.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "SELECT {{0}}(costo) FROM ticket;",
      blanks: [{ answer: "SUM" }],
      explanation: "SUM agrega valores numéricos.",
    },
  ],
});
