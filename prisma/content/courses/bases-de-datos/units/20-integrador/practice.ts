import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd2-final-trigger",
    title: "Integrador: auditoría",
    description: "Crea trigger que audite cambios de estado y cambia ticket 1 a CERRADO.",
    prompt: "Crea trigger que audite cambios de estado y cambia ticket 1 a CERRADO.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TRIGGER audit_estado AFTER UPDATE OF estado ON ticket BEGIN INSERT INTO auditoria VALUES(NEW.id,OLD.estado||'>'||NEW.estado); END; UPDATE ticket SET estado='CERRADO' WHERE id=1; SELECT ticket_id,accion FROM auditoria;`,
    difficulty: "hard",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT,costo INTEGER); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(1,'ABIERTO',100),(2,'CERRADO',200);`,
        expectedStdout: `1|ABIERTO>CERRADO`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT,costo INTEGER); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(1,'EN_PROCESO',5);`,
        expectedStdout: `1|EN_PROCESO>CERRADO`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-final-transaccion",
    title: "Integrador: operación atómica",
    description:
      "Cierra ticket 1 e inserta pago por su costo dentro de transacción; devuelve estado|monto.",
    prompt:
      "Cierra ticket 1 e inserta pago por su costo dentro de transacción; devuelve `estado|monto`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `BEGIN; INSERT INTO pago(ticket_id,monto) SELECT id,costo FROM ticket WHERE id=1; UPDATE ticket SET estado='CERRADO' WHERE id=1; COMMIT; SELECT ticket.estado,pago.monto FROM ticket JOIN pago ON pago.ticket_id=ticket.id WHERE ticket.id=1;`,
    difficulty: "hard",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT,costo INTEGER); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(1,'ABIERTO',100),(2,'CERRADO',200); CREATE TABLE pago(ticket_id INTEGER,monto INTEGER);`,
        expectedStdout: `CERRADO|100`,
        visible: true,
      },
      {
        description: "costo distinto",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT,costo INTEGER); CREATE TABLE pago(ticket_id INTEGER,monto INTEGER); INSERT INTO ticket VALUES(1,'ABIERTO',450);`,
        expectedStdout: `CERRADO|450`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-final-reporte",
    title: "Integrador: reporte",
    description: "Devuelve estado|cantidad|total costo ordenado.",
    prompt: "Devuelve `estado|cantidad|total costo` ordenado.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT estado,COUNT(*),SUM(costo) FROM ticket GROUP BY estado ORDER BY estado;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT,costo INTEGER); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(1,'ABIERTO',100),(2,'CERRADO',200);`,
        expectedStdout: `ABIERTO|1|100
CERRADO|1|200`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(1,'ABIERTO',10),(2,'ABIERTO',20),(3,'CERRADO',50);`,
        expectedStdout: `ABIERTO|2|30
CERRADO|1|50`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
