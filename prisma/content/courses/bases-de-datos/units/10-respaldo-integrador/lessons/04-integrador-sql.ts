import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "integrador-sql",
  title: "Integrador II: DDL, DML y consultas",
  description: "Construye un script reproducible que cree, cargue y consulte la base.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El script del proyecto debe poder ejecutarse desde una base vacía y producir:
- tablas/restricciones;
- datos de demostración;
- operaciones DML;
- consultas/reportes definidos desde los requerimientos.

La reproducibilidad permite evaluar el sistema sin depender del estado manual de una computadora.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Crear esquema DDL",
        "Insertar datos de demostración",
        "Ejecutar DML relevante",
        "Ejecutar reportes",
        "Guardar evidencia",
      ],
      explanation: "Un script reproducible es parte del entregable.",
    },
    {
      type: "quiz",
      question: "¿Qué es mejor para demostrar la BD?",
      options: [
        "Sólo capturas",
        "Script reproducible + resultados de consultas",
        "Una tabla manual",
        "Una descripción sin SQL",
      ],
      correctIndex: 1,
      explanation: "El evaluador puede reconstruir y verificar.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER NOT NULL,estado TEXT NOT NULL);
INSERT INTO cliente VALUES(1,'Ana');
INSERT INTO ticket VALUES(10,1,'ABIERTO'),(11,1,'CERRADO');
SELECT cliente.nombre,COUNT(*) FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id GROUP BY cliente.id,cliente.nombre;`,
      explanation: "Es una miniatura del pipeline DDL→datos→reporte.",
      runnable: true,
      expectedOutput: `Ana|2`,
    },
  ],
});
