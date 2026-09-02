import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "delete",
  title: "DELETE y alcance",
  description: "Elimina filas específicas sin confundirlo con DROP.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`DELETE FROM tabla WHERE ...\` elimina filas. \`DROP TABLE\` elimina la estructura completa.

Eliminar datos puede afectar integridad referencial; el modelo debe decidir qué relaciones impiden borrar o qué política se usa.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "DELETE", right: "Filas" },
        { left: "DROP TABLE", right: "Estructura" },
        { left: "WHERE", right: "Alcance" },
        { left: "FK", right: "Puede bloquear borrado referenciado" },
      ],
      explanation: "Distingue nivel de operación.",
    },
    {
      type: "quiz",
      question: "¿Qué comando conserva la tabla pero elimina filas?",
      options: ["DROP", "DELETE", "CREATE", "ALTER"],
      correctIndex: 1,
      explanation: "DELETE es DML.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT);
INSERT INTO ticket VALUES(1,'CERRADO'),(2,'ABIERTO'),(3,'CERRADO');
DELETE FROM ticket WHERE estado='CERRADO';
SELECT id FROM ticket ORDER BY id;`,
      explanation: "Sólo queda el ticket abierto.",
      runnable: true,
      expectedOutput: `2`,
    },
  ],
});
