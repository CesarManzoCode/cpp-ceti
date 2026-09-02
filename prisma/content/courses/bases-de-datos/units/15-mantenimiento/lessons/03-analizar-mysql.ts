import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "analizar-mysql",
  title: "Analizar mantenimiento en MySQL",
  description: "Conocer herramientas locales sin fingir portabilidad.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `MySQL expone información y comandos como \`ANALYZE TABLE\` y \`OPTIMIZE TABLE\`. Su impacto/semántica dependen del engine y versión, por lo que se practican localmente con medición antes/después.`,
    },
    {
      type: "code_example",
      code: `ANALYZE TABLE ticket;
OPTIMIZE TABLE ticket;`,
      explanation: "Ejemplos administrativos MySQL.",
      runnable: false,
      localOnlyNote: "Requiere MySQL local; medir antes/después y respaldar según riesgo.",
    },
    {
      type: "quiz",
      question: "¿Qué error evitar?",
      options: ["Medir", "Ejecutar OPTIMIZE como ritual universal", "Documentar", "Verificar"],
      correctIndex: 1,
      explanation: "La acción debe responder a un síntoma.",
    },
    {
      type: "matching",
      pairs: [
        { left: "ANALYZE TABLE", right: "Actualizar/analizar estadísticas según motor" },
        { left: "OPTIMIZE TABLE", right: "Reorganización específica" },
        { left: "backup", right: "Mitigación" },
        { left: "medición", right: "Justificación" },
      ],
      explanation: "Administra con evidencia.",
    },
  ],
});
