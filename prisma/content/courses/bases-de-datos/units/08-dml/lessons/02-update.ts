import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "update",
  title: "UPDATE con condición",
  description: "Modifica sólo las filas pretendidas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`UPDATE\` sin \`WHERE\` modifica todas las filas. Antes de ejecutarlo, formula qué conjunto debe cambiar y verifica el predicado.

La operación correcta no es sólo sintaxis: es seleccionar exactamente el alcance.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT);
INSERT INTO ticket VALUES(1,'ABIERTO'),(2,'ABIERTO');
UPDATE ticket SET estado='CERRADO' WHERE id=2;
SELECT id,estado FROM ticket ORDER BY id;`,
      explanation: "WHERE limita el cambio.",
      runnable: true,
      expectedOutput: `1|ABIERTO
2|CERRADO`,
    },
    {
      type: "quiz",
      question: "¿Cuál es el mayor riesgo de olvidar WHERE?",
      options: ["No compila", "Modificar todas las filas", "Sólo cambia PK", "Convierte a SELECT"],
      correctIndex: 1,
      explanation: "El alcance se vuelve toda la tabla.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "UPDATE ticket SET estado='CERRADO' {{0}} id=2;",
      blanks: [{ answer: "WHERE" }],
      explanation: "La condición delimita.",
    },
  ],
});
