import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-vocabulario-tabla",
    title: "Leer una tabla",
    description: "Consulta todos los clientes ordenados por id.",
    prompt: "Consulta todos los clientes ordenados por id.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT id,nombre FROM cliente ORDER BY id;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "dataset visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');`,
        expectedStdout: `1|Ana
2|Luis
3|Mara`,
        visible: true,
      },
      {
        description: "orden diferente",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); INSERT INTO cliente VALUES(8,'Eva','Tlaquepaque'),(4,'Noe','GDL');`,
        expectedStdout: `4|Noe
8|Eva`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-contar-registros",
    title: "Contar filas",
    description: "Cuenta cuántos clientes hay.",
    prompt: "Cuenta cuántos clientes hay.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT COUNT(*) FROM cliente;`,
    difficulty: "easy",
    xpReward: 20,
    testCases: [
      {
        description: "tres clientes",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');`,
        expectedStdout: `3`,
        visible: true,
      },
      {
        description: "un cliente",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT); INSERT INTO cliente VALUES(1,'A','X');`,
        expectedStdout: `1`,
        visible: false,
      },
      {
        description: "tabla vacía",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT,ciudad TEXT);`,
        expectedStdout: `0`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
