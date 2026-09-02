import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "crud-relacional",
  title: "CRUD sobre datos relacionados",
  description: "Combina INSERT/UPDATE/DELETE sin romper referencias.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `CRUD suele resumir Create, Read, Update, Delete. En una base relacional las operaciones no viven aisladas: insertar un ticket requiere cliente válido; borrar cliente puede estar bloqueado si conserva tickets.

La integridad guía el orden de operaciones.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Insertar cliente",
        "Insertar ticket que lo referencia",
        "Consultar ticket",
        "Actualizar estado",
        "Eliminar según reglas",
      ],
      explanation: "Primero deben existir las filas referenciadas.",
    },
    {
      type: "quiz",
      question: "¿Qué operación del acrónimo CRUD corresponde a SELECT?",
      options: ["Create", "Read", "Update", "Delete"],
      correctIndex: 1,
      explanation: "SELECT recupera/lee datos.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT);
CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT);
INSERT INTO cliente VALUES(1,'Ana');
INSERT INTO ticket VALUES(10,1,'ABIERTO');
UPDATE ticket SET estado='CERRADO' WHERE id=10;
SELECT cliente.nombre,ticket.estado FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id;`,
      explanation: "La lectura final observa operaciones previas.",
      runnable: true,
      expectedOutput: `Ana|CERRADO`,
    },
  ],
});
