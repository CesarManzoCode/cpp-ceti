import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "ventajas-limites-cascada",
  title: "Ventajas, límites y contexto",
  description: "Elige cascada sólo cuando sus supuestos encajan con el problema.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Cascada facilita planificación, documentación e hitos claros cuando el problema es estable y el coste de cambio es alto. Puede fallar cuando el usuario descubre lo que necesita al ver versiones reales, porque el feedback llega tarde.

La pregunta útil no es "¿cascada es buena o mala?", sino **qué incertidumbre existe y cuánto cuesta descubrir tarde un error**.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Requisitos regulatorios estables", right: "Cascada puede encajar bien" },
        { left: "Producto nuevo con necesidades inciertas", right: "Riesgo de feedback tardío" },
        { left: "Contrato con entregables formales", right: "Trazabilidad útil" },
        { left: "Interfaz experimental", right: "Conviene feedback temprano" },
      ],
      explanation: "El contexto decide qué ventaja o desventaja pesa más.",
    },
    {
      type: "quiz",
      question: "¿Cuál es un riesgo típico si los requisitos cambian mucho?",
      options: [
        "No permite documentación",
        "El aprendizaje del usuario puede llegar después de comprometer diseño/implementación",
        "Prohíbe pruebas",
        "No puede usar Git",
      ],
      correctIndex: 1,
      explanation:
        "El problema es el coste de corregir decisiones tomadas con información incompleta.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template:
        "Si la incertidumbre es {{0}} y el costo de cambio tardío es {{1}}, necesito feedback temprano.",
      blanks: [
        { answer: "alta", hint: "Hay mucho por descubrir." },
        { answer: "alto", hint: "Corregir tarde es costoso." },
      ],
      explanation: "Es una heurística, no una ley universal.",
    },
  ],
});
