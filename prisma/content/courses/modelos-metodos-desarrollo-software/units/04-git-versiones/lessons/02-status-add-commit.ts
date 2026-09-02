import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "status-add-commit",
  title: "Inspeccionar antes de registrar",
  description:
    "Usa status, diff, add y commit como un ciclo de evidencia antes de registrar cambios.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `\`git status\` responde qué está modificado/preparado. \`git diff\` muestra cambios no staged y \`git diff --cached\` lo que realmente entrará al commit.

El hábito clave es comparar el mensaje con el diff.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "git status", right: "Estado resumido" },
        { left: "git diff", right: "Cambios no staged" },
        { left: "git diff --cached", right: "Cambios preparados" },
        { left: "git add", right: "Seleccionar para commit" },
        { left: "git commit", right: "Registrar snapshot" },
      ],
      explanation: "Cada comando responde una pregunta.",
    },
    {
      type: "quiz",
      question:
        "Descubres una contraseña dentro del diff antes de commit. ¿Qué haces?",
      options: [
        "Commit y luego borrar",
        "No registrarla; retirarla y usar configuración/secretos adecuados",
        "Cambiar mensaje",
        "Agregar README",
      ],
      correctIndex: 1,
      explanation:
        "Evitar introducir secretos es mucho más barato que limpiar historial.",
    },
    {
      type: "matching",
      pairs: [
        { left: "Cambio lógico pequeño", right: "Commit enfocado" },
        { left: "Refactor + feature sin relación", right: "Separar" },
        { left: "Archivo generado innecesario", right: "gitignore" },
        { left: "Secreto", right: "Configuración externa" },
      ],
      explanation: "El historial también es un artefacto de calidad.",
    },
  ],
});
