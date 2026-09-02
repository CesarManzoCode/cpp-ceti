import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "views",
  title: "Vistas como interfaz de lectura",
  description: "Usar CREATE VIEW para encapsular una consulta de reporte.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una vista presenta una consulta con nombre. Puede simplificar reportes y ocultar detalles de joins. No debe usarse para esconder un mal modelo.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER,nombre TEXT);
CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT);
CREATE VIEW tickets_cliente AS
 SELECT ticket.id,cliente.nombre,ticket.estado
 FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id;
INSERT INTO cliente VALUES(1,'Ana');
INSERT INTO ticket VALUES(10,1,'ABIERTO');
SELECT * FROM tickets_cliente;`,
      explanation: "SQLite permite practicar vistas.",
      runnable: true,
      expectedOutput: `10|Ana|ABIERTO`,
    },
    {
      type: "quiz",
      question: "¿Qué encapsula una vista?",
      options: ["Una consulta nombrada", "Un usuario", "Un job", "Un backup"],
      correctIndex: 0,
      explanation: "Es una interfaz de lectura SQL.",
    },
    {
      type: "fill_blank",
      template: "CREATE {{0}} nombre AS SELECT ...",
      blanks: [{ answer: "VIEW" }],
      explanation: "Sintaxis base.",
    },
  ],
});
