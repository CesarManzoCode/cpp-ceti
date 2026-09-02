import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "seleccion-proyeccion",
  title: "Selección y proyección",
  description: "Distingue filtrar filas de elegir columnas y conéctalo con SQL.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `En álgebra relacional, **selección** conserva filas que satisfacen un predicado. **Proyección** conserva atributos/columnas.

SQL aproxima estas operaciones con \`WHERE\` y la lista de \`SELECT\` respectivamente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "σ estado='ABIERTO'", right: "Selección" },
        { left: "π nombre,ciudad", right: "Proyección" },
        { left: "WHERE estado='ABIERTO'", right: "SQL de selección" },
        { left: "SELECT nombre,ciudad", right: "SQL de proyección" },
      ],
      explanation: "El álgebra describe operación; SQL la expresa.",
    },
    {
      type: "quiz",
      question: "¿Qué operación reduce filas?",
      options: ["Proyección", "Selección", "Producto cartesiano", "Renombrado"],
      correctIndex: 1,
      explanation: "Selección aplica un predicado a filas.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
SELECT nombre FROM cliente WHERE ciudad='GDL' ORDER BY id;`,
      explanation: "WHERE selecciona; SELECT nombre proyecta.",
      runnable: true,
      expectedOutput: `Ana
Mara`,
    },
  ],
});
