import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "union-diferencia",
  title: "Unión y diferencia",
  description: "Entiende compatibilidad de relaciones y resultados de conjuntos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Unión combina tuplas compatibles. Diferencia conserva tuplas de una relación que no están en otra. Requieren estructuras compatibles en los atributos comparados.

SQLite ofrece \`UNION\` y \`EXCEPT\` para practicar estas ideas.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE a(x TEXT); CREATE TABLE b(x TEXT);
INSERT INTO a VALUES('A'),('B'); INSERT INTO b VALUES('B'),('C');
SELECT x FROM a UNION SELECT x FROM b ORDER BY x;`,
      explanation: "UNION elimina duplicados por semántica de conjunto.",
      runnable: true,
      expectedOutput: `A
B
C`,
    },
    {
      type: "quiz",
      question: "¿Qué devuelve A − B?",
      options: ["Todo A y B", "Elementos de A que no están en B", "Sólo intersección", "Producto"],
      correctIndex: 1,
      explanation: "Diferencia es direccional.",
    },
    {
      type: "matching",
      pairs: [
        { left: "UNION", right: "Unión" },
        { left: "EXCEPT", right: "Diferencia en SQLite" },
        { left: "A ∪ B", right: "Elementos de ambos" },
        { left: "A − B", right: "Sólo los de A que faltan en B" },
      ],
      explanation: "Relaciona notación con SQL.",
    },
  ],
});
