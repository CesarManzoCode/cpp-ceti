import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "update-delete",
  title: "Update y Delete con confirmación",
  description: "Evitar cambios accidentales por falta de identidad/alcance.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `UPDATE y DELETE deben operar por identidad estable y verificar cuántas filas cambiaron. La UI debería confirmar acciones destructivas apropiadas y reportar si el registro ya no existe.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "UPDATE ... WHERE id=@id", right: "Cambio acotado" },
        { left: "DELETE ... WHERE id=@id", right: "Borrado acotado" },
        { left: "sin WHERE", right: "Riesgo masivo" },
        { left: "rows affected", right: "Evidencia de efecto" },
      ],
      explanation: "El alcance es parte del contrato.",
    },
    {
      type: "quiz",
      question: "¿Qué señal indica posible conflicto/no encontrado?",
      options: ["0 filas afectadas", "1 fila", "Commit", "SELECT"],
      correctIndex: 0,
      explanation: "No se cambió el objetivo esperado.",
    },
    {
      type: "fill_blank",
      template: "UPDATE/DELETE + {{0}} estable",
      blanks: [{ answer: "id" }],
      explanation: "Identifica la fila.",
    },
  ],
});
