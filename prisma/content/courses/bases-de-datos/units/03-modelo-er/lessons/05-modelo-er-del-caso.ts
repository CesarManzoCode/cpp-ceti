import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "modelo-er-del-caso",
  title: "Construir el ER del sistema de soporte",
  description: "Integra entidades, claves y cardinalidades del dominio recurrente.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Modelo base del curso:

- Cliente 1:N Equipo
- Cliente 1:N Ticket
- Equipo 1:N Ticket
- Técnico N:M Ticket mediante Asignación
- Asignación conserva horas

Este modelo es un punto de partida didáctico. Cada relación debe justificarse por las necesidades declaradas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cliente", right: "id_cliente" },
        { left: "Equipo", right: "id_equipo" },
        { left: "Ticket", right: "id_ticket" },
        { left: "Tecnico", right: "id_tecnico" },
        { left: "Asignacion", right: "id_ticket + id_tecnico" },
      ],
      explanation: "La asociativa puede usar clave compuesta.",
    },
    {
      type: "quiz",
      question: "¿Qué entidad rompe directamente el N:M Técnico↔Ticket?",
      options: ["Cliente", "Equipo", "Asignacion", "Estado"],
      correctIndex: 2,
      explanation: "Asignacion representa cada vínculo técnico-ticket.",
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Identificar necesidades",
        "Definir entidades",
        "Elegir identificadores",
        "Agregar atributos",
        "Definir relaciones/cardinalidades",
        "Revisar contra consultas",
      ],
      explanation: "El modelo debe volver a las preguntas originales.",
    },
  ],
});
