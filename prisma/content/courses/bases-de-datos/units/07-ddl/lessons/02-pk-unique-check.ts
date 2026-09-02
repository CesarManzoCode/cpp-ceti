import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "pk-unique-check",
  title: "Restricciones en DDL",
  description: "Aplica PK, UNIQUE y CHECK en el esquema.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Las restricciones hacen que datos inválidos fallen temprano.

- PRIMARY KEY: identidad.
- UNIQUE: evita duplicados.
- CHECK: condición local.
- NOT NULL: obligatoriedad.

Decláralas sólo cuando responden a una regla real.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "PRIMARY KEY", right: "Identidad" },
        { left: "UNIQUE", right: "Unicidad alternativa" },
        { left: "CHECK", right: "Predicado local" },
        { left: "NOT NULL", right: "Obligatoriedad" },
      ],
      explanation: "Cada restricción expresa una clase de regla.",
    },
    {
      type: "quiz",
      question: "Folio debe ser único pero `id` ya es PK. ¿Qué usar?",
      options: ["UNIQUE en folio", "Otra PK", "ORDER BY", "DELETE"],
      correctIndex: 0,
      explanation: "UNIQUE expresa una clave candidata no elegida como PK.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE ticket(
 id INTEGER PRIMARY KEY,
 folio TEXT NOT NULL UNIQUE,
 costo INTEGER NOT NULL CHECK(costo>=0)
);
INSERT INTO ticket VALUES(1,'T-1',0);
SELECT folio,costo FROM ticket;`,
      explanation: "El SGBD protege dos invariantes.",
      runnable: true,
      expectedOutput: `T-1|0`,
    },
  ],
});
