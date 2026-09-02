import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-normalizar",
  title: "Redundancia y anomalías",
  description: "Reconoce anomalías de inserción, actualización y eliminación.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Normalizar busca representar hechos una sola vez según sus dependencias. La meta no es "hacer más tablas"; es reducir redundancia que produce contradicciones.

Si cada ticket repite nombre y ciudad del cliente, cambiar su ciudad exige actualizar muchas filas. Olvidar una crea inconsistencia.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cambiar ciudad en 20 tickets", right: "Anomalía de actualización" },
        { left: "No poder registrar cliente sin ticket", right: "Anomalía de inserción" },
        { left: "Borrar último ticket elimina datos del cliente", right: "Anomalía de eliminación" },
      ],
      explanation: "Las anomalías revelan hechos mezclados.",
    },
    {
      type: "quiz",
      question: "¿Qué síntoma sugiere normalización insuficiente?",
      options: [
        "Cada hecho vive una vez",
        "El mismo nombre de cliente se repite en todas sus ventas",
        "Hay PK",
        "Hay FK",
      ],
      correctIndex: 1,
      explanation: "La repetición de hechos independientes crea riesgo.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "redundancia → anomalías → {{0}}",
      blanks: [{ answer: "normalización" }],
      explanation: "Normalizar responde a problemas concretos.",
    },
  ],
});
