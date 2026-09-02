import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "bd2-trigger-insert",
    title: "Auditar INSERT",
    description: "Crea trigger de INSERT, inserta ticket 5 y muestra auditoría.",
    prompt: "Crea trigger de INSERT, inserta ticket 5 y muestra auditoría.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TRIGGER audit_ticket AFTER INSERT ON ticket BEGIN INSERT INTO auditoria VALUES(NEW.id,'INSERT'); END; INSERT INTO ticket VALUES(5,'ABIERTO'); SELECT ticket_id,accion FROM auditoria;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT);`,
        expectedStdout: `5|INSERT`,
        visible: true,
      },
      {
        // Fixture DISTINTO del visible (auditoria ya trae una fila previa):
        // el pack original repetía el fixture visible sin cambios, lo que
        // dejaba el test oculto sin poder discriminar una solución
        // hardcodeada — ver tests/content/course-contract.test.ts, "un
        // output hardcodeado no puede pasar un ejercicio que lee stdin".
        description: "auditoría con entrada previa",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO auditoria VALUES(3,'INSERT');`,
        expectedStdout: `3|INSERT
5|INSERT`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-trigger-update",
    title: "Auditar UPDATE",
    description: "Registra OLD.estado>NEW.estado al cambiar id 1 a CERRADO.",
    prompt: "Registra OLD.estado>NEW.estado al cambiar id 1 a CERRADO.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TRIGGER audit_update AFTER UPDATE OF estado ON ticket BEGIN INSERT INTO auditoria VALUES(NEW.id,OLD.estado||'>'||NEW.estado); END; UPDATE ticket SET estado='CERRADO' WHERE id=1; SELECT ticket_id,accion FROM auditoria;`,
    difficulty: "hard",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(1,'ABIERTO');`,
        expectedStdout: `1|ABIERTO>CERRADO`,
        visible: true,
      },
      {
        description: "otro estado",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(1,'EN_PROCESO');`,
        expectedStdout: `1|EN_PROCESO>CERRADO`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-trigger-delete",
    title: "Auditar DELETE",
    description: "Registra OLD.id al borrar ticket 2.",
    prompt: "Registra OLD.id al borrar ticket 2.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TRIGGER audit_delete AFTER DELETE ON ticket BEGIN INSERT INTO auditoria VALUES(OLD.id,'DELETE'); END; DELETE FROM ticket WHERE id=2; SELECT ticket_id,accion FROM auditoria;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "visible",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(2,'CERRADO');`,
        expectedStdout: `2|DELETE`,
        visible: true,
      },
      {
        description: "otro estado",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE auditoria(ticket_id INTEGER,accion TEXT); INSERT INTO ticket VALUES(2,'ABIERTO');`,
        expectedStdout: `2|DELETE`,
        visible: false,
      },
    ],
  },
  {
    slug: "bd2-trigger-contador",
    title: "Contador automático",
    description: "Incrementa metricas.total tras INSERT y devuelve total.",
    prompt: "Incrementa metricas.total tras INSERT y devuelve total.",
    starterCode: `-- escribe tu SQL aquí
`,
    solutionCode: `CREATE TRIGGER inc_total AFTER INSERT ON ticket BEGIN UPDATE metricas SET total=total+1; END; INSERT INTO ticket VALUES(9,'ABIERTO'); SELECT total FROM metricas;`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        description: "parte de 2",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE metricas(total INTEGER); INSERT INTO metricas VALUES(2);`,
        expectedStdout: `3`,
        visible: true,
      },
      {
        description: "parte de 0",
        stdin: `CREATE TABLE ticket(id INTEGER PRIMARY KEY,estado TEXT); CREATE TABLE metricas(total INTEGER); INSERT INTO metricas VALUES(0);`,
        expectedStdout: `1`,
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
