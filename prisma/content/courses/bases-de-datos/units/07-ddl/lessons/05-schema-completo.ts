import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "schema-completo",
  title: "Construir el esquema del caso",
  description: "Ensambla Cliente, Ticket, Técnico y Asignación en DDL coherente.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El esquema parcial integrador debe respetar el modelo:

- \`cliente\`
- \`ticket(cliente_id FK)\`
- \`tecnico\`
- \`asignacion(ticket_id, tecnico_id, horas)\` con PK compuesta

El orden de creación importa cuando queremos razonar claramente sobre dependencias.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Crear cliente",
        "Crear tecnico",
        "Crear ticket con FK cliente",
        "Crear asignacion con FKs ticket/tecnico",
        "Revisar esquema",
      ],
      explanation: "Primero las tablas referenciadas; luego las dependientes.",
    },
    {
      type: "quiz",
      question: "¿Qué tabla contiene dos FKs?",
      options: ["cliente", "tecnico", "asignacion", "ninguna"],
      correctIndex: 2,
      explanation: "La asociativa referencia ambos extremos.",
    },
    {
      type: "code_example",
      code: `PRAGMA foreign_keys=ON;
CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
CREATE TABLE tecnico(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER NOT NULL,FOREIGN KEY(cliente_id) REFERENCES cliente(id));
CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER NOT NULL,PRIMARY KEY(ticket_id,tecnico_id),FOREIGN KEY(ticket_id) REFERENCES ticket(id),FOREIGN KEY(tecnico_id) REFERENCES tecnico(id));
SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;`,
      explanation: "El resultado verifica que las cuatro relaciones existen.",
      runnable: true,
      expectedOutput: `asignacion
cliente
tecnico
ticket`,
    },
  ],
});
