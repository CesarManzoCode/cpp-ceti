import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "de-programa-a-proyecto",
  title: "De programa aislado a proyecto de software",
  description:
    "Reconoce que un proyecto incluye problema, personas, decisiones, artefactos y evidencia, no sólo código.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un programa puede resolver una operación puntual. Un **proyecto de software** intenta resolver un problema para personas concretas, durante un periodo, con restricciones y evidencia de que la solución cumple lo acordado.

Antes de escribir código aparecen preguntas que el compilador no responde: quién usa el sistema, qué necesita, qué queda fuera, cómo sabremos que funciona y quién aprueba un cambio.

Durante S5 usaremos un sistema de solicitudes de soporte. El código importa, pero también requisitos, modelos, commits, pruebas, cambios y entregables.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Problema", right: "Situación observable que justifica construir algo" },
        { left: "Requisito", right: "Condición que la solución debe satisfacer" },
        { left: "Implementación", right: "Código/configuración que materializa el diseño" },
        { left: "Evidencia", right: "Prueba o artefacto que verifica una afirmación" },
      ],
      explanation: "Proyecto conecta necesidad, decisión, construcción y evidencia.",
    },
    {
      type: "quiz",
      question:
        "Hay 800 líneas de C#, pero nadie puede decir qué problema resuelven ni cómo aceptar la entrega. ¿Qué falta primero?",
      options: ["Más clases", "Problema y requisitos verificables", "Optimización", "Otro lenguaje"],
      correctIndex: 1,
      explanation: "Más código no sustituye una definición verificable del objetivo.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Problema → {{0}} → diseño → implementación → {{1}}",
      blanks: [
        { answer: "requisitos", hint: "Expresan qué debe cumplirse." },
        { answer: "evidencia", hint: "Permite comprobarlo." },
      ],
      explanation:
        "La trazabilidad mínima conecta por qué existe una pieza y cómo se demuestra.",
    },
  ],
});
