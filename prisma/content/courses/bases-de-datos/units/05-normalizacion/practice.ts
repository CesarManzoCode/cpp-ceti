import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd1-normalizacion-separar-cliente",
    title: "Evitar repetición",
    description: "Con esquema ya normalizado, consulta ticket y nombre del cliente mediante JOIN.",
    prompt: "Con esquema ya normalizado, consulta ticket y nombre del cliente mediante JOIN.",
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
        description: "oculto",
        stdin: `CREATE TABLE cliente(id INTEGER PRIMARY KEY,nombre TEXT); CREATE TABLE ticket(id INTEGER PRIMARY KEY,cliente_id INTEGER); INSERT INTO cliente VALUES(5,'Eva'); INSERT INTO ticket VALUES(2,5),(9,5);`,
        expectedStdout: `2|Eva
9|Eva`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-normalizacion-telefonos",
    title: "Modelo 1:N",
    description:
      "Cuenta cuántos teléfonos tiene cada cliente; devuelve id|cantidad incluyendo sólo clientes con teléfonos.",
    prompt:
      "Cuenta cuántos teléfonos tiene cada cliente; devuelve id|cantidad incluyendo sólo clientes con teléfonos.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT cliente_id,COUNT(*) FROM telefono_cliente GROUP BY cliente_id ORDER BY cliente_id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE telefono_cliente(cliente_id INTEGER,telefono TEXT); INSERT INTO telefono_cliente VALUES(1,'a'),(1,'b'),(2,'c');`,
        expectedStdout: `1|2
2|1`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE telefono_cliente(cliente_id INTEGER,telefono TEXT); INSERT INTO telefono_cliente VALUES(9,'x');`,
        expectedStdout: `9|1`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd1-normalizacion-departamento",
    title: "Eliminar dependencia transitiva",
    description: "Consulta empleado|departamento usando tablas separadas.",
    prompt: "Consulta empleado|departamento usando tablas separadas.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `SELECT empleado.nombre,departamento.nombre FROM empleado JOIN departamento ON departamento.id=empleado.depto_id ORDER BY empleado.id;`,
    difficulty: "medium",
    xpReward: 25,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE departamento(id INTEGER,nombre TEXT); CREATE TABLE empleado(id INTEGER,nombre TEXT,depto_id INTEGER); INSERT INTO departamento VALUES(1,'TI'),(2,'Ventas'); INSERT INTO empleado VALUES(1,'Ana',1),(2,'Luis',2);`,
        expectedStdout: `Ana|TI
Luis|Ventas`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE departamento(id INTEGER,nombre TEXT); CREATE TABLE empleado(id INTEGER,nombre TEXT,depto_id INTEGER); INSERT INTO departamento VALUES(8,'Soporte'); INSERT INTO empleado VALUES(4,'Mara',8);`,
        expectedStdout: `Mara|Soporte`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
