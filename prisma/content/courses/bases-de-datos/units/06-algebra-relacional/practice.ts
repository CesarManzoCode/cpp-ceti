import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-algebra-seleccion",
    title: "Selección",
    description: "Devuelve ids de tickets cerrados, ordenados.",
    prompt: "Devuelve ids de tickets cerrados, ordenados.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT id FROM ticket WHERE estado='CERRADO' ORDER BY id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `11
13`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(5,1,'ABIERTO',0),(2,1,'CERRADO',0);`,
        expectedStdout: `2`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-algebra-union",
    title: "Unión",
    description: "Devuelve todos los códigos de dos tablas sin duplicados y ordenados.",
    prompt: "Devuelve todos los códigos de dos tablas sin duplicados y ordenados.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT codigo FROM a UNION SELECT codigo FROM b ORDER BY codigo;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE a(codigo TEXT); CREATE TABLE b(codigo TEXT); INSERT INTO a VALUES('A'),('B'); INSERT INTO b VALUES('B'),('C');`,
        expectedStdout: `A
B
C`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE a(codigo TEXT); CREATE TABLE b(codigo TEXT); INSERT INTO a VALUES('X'); INSERT INTO b VALUES('Y');`,
        expectedStdout: `X
Y`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-algebra-join",
    title: "Join",
    description: "Devuelve cliente|ticket para todos los tickets.",
    prompt: "Devuelve cliente|ticket para todos los tickets.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT cliente.nombre,ticket.id FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id ORDER BY ticket.id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `Ana|10
Ana|11
Luis|12
Mara|13`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(4,'Eva','X'); INSERT INTO ticket VALUES(7,4,'A',0);`,
        expectedStdout: `Eva|7`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
