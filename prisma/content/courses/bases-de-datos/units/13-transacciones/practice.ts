import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd2-tx-commit",
    title: "Transferencia",
    description: "Mueve 40 de cuenta 1 a 2 y COMMIT.",
    prompt: "Mueve 40 de cuenta 1 a 2 y COMMIT.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `BEGIN; UPDATE cuenta SET saldo=saldo-40 WHERE id=1; UPDATE cuenta SET saldo=saldo+40 WHERE id=2; COMMIT; SELECT id,saldo FROM cuenta ORDER BY id;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER); INSERT INTO cuenta VALUES(1,100),(2,20);`,
        expectedStdout: `1|60
2|60`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER); INSERT INTO cuenta VALUES(1,200),(2,0);`,
        expectedStdout: `1|160
2|40`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-tx-rollback",
    title: "Revertir",
    description: "Resta 25 y ROLLBACK.",
    prompt: "Resta 25 y ROLLBACK.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `BEGIN; UPDATE cuenta SET saldo=saldo-25 WHERE id=1; ROLLBACK; SELECT saldo FROM cuenta WHERE id=1;`,
    difficulty: "easy",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER); INSERT INTO cuenta VALUES(1,100);`,
        expectedStdout: `100`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER); INSERT INTO cuenta VALUES(1,77);`,
        expectedStdout: `77`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-tx-dos-tablas",
    title: "Ticket y pago",
    description: "Cierra ticket e inserta pago en la misma transacción.",
    prompt: "Cierra ticket e inserta pago en la misma transacción.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `BEGIN; UPDATE ticket SET estado='CERRADO' WHERE id=1; INSERT INTO pago(ticket_id,monto) VALUES(1,300); COMMIT; SELECT ticket.estado,pago.monto FROM ticket JOIN pago ON pago.ticket_id=ticket.id WHERE ticket.id=1;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE pago(ticket_id INTEGER,monto INTEGER); INSERT INTO ticket VALUES(1,'ABIERTO');`,
        expectedStdout: `CERRADO|300`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE pago(ticket_id INTEGER,monto INTEGER); INSERT INTO ticket VALUES(1,'EN_PROCESO');`,
        expectedStdout: `CERRADO|300`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-tx-revertir-dos",
    title: "Revertir dos tablas",
    description: "Haz cambios en ticket/pago y ROLLBACK.",
    prompt: "Haz cambios en ticket/pago y ROLLBACK.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `BEGIN; UPDATE ticket SET estado='CERRADO' WHERE id=1; INSERT INTO pago VALUES(1,300); ROLLBACK; SELECT estado,(SELECT COUNT(*) FROM pago) FROM ticket WHERE id=1;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE pago(ticket_id INTEGER,monto INTEGER); INSERT INTO ticket VALUES(1,'ABIERTO');`,
        expectedStdout: `ABIERTO|0`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE pago(ticket_id INTEGER,monto INTEGER); INSERT INTO ticket VALUES(1,'EN_PROCESO');`,
        expectedStdout: `EN_PROCESO|0`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-tx-invariante",
    title: "Conservar total",
    description: "Transfiere 10 y devuelve SUM(saldo).",
    prompt: "Transfiere 10 y devuelve SUM(saldo).",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `BEGIN; UPDATE cuenta SET saldo=saldo-10 WHERE id=1; UPDATE cuenta SET saldo=saldo+10 WHERE id=2; COMMIT; SELECT SUM(saldo) FROM cuenta;`,
    difficulty: "easy",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER); INSERT INTO cuenta VALUES(1,50),(2,50);`,
        expectedStdout: `100`,
        visible: true,
      },
      {
        description: "oculto",
        stdin: `CREATE TABLE cuenta(id INTEGER PRIMARY KEY,saldo INTEGER); INSERT INTO cuenta VALUES(1,80),(2,25);`,
        expectedStdout: `105`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
