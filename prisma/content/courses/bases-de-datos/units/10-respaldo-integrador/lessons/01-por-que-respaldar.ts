import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-respaldar",
  title: "Qué protege un respaldo",
  description: "Distingue respaldo de disponibilidad y define qué debe poder recuperarse.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un respaldo es una copia recuperable de datos/esquema para responder a pérdida o corrupción. Tener un archivo llamado \`backup\` no demuestra nada: debe existir una restauración verificable.

Frecuencia, retención y ubicación dependen del impacto de perder datos.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Backup", right: "Copia recuperable" },
        { left: "Restore", right: "Reconstruir estado desde respaldo" },
        { left: "Prueba de restore", right: "Evidencia de que el respaldo sirve" },
        { left: "Retención", right: "Cuánto historial se conserva" },
      ],
      explanation: "Respaldar sin restaurar de prueba deja una suposición.",
    },
    {
      type: "quiz",
      question: "¿Cuál es la mejor evidencia de un backup útil?",
      options: [
        "El archivo existe",
        "Se restauró en entorno limpio y las verificaciones pasaron",
        "Pesa mucho",
        "Tiene fecha",
      ],
      correctIndex: 1,
      explanation: "La recuperación probada demuestra utilidad.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "backup + prueba de {{0}} = evidencia de recuperación",
      blanks: [{ answer: "restore" }],
      explanation: "La restauración cierra el ciclo.",
    },
  ],
});
