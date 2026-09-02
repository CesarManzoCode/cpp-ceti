import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd2-view-reporte",
    title: "Vista de tickets",
    description: "Crea vista ticket_cliente y devuelve id|cliente|estado.",
    prompt: "Crea vista `ticket_cliente` y devuelve `id|cliente|estado`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE VIEW ticket_cliente AS SELECT ticket.id,cliente.nombre,ticket.estado FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id; SELECT id,nombre,estado FROM ticket_cliente ORDER BY id;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(1,'Ana'),(2,'Luis'); INSERT INTO ticket VALUES(10,1,'ABIERTO',100),(11,1,'CERRADO',300),(12,2,'ABIERTO',200);`,
        expectedStdout: `10|Ana|ABIERTO
11|Ana|CERRADO
12|Luis|ABIERTO`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva'); INSERT INTO ticket VALUES(7,5,'CERRADO',9);`,
        expectedStdout: `7|Eva|CERRADO`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-informe-estado",
    title: "Informe por estado",
    description: "Devuelve estado|cantidad|total costo.",
    prompt: "Devuelve `estado|cantidad|total costo`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT estado,COUNT(*),SUM(costo) FROM ticket GROUP BY estado ORDER BY estado;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(1,'Ana'),(2,'Luis'); INSERT INTO ticket VALUES(10,1,'ABIERTO',100),(11,1,'CERRADO',300),(12,2,'ABIERTO',200);`,
        expectedStdout: `ABIERTO|2|300
CERRADO|1|300`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(1,1,'CERRADO',50),(2,1,'CERRADO',70);`,
        expectedStdout: `CERRADO|2|120`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-informe-cliente",
    title: "Informe por cliente",
    description: "Devuelve cliente|tickets|costo.",
    prompt: "Devuelve `cliente|tickets|costo`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT cliente.nombre,COUNT(*),SUM(ticket.costo) FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id GROUP BY cliente.id,cliente.nombre ORDER BY cliente.nombre;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(1,'Ana'),(2,'Luis'); INSERT INTO ticket VALUES(10,1,'ABIERTO',100),(11,1,'CERRADO',300),(12,2,'ABIERTO',200);`,
        expectedStdout: `Ana|2|400
Luis|1|200`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(4,'Eva'); INSERT INTO ticket VALUES(1,4,'A',20),(2,4,'B',30);`,
        expectedStdout: `Eva|2|50`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
