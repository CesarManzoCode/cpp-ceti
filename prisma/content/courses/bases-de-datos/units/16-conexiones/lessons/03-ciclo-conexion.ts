import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "ciclo-conexion",
  title: "Abrir, usar, cerrar",
  description: "Gestionar el ciclo de vida de la conexión.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una conexión es un recurso. Debe abrirse cuando se necesita, usarse de forma controlada y liberarse aun ante error. Pools y detalles de producción quedan fuera del alcance, pero el principio de ciclo de vida sí importa.`,
    },
    {
      type: "code_completion",
      lines: [
        "Construir configuración segura",
        "Abrir conexión",
        "Ejecutar comando parametrizado",
        "Procesar resultado",
        "Cerrar/liberar",
      ],
      explanation: "El recurso debe cerrarse incluso ante fallo.",
    },
    {
      type: "quiz",
      question: "¿Qué debe ocurrir si falla la query?",
      options: [
        "Dejar conexión abierta",
        "Liberar recursos en ruta de error",
        "Reintentar infinito",
        "Mostrar password",
      ],
      correctIndex: 1,
      explanation: "Evita fugas y exposición.",
    },
    {
      type: "fill_blank",
      template: "abrir → usar → {{0}}",
      blanks: [{ answer: "cerrar" }],
      explanation: "Ciclo básico.",
    },
  ],
});
