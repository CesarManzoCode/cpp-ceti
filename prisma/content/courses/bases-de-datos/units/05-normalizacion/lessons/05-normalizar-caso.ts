import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "normalizar-caso",
  title: "Normalizar una tabla de tickets",
  description: "Aplica 1FN→2FN→3FN a un caso completo.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Tabla inicial imaginaria:

\`ticket(folio, cliente_nombre, cliente_ciudad, tecnico1, tecnico2, servicio_codigo, servicio_nombre, costo)\`

Problemas: técnicos repetidos como columnas, datos de cliente repetidos, nombre de servicio dependiente de código.

Resultado conceptual:
- cliente
- ticket
- tecnico
- asignacion
- servicio
- ticket_servicio si hay multiplicidad

Normalizar es razonar sobre dependencias, no aplicar una receta ciega.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Identificar clave(s)",
        "Eliminar grupos repetidos (1FN)",
        "Eliminar dependencias parciales (2FN)",
        "Eliminar dependencias transitivas (3FN)",
        "Revisar consultas/reglas",
      ],
      explanation: "El orden ayuda a explicar cada separación.",
    },
    {
      type: "quiz",
      question: "Si `servicio_nombre` depende de `servicio_codigo`, ¿dónde debe vivir?",
      options: ["Ticket", "Servicio", "Cliente", "Asignacion"],
      correctIndex: 1,
      explanation: "Ambos describen el mismo hecho Servicio.",
    },
    {
      type: "matching",
      pairs: [
        { left: "cliente_nombre/ciudad", right: "Cliente" },
        { left: "folio/estado", right: "Ticket" },
        { left: "tecnico_nombre", right: "Tecnico" },
        { left: "horas por técnico-ticket", right: "Asignacion" },
      ],
      explanation: "Cada tabla agrupa hechos que dependen de su clave.",
    },
  ],
});
