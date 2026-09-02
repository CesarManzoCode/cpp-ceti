import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "tercera-forma-normal",
  title: "Dependencias transitivas",
  description: "Separa atributos no clave que dependen de otros atributos no clave.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `En \`empleado(id, depto_id, depto_nombre)\`, \`depto_nombre\` depende de \`depto_id\`, no directamente del empleado. Es una dependencia transitiva a través de otro atributo no clave.

Separar Departamento evita repetir su nombre por cada empleado.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "empleado.id", right: "Clave de empleado" },
        { left: "depto_id", right: "FK al departamento" },
        { left: "depto_nombre", right: "Hecho del departamento" },
      ],
      explanation: "3FN busca que los atributos no clave describan la clave, no otros atributos no clave.",
    },
    {
      type: "quiz",
      question: "¿Dónde debe almacenarse `depto_nombre`?",
      options: ["Empleado", "Departamento", "En ambos", "En ninguna"],
      correctIndex: 1,
      explanation: "Es propiedad del departamento.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "dependencia transitiva → separar {{0}}",
      blanks: [{ answer: "entidad" }],
      explanation: "La tabla resultante representa hechos más claros.",
    },
  ],
});
