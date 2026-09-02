import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "join",
  title: "JOIN entre tablas",
  description: "Reconstruye información distribuida en relaciones normalizadas.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Normalizar separa hechos; \`JOIN\` los vuelve a combinar para una consulta.

La condición \`ON\` debe representar la relación correcta. Un join incorrecto puede producir filas plausibles pero falsas.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT ticket.id,cliente.nombre FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id ORDER BY ticket.id;`,
      explanation: "La FK guía el join.",
      runnable: true,
      expectedOutput: `10|Ana
11|Ana
12|Luis
13|Mara`,
    },
    {
      type: "quiz",
      question: "¿Qué condición conecta Ticket con Cliente?",
      options: [
        "ticket.id=cliente.id",
        "ticket.cliente_id=cliente.id",
        "ticket.estado=cliente.nombre",
        "COUNT(*)",
      ],
      correctIndex: 1,
      explanation: "Une FK con PK.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "JOIN cliente ON cliente.id={{0}}",
      blanks: [{ answer: "ticket.cliente_id" }],
      explanation: "La igualdad representa la relación.",
    },
  ],
});
