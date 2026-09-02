import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "integrador-modelo",
  title: "Integrador I: necesidades, ER y normalización",
  description: "Cierra el diseño antes de implementar SQL.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Proyecto: base de datos para una pequeña empresa de soporte técnico.

Entregables de diseño:
1. problema y actores;
2. necesidades de información;
3. entidades/atributos;
4. cardinalidades;
5. modelo relacional;
6. justificación de normalización hasta 3FN para los casos del proyecto.

No se acepta un diagrama desconectado de las consultas que debe soportar.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Necesidad", right: "Tickets abiertos por técnico" },
        { left: "ER", right: "Técnico↔Ticket" },
        { left: "Relacional", right: "asignacion con FKs" },
        { left: "Normalización", right: "Hechos de técnico fuera de asignacion" },
      ],
      explanation: "El diseño mantiene trazabilidad.",
    },
    {
      type: "quiz",
      question: "¿Qué debe justificar una tabla nueva?",
      options: [
        "Que queda bonita",
        "Un hecho/relación necesario y su dependencia",
        "Que tiene muchas columnas",
        "Que el SGBD la permite",
      ],
      correctIndex: 1,
      explanation: "Cada relación debe representar hechos del dominio.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "necesidad → ER → modelo relacional → {{0}}",
      blanks: [{ answer: "normalización" }],
      explanation: "Después llega DDL.",
    },
  ],
});
