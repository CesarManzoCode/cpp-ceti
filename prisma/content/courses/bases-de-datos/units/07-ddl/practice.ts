import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-ddl-cliente",
    title: "Tabla cliente",
    description: "Crea cliente con id PK y nombre NOT NULL; termina consultando name de PRAGMA.",
    prompt: "Crea cliente con id PK y nombre NOT NULL; termina consultando `name` de PRAGMA.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
SELECT name FROM pragma_table_info('cliente') ORDER BY cid;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "estructura",
        stdin: ``,
        expectedStdout: `id
nombre`,
        visible: true,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `id
nombre`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-ddl-ticket-unique",
    title: "Folio único",
    description:
      "Crea ticket(id PK, folio TEXT NOT NULL UNIQUE) y cuenta los índices únicos de la tabla.",
    prompt:
      "Crea ticket(id PK, folio TEXT NOT NULL UNIQUE) y termina `SELECT COUNT(*) FROM pragma_index_list('ticket') WHERE \"unique\"=1;`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,folio TEXT NOT NULL UNIQUE);
SELECT COUNT(*) FROM pragma_index_list('ticket') WHERE "unique"=1;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "estructura",
        stdin: ``,
        expectedStdout: `1`,
        visible: true,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `1`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-ddl-check",
    title: "Costo no negativo",
    description: "Crea ticket con costo INTEGER NOT NULL CHECK(costo>=0), inserta costo 10 y selecciónalo.",
    prompt:
      "Crea ticket con `costo INTEGER NOT NULL CHECK(costo>=0)`, inserta costo 10 y selecciónalo.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,costo INTEGER NOT NULL CHECK(costo>=0)); INSERT INTO ticket VALUES(1,10); SELECT costo FROM ticket;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "estructura",
        stdin: ``,
        expectedStdout: `10`,
        visible: true,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `10`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-ddl-fk",
    title: "FK a cliente",
    description: "Crea cliente y ticket con FK; termina consultando tabla destino en PRAGMA.",
    prompt: "Crea cliente y ticket con FK; termina consultando tabla destino en PRAGMA.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TABLE cliente(id INTEGER PRIMARY KEY); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER NOT NULL,FOREIGN KEY(cliente_id) REFERENCES cliente(id)); SELECT "table" FROM pragma_foreign_key_list('ticket');`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "estructura",
        stdin: ``,
        expectedStdout: `cliente`,
        visible: true,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `cliente`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-ddl-asignacion",
    title: "PK compuesta",
    description: "Crea asignacion con PK(ticket_id,tecnico_id); consulta valores pk de ambas columnas ordenados.",
    prompt:
      "Crea asignacion con PK(ticket_id,tecnico_id); consulta valores `pk` de ambas columnas ordenados.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER,PRIMARY KEY(ticket_id,tecnico_id)); SELECT pk FROM pragma_table_info('asignacion') WHERE name IN ('ticket_id','tecnico_id') ORDER BY pk;`,
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
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `1
2`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
