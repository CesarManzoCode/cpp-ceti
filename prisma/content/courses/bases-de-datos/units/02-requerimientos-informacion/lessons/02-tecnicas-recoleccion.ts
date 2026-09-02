import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "tecnicas-recoleccion",
  title: "Entrevista, encuesta y observación",
  description: "Elige técnica de recolección según el tipo de evidencia.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una entrevista permite profundizar en reglas y excepciones. Una encuesta escala respuestas estructuradas. La observación revela cómo ocurre realmente el proceso y puede descubrir diferencias entre lo dicho y lo hecho.

No son competidoras: un análisis real puede combinarlas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Entrevista", right: "Explorar reglas y excepciones" },
        { left: "Encuesta", right: "Recoger respuestas comparables de muchas personas" },
        { left: "Observación", right: "Ver proceso real y datos que aparecen" },
      ],
      explanation: "La técnica depende de la pregunta.",
    },
    {
      type: "quiz",
      question:
        "El usuario afirma que siempre registra el número de serie, pero sospechas que en operación real no ocurre. ¿Qué técnica aporta evidencia directa?",
      options: ["Observación", "Sólo encuesta", "Normalización", "SQL"],
      correctIndex: 0,
      explanation: "Observar el proceso permite contrastar práctica y descripción.",
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Definir qué se quiere conocer",
        "Elegir técnica",
        "Recolectar evidencia",
        "Clasificar/filtrar datos",
        "Documentar requerimientos",
      ],
      explanation: "La recolección también necesita un objetivo.",
    },
  ],
});
