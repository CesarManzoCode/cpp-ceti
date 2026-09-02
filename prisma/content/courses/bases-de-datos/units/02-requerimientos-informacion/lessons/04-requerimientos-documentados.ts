import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "requerimientos-documentados",
  title: "Documento de requerimientos de información",
  description: "Escribe requerimientos que luego puedan mapearse al modelo.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un requerimiento de información debe decir qué se necesita conocer, sobre qué entidades/hechos y con qué reglas relevantes.

Ejemplo: "El sistema debe permitir consultar tickets por cliente y estado, conservando quién los atiende y su costo final." Esto ya orienta el modelo sin imponer tablas concretas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Necesidad", right: "Consultar tickets abiertos" },
        { left: "Dato", right: "Estado" },
        { left: "Regla", right: "Un ticket tiene un cliente" },
        { left: "Reporte", right: "Tickets abiertos por cliente" },
      ],
      explanation: "El documento conecta preguntas con datos/reglas.",
    },
    {
      type: "quiz",
      question: "¿Cuál enunciado es demasiado técnico para esta fase?",
      options: [
        "Consultar tickets por cliente",
        "Conservar fecha de cierre",
        "Usar exactamente tres índices B-tree",
        "Registrar técnico asignado",
      ],
      correctIndex: 2,
      explanation: "El índice es una decisión física prematura para BD I.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Requerimiento → entidades/hechos → atributos → {{0}}",
      blanks: [{ answer: "relaciones" }],
      explanation: "El siguiente paso es modelar.",
    },
  ],
});
