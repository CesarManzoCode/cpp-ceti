import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-er-cliente-ticket",
    title: "Relación cliente-ticket",
    description: "Consulta cada ticket con su cliente_id, ordenado por ticket.",
    prompt:
      "Consulta cada ticket con su `cliente_id`, ordenado por ticket. Este ejercicio prepara la futura FK.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT id,cliente_id FROM ticket ORDER BY id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `10|1
11|1
12|2
13|3`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO ticket VALUES(7,9,'A',0),(2,4,'B',0);`,
        expectedStdout: `2|4
7|9`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-er-asignacion",
    title: "Tabla asociativa",
    description: "Devuelve ticket_id|tecnico_id|horas de todas las asignaciones ordenadas por ambos ids.",
    prompt: "Devuelve `ticket_id|tecnico_id|horas` de todas las asignaciones ordenadas por ambos ids.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT ticket_id,tecnico_id,horas FROM asignacion ORDER BY ticket_id,tecnico_id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER); INSERT INTO asignacion VALUES(10,2,3),(10,1,1),(12,2,4);`,
        expectedStdout: `10|1|1
10|2|3
12|2|4`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER); INSERT INTO asignacion VALUES(4,8,2);`,
        expectedStdout: `4|8|2`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-er-clave-compuesta",
    title: "Unicidad de asignación",
    description:
      "Crea asignacion con PRIMARY KEY compuesta (ticket_id, tecnico_id) y consulta el orden de la clave.",
    prompt:
      "Crea `asignacion` con PRIMARY KEY compuesta `(ticket_id, tecnico_id)` y termina con `SELECT pk FROM pragma_table_info('asignacion') WHERE name IN ('ticket_id','tecnico_id') ORDER BY pk;`.",
    starterCode: `-- crea la tabla asignacion y luego ejecuta la consulta PRAGMA indicada
`,
    solutionCode: `CREATE TABLE asignacion(ticket_id INTEGER NOT NULL, tecnico_id INTEGER NOT NULL, horas INTEGER NOT NULL, PRIMARY KEY(ticket_id,tecnico_id));
SELECT pk FROM pragma_table_info('asignacion') WHERE name IN ('ticket_id','tecnico_id') ORDER BY pk;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "estructura",
        stdin: ``,
        expectedStdout: `1
2`,
        visible: true,
      },
      {
        description: "repetición independiente",
        stdin: ``,
        expectedStdout: `1
2`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
