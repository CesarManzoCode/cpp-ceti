import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "foreign-key-ddl",
  title: "FOREIGN KEY en DDL",
  description: "Declara referencias entre tablas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una FK documenta y protege un vínculo. En SQLite debemos activar \`PRAGMA foreign_keys=ON\` para enforcement en una conexión.

El diseño sigue siendo relacional aunque el motor tenga detalles operativos propios.`,
    },
    {
      type: "code_example",
      code: `PRAGMA foreign_keys=ON;
CREATE TABLE cliente(id INTEGER PRIMARY KEY);
CREATE TABLE ticket(
 id INTEGER PRIMARY KEY,
 cliente_id INTEGER NOT NULL,
 FOREIGN KEY(cliente_id) REFERENCES cliente(id)
);
INSERT INTO cliente VALUES(1);
INSERT INTO ticket VALUES(10,1);
SELECT id,cliente_id FROM ticket;`,
      explanation: "La fila de ticket referencia un cliente existente.",
      runnable: true,
      expectedOutput: `10|1`,
    },
    {
      type: "quiz",
      question:
        "¿Qué pasa conceptualmente si cliente_id referencia un cliente inexistente y la FK se aplica?",
      options: ["Se acepta siempre", "Debe rechazarse", "Se crea cliente", "Se vuelve NULL"],
      correctIndex: 1,
      explanation: "La integridad referencial impide referencias huérfanas.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "FOREIGN KEY({{0}}) REFERENCES cliente({{1}})",
      blanks: [{ answer: "cliente_id" }, { answer: "id" }],
      explanation: "Declara origen y destino.",
    },
  ],
});
