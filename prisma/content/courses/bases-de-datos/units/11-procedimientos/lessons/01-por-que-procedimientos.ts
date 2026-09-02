import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-procedimientos",
  title: "Por qué modularizar dentro del SGBD",
  description: "Entender el contrato de un procedimiento almacenado.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un procedimiento almacenado encapsula una operación nombrada dentro del SGBD. Puede recibir parámetros, ejecutar varias sentencias y concentrar reglas cerca de los datos. No es automáticamente mejor que lógica en la aplicación: su valor aparece cuando centralización, permisos o reutilización lo justifican.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Operación repetida", right: "Candidata a encapsulación" },
        { left: "Parámetro", right: "Entrada" },
        { left: "Efecto", right: "Cambio observable" },
        { left: "CALL", right: "Invocación MySQL" },
      ],
      explanation: "Primero entiende el contrato.",
    },
    {
      type: "quiz",
      question: "¿Qué beneficio puede aportar un procedimiento?",
      options: [
        "Evitar diseñar",
        "Centralizar una operación reutilizable",
        "Eliminar transacciones",
        "Reemplazar permisos",
      ],
      correctIndex: 1,
      explanation: "Modulariza una operación bien definida.",
    },
    {
      type: "fill_blank",
      template: "procedimiento = nombre + {{0}} + operación + efecto",
      blanks: [{ answer: "parámetros" }],
      explanation: "El contrato debe ser explícito.",
    },
  ],
});
