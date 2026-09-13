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
        // Post-check independiente: re-consulta el esquema REAL después del
        // envío del alumno, en vez de confiar en que lo que imprimió sea
        // honesto. Una solución que falsifique el print (p. ej.
        // `SELECT 'id' UNION SELECT 'nombre';` sin crear la tabla) reprueba
        // aquí porque `pragma_table_info('cliente')` da vacío.
        postCheckSql: `SELECT name FROM pragma_table_info('cliente') ORDER BY cid;`,
        postCheckExpectedStdout: `id
nombre`,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `id
nombre`,
        visible: false,
        postCheckSql: `SELECT name FROM pragma_table_info('cliente') ORDER BY cid;`,
        postCheckExpectedStdout: `id
nombre`,
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
        postCheckSql: `SELECT COUNT(*) FROM pragma_index_list('ticket') WHERE "unique"=1;`,
        postCheckExpectedStdout: `1`,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `1`,
        visible: false,
        postCheckSql: `SELECT COUNT(*) FROM pragma_index_list('ticket') WHERE "unique"=1;`,
        postCheckExpectedStdout: `1`,
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
        // Insertar 10 y releerlo NO prueba que exista el CHECK: una tabla
        // sin restricción también deja pasar 10. El post-check inspecciona
        // el DDL real en sqlite_master en vez de inferirlo del dato.
        postCheckSql: `SELECT CASE WHEN UPPER(sql) LIKE '%CHECK%' THEN 'HASCHECK' ELSE 'NOCHECK' END FROM sqlite_master WHERE type='table' AND name='ticket';`,
        postCheckExpectedStdout: `HASCHECK`,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `10`,
        visible: false,
        postCheckSql: `SELECT CASE WHEN UPPER(sql) LIKE '%CHECK%' THEN 'HASCHECK' ELSE 'NOCHECK' END FROM sqlite_master WHERE type='table' AND name='ticket';`,
        postCheckExpectedStdout: `HASCHECK`,
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
        postCheckSql: `SELECT "table" FROM pragma_foreign_key_list('ticket');`,
        postCheckExpectedStdout: `cliente`,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `cliente`,
        visible: false,
        postCheckSql: `SELECT "table" FROM pragma_foreign_key_list('ticket');`,
        postCheckExpectedStdout: `cliente`,
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
        postCheckSql: `SELECT pk FROM pragma_table_info('asignacion') WHERE name IN ('ticket_id','tecnico_id') ORDER BY pk;`,
        postCheckExpectedStdout: `1
2`,
      },
      {
        description: "ejecución independiente",
        stdin: ``,
        expectedStdout: `1
2`,
        visible: false,
        postCheckSql: `SELECT pk FROM pragma_table_info('asignacion') WHERE name IN ('ticket_id','tecnico_id') ORDER BY pk;`,
        postCheckExpectedStdout: `1
2`,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
