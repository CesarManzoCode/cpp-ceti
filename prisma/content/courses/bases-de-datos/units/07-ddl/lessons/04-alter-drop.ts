import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "alter-drop",
  title: "Cambiar y eliminar estructura con cuidado",
  description: "Distingue evolución de esquema de manipulación de datos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`ALTER TABLE\` cambia estructura; \`DROP TABLE\` elimina la tabla. Son operaciones DDL y pueden tener impacto destructivo.

En BD I basta comprender el riesgo y usar cambios simples. Migraciones complejas y operación de producción quedan fuera.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "ALTER TABLE", right: "Modificar estructura" },
        { left: "DROP TABLE", right: "Eliminar estructura" },
        { left: "DELETE", right: "Eliminar filas" },
        { left: "UPDATE", right: "Modificar filas" },
      ],
      explanation: "DDL y DML afectan niveles distintos.",
    },
    {
      type: "quiz",
      question: "¿Qué elimina la tabla completa, no sólo sus filas?",
      options: ["DELETE FROM tabla", "DROP TABLE tabla", "UPDATE tabla", "SELECT"],
      correctIndex: 1,
      explanation: "DROP elimina el objeto del esquema.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE ejemplo(id INTEGER PRIMARY KEY);
ALTER TABLE ejemplo ADD COLUMN nombre TEXT;
SELECT name FROM pragma_table_info('ejemplo') ORDER BY cid;`,
      explanation: "PRAGMA permite observar el cambio de esquema.",
      runnable: true,
      expectedOutput: `id
nombre`,
    },
  ],
});
