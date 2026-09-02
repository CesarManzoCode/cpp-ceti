import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "gui-conexion-integrador",
  title: "Conexión e interfaz CRUD",
  description: "Construir la aplicación local sin mezclar responsabilidades.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La app local debe abrir conexión mediante configuración externa, usar consultas parametrizadas, separar UI de acceso a datos y demostrar Create/Read/Update/Delete.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "UI", right: "Entrada/presentación" },
        { left: "Servicio", right: "Reglas" },
        { left: "Acceso datos", right: "Queries/driver" },
        { left: "config externa", right: "Credenciales" },
      ],
      explanation: "Arquitectura mínima.",
    },
    {
      type: "quiz",
      question: "¿Qué NO debe estar hardcodeado?",
      options: ["Título", "Credenciales de producción", "Nombre de pantalla", "Texto botón"],
      correctIndex: 1,
      explanation: "Secreto fuera del repo.",
    },
    {
      type: "fill_blank",
      template: "UI → lógica → acceso a datos → {{0}}",
      blanks: [{ answer: "SGBD" }],
      explanation: "Flujo.",
    },
  ],
});
