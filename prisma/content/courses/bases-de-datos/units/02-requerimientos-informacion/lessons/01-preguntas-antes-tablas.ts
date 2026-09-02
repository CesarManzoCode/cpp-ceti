import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "preguntas-antes-tablas",
  title: "Preguntas antes que tablas",
  description: "Parte de decisiones y consultas necesarias antes de diseñar estructura.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Diseñar una base empezando por nombres de tablas suele producir estructura sin propósito. Primero pregunta qué necesita saber cada actor.

Ejemplo: "¿qué tickets abiertos tiene cada técnico?" obliga a conservar ticket, estado, asignación y técnico. La **consulta futura** ayuda a descubrir datos necesarios.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "¿Quién reportó el ticket?", right: "Cliente/usuario reportante" },
        { left: "¿Quién lo atiende?", right: "Técnico/asignación" },
        { left: "¿Está pendiente?", right: "Estado" },
        { left: "¿Cuánto costó?", right: "Costo del servicio" },
      ],
      explanation: "Las necesidades de información revelan hechos a modelar.",
    },
    {
      type: "quiz",
      question: "¿Qué debería ocurrir antes de crear tablas?",
      options: [
        "Elegir colores",
        "Identificar necesidades y reglas de información",
        "Crear 20 columnas genéricas",
        "Agregar índices",
      ],
      correctIndex: 1,
      explanation: "El esquema nace de requerimientos, no al revés.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "pregunta de negocio → datos necesarios → {{0}} → consultas",
      blanks: [{ answer: "modelo" }],
      explanation: "El modelo organiza datos para responder preguntas.",
    },
  ],
});
