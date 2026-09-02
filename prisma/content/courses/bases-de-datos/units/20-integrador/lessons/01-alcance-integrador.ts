import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "alcance-integrador",
  title: "Elegir problema y alcance",
  description: "Definir un CRUD demostrable conectado a una base.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El integrador continúa el sistema de soporte. Debe tener problema, necesidades, modelo y un CRUD desde interfaz. El alumno elige una ruta principal: relacional avanzada o documental; puede comparar la otra como extensión.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Problema", right: "Qué se resuelve" },
        { left: "Necesidades", right: "Información requerida" },
        { left: "Modelo", right: "Estructura" },
        { left: "CRUD", right: "Interacción" },
        { left: "Reporte", right: "Evidencia/reflexión" },
      ],
      explanation: "Los entregables se conectan.",
    },
    {
      type: "quiz",
      question: "¿Qué debe existir antes de la GUI?",
      options: ["Modelo y necesidades", "Colores", "Logo", "Animación"],
      correctIndex: 0,
      explanation: "La interfaz gestiona un modelo, no lo reemplaza.",
    },
    {
      type: "fill_blank",
      template: "problema → necesidades → {{0}} → conexión → CRUD",
      blanks: [{ answer: "modelado" }],
      explanation: "Trazabilidad.",
    },
  ],
});
