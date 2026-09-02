import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "conexion-local",
  title: "Laboratorio de conexión real",
  description: "Conectar una app de consola a MySQL y comprobar CRUD mínimo.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Laboratorio local: crear una DB de prueba, un usuario limitado, configurar un provider C# compatible y ejecutar SELECT parametrizado. Las credenciales nunca se commitean.`,
    },
    {
      type: "code_completion",
      lines: [
        "Crear DB/usuario de laboratorio",
        "Guardar credenciales fuera del repo",
        "Abrir conexión",
        "Ejecutar SELECT parametrizado",
        "Cerrar conexión",
        "Guardar evidencia",
      ],
      explanation: "Secuencia reproducible.",
    },
    {
      type: "quiz",
      question: "¿Dónde NO guardar password?",
      options: [
        "Variable de entorno/local secret",
        "Archivo .env ignorado",
        "Código fuente versionado",
        "Secret manager",
      ],
      correctIndex: 2,
      explanation: "No entra al historial.",
    },
    {
      type: "fill_blank",
      template: "credencial → configuración {{0}}, no código",
      blanks: [{ answer: "externa" }],
      explanation: "Separa secreto de fuente.",
    },
  ],
});
