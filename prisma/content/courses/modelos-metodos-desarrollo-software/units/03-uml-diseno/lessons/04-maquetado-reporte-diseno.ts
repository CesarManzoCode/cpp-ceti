import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "maquetado-reporte-diseno",
  title: "Maquetado y reporte de diseño",
  description: "Usa maquetas para validar flujo antes de comprometer implementación.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una maqueta permite detectar barato qué información se pide, qué acciones existen y cómo navega el usuario.

El reporte de diseño debe conectar: problema → requisitos → casos de uso/UML → maquetas → decisiones. No es una colección de capturas sin explicación.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Folio sólo lectura", right: "Identidad estable" },
        { left: "Cerrar oculto a empleado", right: "Autorización" },
        { left: "Historial visible", right: "Trazabilidad" },
        { left: "Pantalla separada de alta", right: "Decisión de flujo que debe justificarse" },
      ],
      explanation: "Cada elemento importante necesita un motivo.",
    },
    {
      type: "quiz",
      question: "¿Qué hallazgo debe regresar a requisitos antes de programar?",
      options: [
        "Nadie sabe qué significa prioridad y cada usuario la interpreta distinto",
        "El borde no gusta",
        "Aún no hay código",
        "El commit es pequeño",
      ],
      correctIndex: 0,
      explanation: "Ambigüedad de significado es un problema de requisito/dominio.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Problema → requisitos → {{0}} → maqueta → implementación",
      blanks: [{ answer: "diseño", hint: "Transforma necesidades en una solución antes de codificar." }],
      explanation: "La maqueta valida diseño, no sustituye análisis.",
    },
  ],
});
