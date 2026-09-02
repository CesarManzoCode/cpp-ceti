import { defineLesson } from "../../../../../authoring";

export const leccion06 = defineLesson({
  slug: "reporte-negocio",
  title: "Construir un reporte útil",
  description: "Combina join, filtro, agrupación y orden para responder una decisión.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Reporte: "por cliente, cuántos tickets cerrados y cuánto costo acumulan".

Necesita Cliente↔Ticket, seleccionar cerrados, agrupar por cliente y sumar. El valor del query no es su complejidad sino que responde una pregunta definida.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Unir Cliente↔Ticket",
        "Filtrar CERRADO",
        "Agrupar por cliente",
        "Calcular COUNT/SUM",
        "Ordenar reporte",
      ],
      explanation: "La consulta compleja se diseña por etapas.",
    },
    {
      type: "quiz",
      question: "¿Qué información NO hace falta para ese reporte?",
      options: ["Cliente", "Estado", "Costo", "Color favorito del técnico"],
      correctIndex: 3,
      explanation: "Sólo conserva datos justificados por la pregunta.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, ciudad TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana','GDL'),(2,'Luis','Zapopan'),(3,'Mara','GDL');
CREATE TABLE ticket(id INTEGER PRIMARY KEY, cliente_id INTEGER NOT NULL, estado TEXT NOT NULL, costo INTEGER NOT NULL);
INSERT INTO ticket VALUES (10,1,'ABIERTO',200),(11,1,'CERRADO',500),(12,2,'ABIERTO',100),(13,3,'CERRADO',300);
SELECT cliente.nombre,COUNT(*),SUM(ticket.costo)
FROM cliente JOIN ticket ON ticket.cliente_id=cliente.id
WHERE ticket.estado='CERRADO'
GROUP BY cliente.id,cliente.nombre
ORDER BY cliente.nombre;`,
      explanation: "El resultado puede alimentar una decisión.",
      runnable: true,
      expectedOutput: `Ana|1|500
Mara|1|300`,
    },
  ],
});
