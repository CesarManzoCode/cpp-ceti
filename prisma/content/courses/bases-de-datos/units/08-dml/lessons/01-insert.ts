import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "insert",
  title: "INSERT y filas válidas",
  description: "Inserta datos respetando esquema y restricciones.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `DML manipula datos. \`INSERT\` agrega filas. El orden de columnas explícito reduce errores y hace el script más legible.

Una inserción debe cumplir PK, FK, NOT NULL, UNIQUE y CHECK declarados.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL,ciudad TEXT NOT NULL);
INSERT INTO cliente(id,nombre,ciudad) VALUES(1,'Ana','GDL');
SELECT id,nombre,ciudad FROM cliente;`,
      explanation: "La lista de columnas hace explícita la correspondencia.",
      runnable: true,
      expectedOutput: `1|Ana|GDL`,
    },
    {
      type: "quiz",
      question: "¿Qué ocurre si insertas una segunda fila con la misma PK?",
      options: ["Debe rechazarse", "Se fusiona", "Se ordena", "Se vuelve NULL"],
      correctIndex: 0,
      explanation: "La PK es única.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "INSERT INTO cliente({{0}},nombre) VALUES(1,'Ana');",
      blanks: [{ answer: "id" }],
      explanation: "La lista identifica columnas destino.",
    },
  ],
});
