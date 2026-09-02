import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-dml-insert",
    title: "Insertar cliente",
    description: "Inserta id 4, nombre Eva, ciudad GDL y devuelve la fila.",
    prompt: "Inserta id 4, nombre Eva, ciudad GDL y devuelve la fila.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `INSERT INTO cliente(id,nombre,ciudad) VALUES(4,'Eva','GDL'); SELECT id,nombre,ciudad FROM cliente WHERE id=4;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');`,
        expectedStdout: `4|Eva|GDL`,
        visible: true,
      },
      {
        description: "vacía",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT);`,
        expectedStdout: `4|Eva|GDL`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-dml-update",
    title: "Cerrar un ticket",
    description: "Cambia a CERRADO el ticket con id 12 y devuelve id|estado.",
    prompt: "Cambia a CERRADO el ticket con id 12 y devuelve id|estado.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `UPDATE ticket SET estado='CERRADO' WHERE id=12; SELECT id,estado FROM ticket WHERE id=12;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `12|CERRADO`,
        visible: true,
      },
      {
        description: "no tocar 99",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(12,9,'ABIERTO',0),(99,9,'ABIERTO',0);`,
        expectedStdout: `12|CERRADO`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-dml-delete",
    title: "Eliminar sólo cerrados baratos",
    description: "Elimina tickets CERRADO con costo < 400 y devuelve ids restantes.",
    prompt: "Elimina tickets CERRADO con costo < 400 y devuelve ids restantes.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `DELETE FROM ticket WHERE estado='CERRADO' AND costo<400; SELECT id FROM ticket ORDER BY id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `10
11
12`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(1,1,'CERRADO',50),(2,1,'CERRADO',900),(3,1,'ABIERTO',1);`,
        expectedStdout: `2
3`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-dml-aumento",
    title: "Actualizar costo",
    description: "Aumenta 50 a todos los tickets ABIERTOS y devuelve id|costo ordenado.",
    prompt: "Aumenta 50 a todos los tickets ABIERTOS y devuelve id|costo ordenado.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `UPDATE ticket SET costo=costo+50 WHERE estado='ABIERTO'; SELECT id,costo FROM ticket ORDER BY id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `10|250
11|500
12|150
13|300`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(1,1,'ABIERTO',0),(2,1,'CERRADO',10);`,
        expectedStdout: `1|50
2|10`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-dml-crud",
    title: "Secuencia CRUD",
    description: "Inserta ticket 20 abierto, actualízalo a cerrado y devuelve estado final.",
    prompt: "Inserta ticket 20 abierto, actualízalo a cerrado y devuelve estado final.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `INSERT INTO ticket(id,cliente_id,estado,costo) VALUES(20,1,'ABIERTO',0); UPDATE ticket SET estado='CERRADO' WHERE id=20; SELECT estado FROM ticket WHERE id=20;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `CERRADO`,
        visible: true,
      },
      {
        description: "vacía",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER);`,
        expectedStdout: `CERRADO`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
