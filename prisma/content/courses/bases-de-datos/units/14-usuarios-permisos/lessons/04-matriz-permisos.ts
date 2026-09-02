import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "matriz-permisos",
  title: "Matriz de permisos",
  description: "Traducir responsabilidades a privilegios revisables.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Antes de crear usuarios, documenta una matriz: operador CRUD limitado, analista lectura, migrador DDL, administrador mantenimiento.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Operador", right: "CRUD limitado" },
        { left: "Analista", right: "SELECT" },
        { left: "Migrador", right: "DDL" },
        { left: "Admin", right: "Administración" },
      ],
      explanation: "Hace auditable el diseño.",
    },
    {
      type: "quiz",
      question: "¿Qué es más auditable?",
      options: [
        "Todos root",
        "Roles nombrados con permisos explícitos",
        "Contraseña compartida",
        "Permisos improvisados",
      ],
      correctIndex: 1,
      explanation: "Permite revisión.",
    },
    {
      type: "fill_blank",
      template: "actor → responsabilidad → {{0}} → privilegios",
      blanks: [{ answer: "rol" }],
      explanation: "La autorización nace del trabajo real.",
    },
  ],
});
