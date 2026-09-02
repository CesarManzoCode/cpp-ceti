import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "identidad-autorizacion",
  title: "Identidad y autorización",
  description: "Separar quién es una cuenta de qué puede hacer.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un usuario de base de datos es una identidad del SGBD. Los privilegios determinan operaciones permitidas. El login de la aplicación y el usuario del SGBD pueden ser capas distintas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Usuario", right: "Identidad SGBD" },
        { left: "Privilegio", right: "Operación permitida" },
        { left: "Rol", right: "Conjunto de privilegios" },
        { left: "Autorización", right: "Permitir/denegar" },
      ],
      explanation: "Separa conceptos.",
    },
    {
      type: "quiz",
      question: "¿Qué expresa un rol?",
      options: ["Contraseña", "Conjunto reutilizable de permisos", "Tabla", "Transacción"],
      correctIndex: 1,
      explanation: "Agrupa privilegios.",
    },
    {
      type: "fill_blank",
      template: "usuario → rol → {{0}}",
      blanks: [{ answer: "privilegios" }],
      explanation: "Modelo común.",
    },
  ],
});
