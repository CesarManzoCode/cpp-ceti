import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "trigger-auditoria",
  title: "Auditoría con trigger",
  description: "Crear un trigger SQLite verificable.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `SQLite sí soporta triggers. Cada ticket insertado puede generar una entrada de auditoría.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT);
CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT);
CREATE TRIGGER audit_ticket AFTER INSERT ON ticket
BEGIN INSERT INTO auditoria VALUES(NEW.id,'INSERT'); END;
INSERT INTO ticket VALUES(7,'ABIERTO');
SELECT ticket_id,accion FROM auditoria;`,
      explanation: "El efecto ocurre automáticamente.",
      runnable: true,
      expectedOutput: `7|INSERT`,
    },
    {
      type: "quiz",
      question: "¿Qué representa NEW.id?",
      options: ["PK de fila nueva", "Id de auditoría", "Variable global", "Id previo"],
      correctIndex: 0,
      explanation: "NEW expone la fila insertada.",
    },
    {
      type: "fill_blank",
      template: "AFTER INSERT ... NEW.{{0}}",
      blanks: [{ answer: "id" }],
      explanation: "Referencia valores nuevos.",
    },
  ],
});
