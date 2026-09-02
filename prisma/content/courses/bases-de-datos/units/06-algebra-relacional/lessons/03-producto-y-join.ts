import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "producto-y-join",
  title: "Producto cartesiano y join",
  description: "Entiende que JOIN restringe combinaciones mediante una condición.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El producto cartesiano combina cada fila de A con cada fila de B. Casi nunca es el resultado final deseado; un join agrega una condición que conserva combinaciones relacionadas.

Pensar así evita joins "mágicos": primero existen pares posibles; \`ON cliente.id=ticket.cliente_id\` define cuáles representan hechos válidos.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "A × B", right: "Todas las combinaciones" },
        { left: "JOIN ... ON", right: "Combinaciones que cumplen condición" },
        { left: "FK", right: "Vínculo semántico que suele guiar el join" },
      ],
      explanation: "JOIN puede verse como producto + selección.",
    },
    {
      type: "quiz",
      question: "Olvidas `ON` entre 3 clientes y 4 tickets. ¿Cuántas combinaciones produce el cartesiano?",
      options: ["4", "7", "12", "1"],
      correctIndex: 2,
      explanation: "3×4=12.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT cliente.nombre,ticket.id FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id ORDER BY ticket.id;`,
      explanation: "El join reconstruye información normalizada.",
      runnable: true,
      expectedOutput: `Ana|10
Ana|11
Luis|12
Mara|13`,
    },
  ],
});
