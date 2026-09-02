import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "problema-requisitos-plan",
  title: "Problema, requisitos y plan de fase",
  description: "Cierra el alcance de una primera entrega en cascada.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El integrador empieza con evidencia: problema observable, actores, alcance, requisitos funcionales/no funcionales y criterios de aceptación.

Después se crea lista de tareas y carta Gantt con dependencias. No se programa antes de poder explicar qué se va a aceptar.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Problema", right: "Solicitudes se pierden y no hay trazabilidad" },
        { left: "RF-01", right: "Empleado registra ticket" },
        { left: "RNF-01", right: "Sólo técnico asignado puede cerrar" },
        { left: "Criterio", right: "Dado ticket asignado, al cerrar conserva responsable" },
      ],
      explanation: "Cada artefacto reduce ambigüedad.",
    },
    {
      type: "quiz",
      question: "¿Qué falta si hay UML pero ningún requisito identificable?",
      options: [
        "Más clases",
        "Trazabilidad desde problema/requisito al diseño",
        "Otro lenguaje",
        "Más commits",
      ],
      correctIndex: 1,
      explanation: "El diseño necesita una razón verificable.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: `problema → {{0}} → UML/maqueta → tareas/Gantt → implementación`,
      blanks: [
        {
          answer: "requisitos",
          hint: "Definen qué debe cumplir la primera entrega.",
        },
      ],
      explanation: "El orden prepara una entrega de cascada documentada.",
    },
  ],
});
