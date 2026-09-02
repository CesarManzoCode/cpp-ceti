import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "create-table",
  title: "CREATE TABLE y tipos",
  description: "Crea tablas pequeñas con tipos y restricciones básicas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `DDL define la estructura. En SQLite usaremos \`INTEGER\`, \`TEXT\`, \`REAL\` y restricciones portables.

El objetivo no es memorizar todos los tipos de cada SGBD, sino elegir representaciones coherentes y declarar reglas básicas.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE tecnico(
 id INTEGER PRIMARY KEY,
 nombre TEXT NOT NULL,
 activo INTEGER NOT NULL CHECK(activo IN (0,1))
);
INSERT INTO tecnico VALUES(1,'Ana',1);
SELECT id,nombre,activo FROM tecnico;`,
      explanation: "La tabla declara identidad, obligatoriedad y dominio simple.",
      runnable: true,
      expectedOutput: `1|Ana|1`,
    },
    {
      type: "quiz",
      question: "¿Qué comando define una tabla?",
      options: ["INSERT", "CREATE TABLE", "SELECT", "UPDATE"],
      correctIndex: 1,
      explanation: "CREATE TABLE pertenece a DDL.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "CREATE TABLE tecnico(id INTEGER {{0}}, nombre TEXT {{1}});",
      blanks: [{ answer: "PRIMARY KEY" }, { answer: "NOT NULL" }],
      explanation: "PK identifica; NOT NULL obliga valor.",
    },
  ],
});
