import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "relacional-vs-documental",
  title: "Comparar sin caricaturas",
  description: "Elegir modelo por invariantes, acceso y evolución.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Relacional destaca en relaciones explícitas, constraints y consultas cruzadas. Documental facilita agregados autocontenidos y estructura flexible. Ambos pueden ser robustos o malos según modelado.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Muchas relaciones cruzadas/ad hoc", right: "Relacional suele encajar" },
        { left: "Agregado autocontenido leído junto", right: "Documental puede encajar" },
        { left: "Consistencia fuerte transversal", right: "Favorece modelo con constraints claros" },
        { left: "Esquema cambiante", right: "Documental puede reducir fricción" },
      ],
      explanation: "Son trade-offs.",
    },
    {
      type: "quiz",
      question: "¿Migrarías todo a Mongo sólo por 'flexibilidad'?",
      options: [
        "Sí",
        "No; primero patrón de datos/consultas/invariantes",
        "Siempre",
        "Sólo si hay JSON",
      ],
      correctIndex: 1,
      explanation: "Flexibilidad tiene costes.",
    },
    {
      type: "fill_blank",
      template: "modelo correcto = requisitos + invariantes + {{0}} de acceso",
      blanks: [{ answer: "patrones" }],
      explanation: "Decidir desde uso.",
    },
  ],
});
