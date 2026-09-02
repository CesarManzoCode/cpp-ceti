import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "crud-capas",
  title: "CRUD no es pegar SQL en botones",
  description: "Separar UI, lógica y acceso a datos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una interfaz CRUD debe separar captura/presentación de datos, reglas de aplicación y acceso al SGBD. Un botón no debería construir SQL concatenando strings.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Formulario", right: "Entrada/salida UI" },
        { left: "Servicio", right: "Reglas" },
        { left: "Repositorio/DAO", right: "Acceso a datos" },
        { left: "SGBD", right: "Persistencia" },
      ],
      explanation: "Separar responsabilidades facilita pruebas.",
    },
    {
      type: "quiz",
      question: "¿Dónde debe vivir SQL de persistencia?",
      options: [
        "Dentro del texto del botón",
        "Capa de acceso a datos",
        "En etiquetas UI",
        "En CSS",
      ],
      correctIndex: 1,
      explanation: "Evita acoplar UI a persistencia.",
    },
    {
      type: "fill_blank",
      template: "UI → lógica → {{0}} → DB",
      blanks: [{ answer: "acceso a datos" }],
      explanation: "Capas mínimas.",
    },
  ],
});
