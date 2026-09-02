import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-requerimiento-filtrar",
    title: "Filtrar por necesidad",
    description: "Devuelve sólo clientes de la ciudad GDL, ordenados por id.",
    prompt: "Devuelve sólo clientes de la ciudad `GDL`, ordenados por id.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT id,nombre FROM cliente WHERE ciudad='GDL' ORDER BY id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');`,
        expectedStdout: `1|Ana
3|Mara`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); INSERT INTO cliente VALUES(4,'Iris','GDL'),(2,'Omar','Zapopan'),(9,'Sol','GDL');`,
        expectedStdout: `4|Iris
9|Sol`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-requerimiento-estado",
    title: "Responder una pregunta",
    description: "Cuenta tickets ABIERTO.",
    prompt: "Cuenta tickets `ABIERTO`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT COUNT(*) FROM ticket WHERE estado='ABIERTO';`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "dos abiertos",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `2`,
        visible: true,
      },
      {
        description: "ninguno",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(1,1,'CERRADO',1),(2,1,'CERRADO',2);`,
        expectedStdout: `0`,
        visible: false,
      },
      {
        description: "uno",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(1,1,'ABIERTO',1);`,
        expectedStdout: `1`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
