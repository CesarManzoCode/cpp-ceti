import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "relacional-en-una-frase",
  title: "Qué significa relacional",
  description:
    "Entiende tablas, filas, atributos y relaciones sin confundir \"relación\" con sólo una llave foránea.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `El modelo relacional representa información mediante **relaciones** que solemos visualizar como tablas. Cada fila representa una tupla y cada columna un atributo con significado definido.

Relacionar información exige atributos que permitan identificar y vincular hechos sin duplicarlos innecesariamente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "tabla/relation", right: "Conjunto estructurado de filas" },
        { left: "fila/tupla", right: "Una ocurrencia" },
        { left: "columna/atributo", right: "Propiedad definida" },
        { left: "clave", right: "Atributo(s) que identifican o vinculan" },
      ],
      explanation: "Este vocabulario será la base para normalización y SQL.",
    },
    {
      type: "quiz",
      question: "En una tabla `cliente(id,nombre)`, ¿qué representa una fila?",
      options: ["Una columna", "Un cliente registrado", "Todo el esquema", "El SGBD"],
      correctIndex: 1,
      explanation: "La fila es una ocurrencia del tipo de hecho modelado.",
    },
    {
      type: "code_example",
      code: `CREATE TABLE cliente(id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);
INSERT INTO cliente VALUES (1,'Ana'),(2,'Luis');
SELECT id,nombre FROM cliente ORDER BY id;`,
      explanation: "El ejemplo sólo anticipa la forma final: estructura + datos + consulta.",
      runnable: true,
      expectedOutput: `1|Ana
2|Luis`,
    },
  ],
});
