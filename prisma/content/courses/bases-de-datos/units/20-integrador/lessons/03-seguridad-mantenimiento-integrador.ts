import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "seguridad-mantenimiento-integrador",
  title: "Permisos, respaldo y mantenimiento",
  description: "Cerrar el producto con operación segura básica.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La ruta relacional debe documentar roles/permisos mínimos, respaldo restaurable y una decisión de mantenimiento basada en evidencia. En ruta documental debe existir respaldo y control de acceso equivalente según herramienta.`,
    },
    {
      type: "code_completion",
      lines: [
        "Definir roles",
        "Aplicar mínimo privilegio",
        "Crear respaldo",
        "Restaurar/prueba",
        "Documentar mantenimiento",
      ],
      explanation: "Operación forma parte del producto.",
    },
    {
      type: "quiz",
      question: "¿Qué demuestra el backup?",
      options: [
        "Que existe un archivo",
        "Que puede restaurarse y verificarse",
        "Que la app compila",
        "Que hay un usuario",
      ],
      correctIndex: 1,
      explanation: "Restore probado es evidencia.",
    },
    {
      type: "fill_blank",
      template: "backup + {{0}} probado",
      blanks: [{ answer: "restore" }],
      explanation: "Recuperación real.",
    },
  ],
});
