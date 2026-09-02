import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "composicion-consulta",
  title: "Componer operaciones",
  description: "Traduce una pregunta en secuencia de operaciones relacionales.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Pregunta: "nombres de clientes de GDL con tickets cerrados".

Razonamiento:
1. seleccionar clientes GDL;
2. seleccionar tickets cerrados;
3. unir por cliente_id;
4. proyectar nombre;
5. eliminar duplicados si la pregunta pide clientes únicos.

El SQL final es más fácil cuando primero entiendes la transformación.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Seleccionar clientes GDL",
        "Seleccionar tickets CERRADO",
        "Join Cliente↔Ticket",
        "Proyectar nombre",
        "Eliminar duplicados si corresponde",
      ],
      explanation: "La consulta es una composición de operaciones.",
    },
    {
      type: "quiz",
      question: "¿Por qué `DISTINCT` puede ser necesario al proyectar clientes con muchos tickets?",
      options: [
        "Porque JOIN no funciona",
        "Porque un cliente puede aparecer varias veces",
        "Porque WHERE duplica tablas",
        "Porque PK falla",
      ],
      correctIndex: 1,
      explanation: "La multiplicidad del join puede repetir un nombre.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT DISTINCT cliente.nombre FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id WHERE cliente.ciudad='GDL' AND ticket.estado='CERRADO' ORDER BY cliente.nombre;`,
      explanation: "La consulta compone selección, join y proyección.",
      runnable: true,
      expectedOutput: `Ana
Mara`,
    },
  ],
});
