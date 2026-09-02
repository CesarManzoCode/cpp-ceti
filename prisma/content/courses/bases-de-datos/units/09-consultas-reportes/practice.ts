import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-q-abiertos",
    title: "Abiertos por costo",
    description: "Devuelve id|costo de tickets abiertos, costo descendente.",
    prompt: "Devuelve id|costo de tickets abiertos, costo descendente.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT id,costo FROM ticket WHERE estado='ABIERTO' ORDER BY costo DESC,id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `10|200
12|100`,
        visible: true,
      },
      {
        description: "dataset oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva','X'),(8,'Noe','Y'); INSERT INTO ticket VALUES(1,5,'CERRADO',50),(2,5,'ABIERTO',20),(3,5,'CERRADO',70),(4,8,'ABIERTO',100);`,
        expectedStdout: `4|100
2|20`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-q-join-cliente",
    title: "Tickets con cliente",
    description: "Devuelve id|nombre de cada ticket.",
    prompt: "Devuelve id|nombre de cada ticket.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT ticket.id,cliente.nombre FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id ORDER BY ticket.id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `10|Ana
11|Ana
12|Luis
13|Mara`,
        visible: true,
      },
      {
        description: "dataset oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva','X'),(8,'Noe','Y'); INSERT INTO ticket VALUES(1,5,'CERRADO',50),(2,5,'ABIERTO',20),(3,5,'CERRADO',70),(4,8,'ABIERTO',100);`,
        expectedStdout: `1|Eva
2|Eva
3|Eva
4|Noe`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-q-total",
    title: "Costo total",
    description: "Devuelve suma de costo.",
    prompt: "Devuelve suma de costo.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT SUM(costo) FROM ticket;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `1100`,
        visible: true,
      },
      {
        description: "dataset oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva','X'),(8,'Noe','Y'); INSERT INTO ticket VALUES(1,5,'CERRADO',50),(2,5,'ABIERTO',20),(3,5,'CERRADO',70),(4,8,'ABIERTO',100);`,
        expectedStdout: `240`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-q-por-estado",
    title: "Conteo por estado",
    description: "Devuelve estado|cantidad ordenado.",
    prompt: "Devuelve estado|cantidad ordenado.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT estado,COUNT(*) FROM ticket GROUP BY estado ORDER BY estado;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `ABIERTO|2
CERRADO|2`,
        visible: true,
      },
      {
        description: "dataset oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva','X'),(8,'Noe','Y'); INSERT INTO ticket VALUES(1,5,'CERRADO',50),(2,5,'ABIERTO',20),(3,5,'CERRADO',70),(4,8,'ABIERTO',100);`,
        expectedStdout: `ABIERTO|2
CERRADO|2`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-q-clientes-multiples",
    title: "Clientes con >=2 tickets",
    description: "Devuelve cliente_id|cantidad.",
    prompt: "Devuelve cliente_id|cantidad.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT cliente_id,COUNT(*) FROM ticket GROUP BY cliente_id HAVING COUNT(*)>=2 ORDER BY cliente_id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `1|2`,
        visible: true,
      },
      {
        description: "dataset oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva','X'),(8,'Noe','Y'); INSERT INTO ticket VALUES(1,5,'CERRADO',50),(2,5,'ABIERTO',20),(3,5,'CERRADO',70),(4,8,'ABIERTO',100);`,
        expectedStdout: `5|3`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-q-reporte",
    title: "Reporte cerrados",
    description: "Devuelve cliente|cantidad|total de tickets cerrados.",
    prompt: "Devuelve cliente|cantidad|total de tickets cerrados.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT cliente.nombre,COUNT(*),SUM(ticket.costo) FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id WHERE ticket.estado='CERRADO' GROUP BY cliente.id,cliente.nombre ORDER BY cliente.nombre;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `Ana|1|500
Mara|1|300`,
        visible: true,
      },
      {
        description: "dataset oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(5,'Eva','X'),(8,'Noe','Y'); INSERT INTO ticket VALUES(1,5,'CERRADO',50),(2,5,'ABIERTO',20),(3,5,'CERRADO',70),(4,8,'ABIERTO',100);`,
        expectedStdout: `Eva|2|120`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
