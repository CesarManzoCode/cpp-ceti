import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-final-esquema",
    title: "Esquema mínimo integrador",
    description: "Crea cliente y ticket con FK; inserta un cliente y un ticket; devuelve ticket|cliente mediante JOIN.",
    prompt:
      "Crea cliente y ticket con FK; inserta un cliente y un ticket; devuelve ticket|cliente mediante JOIN.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `PRAGMA foreign_keys=ON;
CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL);
CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER NOT NULL,estado TEXT NOT NULL,FOREIGN KEY(cliente_id) REFERENCES cliente(id));
INSERT INTO cliente VALUES(1,'Ana'); INSERT INTO ticket VALUES(10,1,'ABIERTO');
SELECT ticket.id,cliente.nombre FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id;`,
    difficulty: "hard",
    xpReward: 40,
    testCases: [
      {
        description: "script completo",
        stdin: ``,
        expectedStdout: `10|Ana`,
        visible: true,
      },
      {
        description: "ejecución limpia",
        stdin: ``,
        expectedStdout: `10|Ana`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-final-reporte",
    title: "Reporte operativo",
    description: "Con fixture completo, devuelve cliente|tickets|costo total.",
    prompt: "Con fixture completo, devuelve cliente|tickets|costo total.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT cliente.nombre,COUNT(*),SUM(ticket.costo) FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id GROUP BY cliente.id,cliente.nombre ORDER BY cliente.nombre;`,
    difficulty: "hard",
    xpReward: 35,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);`,
        expectedStdout: `Ana|2|700
Luis|1|100
Mara|1|300`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT,ciudad TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER,estado TEXT,costo INTEGER); INSERT INTO cliente VALUES(1,'Eva','X'); INSERT INTO ticket VALUES(1,1,'A',20),(2,1,'B',30);`,
        expectedStdout: `Eva|2|50`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-final-normalizado",
    title: "Consulta normalizada",
    description: "Con cliente, técnico, ticket y asignación, devuelve ticket|cliente|técnico|horas.",
    prompt: "Con cliente, técnico, ticket y asignación, devuelve ticket|cliente|técnico|horas.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT ticket.id,cliente.nombre,tecnico.nombre,asignacion.horas FROM ticket JOIN cliente ON cliente.id=ticket.cliente_id JOIN asignacion ON asignacion.ticket_id=ticket.id JOIN tecnico ON tecnico.id=asignacion.tecnico_id ORDER BY ticket.id,tecnico.id;`,
    difficulty: "hard",
    xpReward: 40,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE tecnico(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER); CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER); INSERT INTO cliente VALUES(1,'Ana'); INSERT INTO tecnico VALUES(2,'Leo'),(3,'Sol'); INSERT INTO ticket VALUES(10,1); INSERT INTO asignacion VALUES(10,2,2),(10,3,1);`,
        expectedStdout: `10|Ana|Leo|2
10|Ana|Sol|1`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER,nombre TEXT); CREATE TABLE tecnico(id INTEGER,nombre TEXT); CREATE TABLE ticket(id INTEGER,cliente_id INTEGER); CREATE TABLE asignacion(ticket_id INTEGER,tecnico_id INTEGER,horas INTEGER); INSERT INTO cliente VALUES(8,'Eva'); INSERT INTO tecnico VALUES(5,'Noe'); INSERT INTO ticket VALUES(4,8); INSERT INTO asignacion VALUES(4,5,6);`,
        expectedStdout: `4|Eva|Noe|6`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
