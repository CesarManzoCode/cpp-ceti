import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "entidades-atributos",
  title: "Entidades y atributos",
  description: "Identifica entidades del dominio y atributos que realmente las describen.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una entidad representa un tipo de cosa o hecho con identidad relevante para el sistema. Un atributo describe una propiedad.

No todo sustantivo merece entidad. \`Ciudad\` puede ser sólo atributo si no tiene identidad/reglas propias; podría convertirse en entidad si el sistema administra catálogo, regiones u otras relaciones.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cliente", right: "Entidad" },
        { left: "nombre de cliente", right: "Atributo" },
        { left: "Ticket", right: "Entidad" },
        { left: "estado de ticket", right: "Atributo" },
      ],
      explanation: "La frontera depende del dominio.",
    },
    {
      type: "quiz",
      question: "¿Cuál criterio favorece modelar algo como entidad?",
      options: [
        "Tiene identidad y participa en relaciones/reglas propias",
        "Es una palabra larga",
        "Aparece una vez",
        "Es texto",
      ],
      correctIndex: 0,
      explanation: "La identidad y comportamiento informacional son claves.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Entidad: {{0}}; atributo: propiedad de esa entidad.",
      blanks: [{ answer: "tipo de objeto/hecho con identidad" }],
      explanation: "No confundas objeto modelado con una de sus propiedades.",
    },
  ],
});
