import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "componentes-sgbd",
  title: "Componentes y responsabilidades de un SGBD",
  description: "Reconoce esquema, motor, almacenamiento, consultas y administración.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `En este curso usamos "SGBD" como sistema que interpreta definiciones y consultas sobre datos persistentes.

Conceptualmente distinguimos: **esquema** (estructura declarada), **datos**, **motor** que ejecuta operaciones, lenguaje de definición/manipulación y herramientas de administración como respaldo/restauración.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Esquema", right: "Definición de tablas y restricciones" },
        { left: "Motor", right: "Ejecuta operaciones" },
        { left: "DDL", right: "Define estructura" },
        { left: "DML", right: "Modifica datos" },
        { left: "Backup", right: "Copia recuperable" },
      ],
      explanation: "Cada pieza responde a una responsabilidad distinta.",
    },
    {
      type: "quiz",
      question: "¿Dónde pertenece `CREATE TABLE`?",
      options: ["DML", "DDL", "Reporte", "Backup"],
      correctIndex: 1,
      explanation: "CREATE define estructura.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "{{0}} define la estructura; {{1}} modifica datos.",
      blanks: [
        { answer: "DDL" },
        { answer: "DML" },
      ],
      explanation: "La separación reaparece durante todo el curso.",
    },
  ],
});
