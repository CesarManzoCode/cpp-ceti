import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "repositorio-snapshot",
  title: "Repositorio, historial y snapshot",
  description:
    "Reconoce qué conserva Git en cada commit y por qué un commit representa una unidad de cambio coherente.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un repositorio guarda historial de snapshots relacionados. Un commit útil significa "este conjunto de cambios representa una decisión coherente y puedo describirla".

Control de versiones permite comparar, revisar, regresar y coordinar. No sustituye backups ni pruebas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "working tree", right: "Archivos como están ahora" },
        { left: "staging area", right: "Selección preparada" },
        { left: "commit", right: "Snapshot identificado" },
        { left: "repository", right: "Historial/objetos versionados" },
      ],
      explanation: "Distinguir estados evita comandos a ciegas.",
    },
    {
      type: "quiz",
      question: "¿Cuál mensaje es más útil?",
      options: ["cambios", "asdf", "Implementa validación de transición de ticket", "viernes"],
      correctIndex: 2,
      explanation: "Comunica intención y permite rastrear decisiones.",
    },
    {
      type: "code_completion",
      prompt: "Ordena los elementos.",
      lines: [
        "git status",
        "git add <archivos>",
        "git diff --cached",
        'git commit -m "mensaje"',
        "git log --oneline",
      ],
      explanation: "Inspecciona, selecciona, revisa y registra.",
    },
  ],
});
