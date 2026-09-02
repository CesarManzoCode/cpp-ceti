import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "pk-fk",
  title: "Claves primarias y foráneas",
  description: "Implementa relaciones 1:N mediante FK.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La PK identifica una fila. La FK expresa que un valor referencia una fila de otra relación.

Para Cliente 1:N Ticket, \`ticket.cliente_id\` referencia \`cliente.id\`. No copiamos nombre, ciudad y demás datos del cliente en cada ticket.`,
    },
    {
      type: "code_example",
      code: `PRAGMA foreign_keys=ON;
CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
CREATE TABLE ticket(
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  FOREIGN KEY(cliente_id) REFERENCES cliente(id)
);
INSERT INTO cliente VALUES(1,'Ana');
INSERT INTO ticket VALUES(10,1);
SELECT ticket.id,cliente.nombre
FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id;`,
      explanation: "La FK conserva el vínculo; JOIN recupera datos relacionados.",
      runnable: true,
      expectedOutput: `10|Ana`,
    },
    {
      type: "quiz",
      question: "¿Dónde debe vivir `cliente_id` en una relación Cliente 1:N Ticket?",
      options: [
        "En Cliente apuntando a un ticket",
        "En Ticket apuntando al cliente",
        "En ambos duplicado",
        "En ninguna tabla",
      ],
      correctIndex: 1,
      explanation: "El lado N guarda la FK al lado 1.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "FOREIGN KEY(cliente_id) REFERENCES {{0}}({{1}})",
      blanks: [{ answer: "cliente" }, { answer: "id" }],
      explanation: "La referencia declara destino.",
    },
  ],
});
