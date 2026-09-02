import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "traducir-nm",
  title: "N:M en el modelo relacional",
  description: "Crea tabla asociativa con dos FKs y una clave que evite duplicar el vínculo.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una N:M se representa con una relación intermedia. \`asignacion(ticket_id, tecnico_id, horas)\` referencia ambas entidades.

Si un técnico sólo debe aparecer una vez por ticket, \`(ticket_id, tecnico_id)\` puede ser PK compuesta.`,
    },
    {
      type: "code_example",
      code: `PRAGMA foreign_keys=ON;
CREATE TABLE ticket(id INTEGER PRIMARY KEY);
CREATE TABLE tecnico(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
CREATE TABLE asignacion(
 ticket_id INTEGER NOT NULL,
 tecnico_id INTEGER NOT NULL,
 horas INTEGER NOT NULL,
 PRIMARY KEY(ticket_id,tecnico_id),
 FOREIGN KEY(ticket_id) REFERENCES ticket(id),
 FOREIGN KEY(tecnico_id) REFERENCES tecnico(id)
);
INSERT INTO ticket VALUES(1);
INSERT INTO tecnico VALUES(7,'Ana');
INSERT INTO asignacion VALUES(1,7,3);
SELECT ticket_id,tecnico_id,horas FROM asignacion;`,
      explanation: "La asociativa convierte N:M en dos relaciones 1:N.",
      runnable: true,
      expectedOutput: `1|7|3`,
    },
    {
      type: "quiz",
      question: "¿Dónde debe vivir `horas`?",
      options: ["Ticket", "Tecnico", "Asignacion", "Cliente"],
      correctIndex: 2,
      explanation: "Depende del par técnico-ticket.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "PRIMARY KEY({{0}},{{1}})",
      blanks: [{ answer: "ticket_id" }, { answer: "tecnico_id" }],
      explanation: "La clave compuesta identifica el vínculo.",
    },
  ],
});
