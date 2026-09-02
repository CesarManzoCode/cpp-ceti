import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "evolucion-sistemas-datos",
  title: "De archivos aislados a SGBD",
  description: "Explica qué problemas resuelve un gestor frente a archivos dispersos.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Archivos sueltos pueden funcionar al inicio, pero duplican datos, dificultan búsquedas simultáneas y vuelven frágiles las reglas de integridad.

Un SGBD centraliza mecanismos para definir estructura, consultar, modificar, controlar acceso, respaldar y recuperar información. No elimina la necesidad de buen diseño.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Duplicación de cliente en muchos archivos", right: "Redundancia" },
        { left: "Dos nombres distintos para el mismo cliente", right: "Inconsistencia" },
        { left: "No poder relacionar ticket con técnico", right: "Falta de modelo" },
        { left: "Recuperar tras pérdida", right: "Necesidad de respaldo" },
      ],
      explanation: "Los problemas de datos motivan mecanismos del SGBD.",
    },
    {
      type: "quiz",
      question: "¿Qué afirmación es correcta?",
      options: [
        "Un SGBD corrige automáticamente un mal modelo",
        "Un SGBD ofrece herramientas, pero el diseño sigue siendo responsabilidad del equipo",
        "SQL reemplaza requisitos",
        "Una tabla siempre equivale a un archivo",
      ],
      correctIndex: 1,
      explanation: "Herramienta y modelo son responsabilidades diferentes.",
    },
    {
      type: "code_completion",
      prompt: "Ordena correctamente.",
      lines: [
        "Necesidad de información",
        "Modelo de datos",
        "Estructura en SGBD",
        "Datos",
        "Consultas/reportes",
      ],
      explanation: "La tecnología aparece después de entender qué información se necesita.",
    },
  ],
});
