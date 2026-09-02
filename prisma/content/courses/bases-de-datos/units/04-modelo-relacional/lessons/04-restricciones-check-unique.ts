import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "restricciones-check-unique",
  title: "UNIQUE y CHECK como reglas simples",
  description: "Mueve invariantes simples al esquema cuando corresponda.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una base relacional puede rechazar estados imposibles con restricciones. \`UNIQUE\` evita duplicados donde la unicidad es regla. \`CHECK\` restringe valores simples.

No toda regla de negocio cabe en un CHECK, pero las invariantes de datos básicas ganan valor si el SGBD también las protege.`,
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(
 id INTEGER PRIMARY KEY,
 folio TEXT NOT NULL UNIQUE,
 estado TEXT NOT NULL CHECK(estado IN ('ABIERTO','CERRADO'))
);
INSERT INTO ticket VALUES(1,'T-1','ABIERTO');
SELECT folio,estado FROM ticket;`,
      explanation: "UNIQUE protege folio y CHECK limita estado.",
      runnable: true,
      expectedOutput: `T-1|ABIERTO`,
    },
    {
      type: "quiz",
      question: "¿Cuál restricción protege que no existan dos tickets con mismo folio?",
      options: ["NOT NULL", "UNIQUE", "FOREIGN KEY", "ORDER BY"],
      correctIndex: 1,
      explanation: "UNIQUE expresa unicidad.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "estado TEXT NOT NULL {{0}}(estado IN ('ABIERTO','CERRADO'))",
      blanks: [{ answer: "CHECK" }],
      explanation: "CHECK valida valores admitidos.",
    },
  ],
});
