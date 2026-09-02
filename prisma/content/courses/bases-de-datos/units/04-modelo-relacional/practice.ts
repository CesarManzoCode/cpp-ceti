import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-relacional-fk",
    title: "Crear una FK",
    description: "Crea ticket(id PK, cliente_id NOT NULL FK cliente(id)) y consulta la tabla referenciada.",
    prompt:
      "Crea `ticket(id PK, cliente_id NOT NULL FK cliente(id))` y consulta con PRAGMA la tabla referenciada.",
    starterCode: `CREATE TABLE cliente(id INTEGER PRIMARY KEY);
-- crea ticket
-- termina con: SELECT "table" FROM pragma_foreign_key_list('ticket');
`,
    solutionCode: `CREATE TABLE cliente(id INTEGER PRIMARY KEY);
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, FOREIGN KEY(cliente_id) REFERENCES cliente(id));
SELECT "table" FROM pragma_foreign_key_list('ticket');`,
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
        description: "independiente",
        stdin: ``,
        expectedStdout: `cliente`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-relacional-check",
    title: "Restringir estado",
    description: "Crea Ticket con CHECK que sólo admita ABIERTO/CERRADO; inserta ABIERTO y selecciona estado.",
    prompt:
      "Crea Ticket con CHECK que sólo admita ABIERTO/CERRADO; inserta ABIERTO y selecciona estado.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT NOT NULL CHECK(estado IN ('ABIERTO','CERRADO')));
INSERT INTO ticket VALUES(1,'ABIERTO');
SELECT estado FROM ticket;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "válido",
        stdin: ``,
        expectedStdout: `ABIERTO`,
        visible: true,
      },
      {
        description: "repetición",
        stdin: ``,
        expectedStdout: `ABIERTO`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-relacional-null",
    title: "Detectar pendientes",
    description: "Consulta ids donde fecha_cierre IS NULL ordenados.",
    prompt: "Consulta ids donde `fecha_cierre IS NULL` ordenados.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT id FROM ticket WHERE fecha_cierre IS NULL ORDER BY id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER,fecha_cierre TEXT); INSERT INTO ticket VALUES(1,NULL),(2,'2026-01-01'),(3,NULL);`,
        expectedStdout: `1
3`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER,fecha_cierre TEXT); INSERT INTO ticket VALUES(9,'x'),(4,NULL);`,
        expectedStdout: `4`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-relacional-asociativa",
    title: "Consultar asignaciones",
    description:
      "Devuelve técnicos del ticket indicado por datos del fixture; fixture sólo contiene un ticket objetivo marcado objetivo=1.",
    prompt:
      "Devuelve técnicos del ticket indicado por datos del fixture; fixture sólo contiene un ticket objetivo marcado `objetivo=1`.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT tecnico_id,horas FROM asignacion WHERE objetivo=1 ORDER BY tecnico_id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER,objetivo INTEGER); INSERT INTO asignacion VALUES(10,2,3,1),(10,1,1,1),(11,8,2,0);`,
        expectedStdout: `1|1
2|3`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER,objetivo INTEGER); INSERT INTO asignacion VALUES(1,5,7,1);`,
        expectedStdout: `5|7`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
