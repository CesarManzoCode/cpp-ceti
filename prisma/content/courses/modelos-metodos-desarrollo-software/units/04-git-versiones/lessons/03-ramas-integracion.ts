import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "ramas-integracion",
  title: "Ramas e integración controlada",
  description:
    "Entiende cómo una rama aísla trabajo y qué implica integrar cambios con merge y resolver un conflicto.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una rama es un nombre que apunta a una línea de commits. Permite aislar una unidad de trabajo mientras \`main\` conserva una versión integrada.

Un merge combina historias. Un conflicto significa que Git necesita una decisión humana sobre la intención correcta.`,
    },
    {
      type: "code_completion",
      prompt: "Ordena los elementos.",
      lines: [
        "git switch -c feature/cierre-ticket",
        "# editar y probar",
        "git add ...",
        'git commit -m "Implementa cierre de tickets"',
        "git switch main",
        "git merge feature/cierre-ticket",
      ],
      explanation: "La rama contiene commits revisables antes de integrar.",
    },
    {
      type: "quiz",
      question: "¿Qué significa resolver bien un conflicto?",
      options: [
        "Elegir siempre ours",
        "Elegir siempre theirs",
        "Entender ambas intenciones, producir resultado correcto y probarlo",
        "Borrar archivo",
      ],
      correctIndex: 2,
      explanation: "El conflicto es una decisión semántica.",
    },
    {
      type: "matching",
      pairs: [
        { left: "branch", right: "Línea de trabajo nombrada" },
        { left: "merge", right: "Integración de historias" },
        { left: "conflicto", right: "Decisión que Git no puede resolver con seguridad" },
        { left: "main", right: "Línea integrada protegida" },
      ],
      explanation: "El valor está en aislar y revisar cambios.",
    },
  ],
});
