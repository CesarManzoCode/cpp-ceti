import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "tablas-y-dominios",
  title: "Relaciones, atributos y dominios",
  description: "Traduce entidades a relaciones con columnas de significado claro.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Al pasar a modelo relacional, una entidad suele convertirse en relación/tabla y sus atributos en columnas. Cada atributo debe tener un dominio coherente: tipo y reglas admitidas.

El tipo SQL no reemplaza el significado. \`TEXT\` no dice si un valor representa nombre, estado o folio.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cliente", right: "tabla" },
        { left: "id_cliente", right: "clave primaria" },
        { left: "nombre", right: "atributo" },
        { left: "TEXT/INTEGER", right: "dominio físico aproximado" },
      ],
      explanation: "El esquema combina significado y representación.",
    },
    {
      type: "quiz",
      question: "¿Qué error es más grave?",
      options: [
        "Usar nombres claros",
        "Guardar `estado`, `nombre` y `folio` en una sola columna genérica",
        "Definir PK",
        "Separar entidades",
      ],
      correctIndex: 1,
      explanation: "Una columna debe representar un atributo coherente.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Entidad → {{0}}; atributo → columna.",
      blanks: [{ answer: "tabla" }],
      explanation: "Es la traducción inicial del ER.",
    },
  ],
});
