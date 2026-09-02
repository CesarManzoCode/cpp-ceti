import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "grant-revoke",
  title: "GRANT y REVOKE en MySQL",
  description: "Leer sintaxis real como laboratorio local.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `MySQL ofrece usuarios, roles, GRANT y REVOKE. SQLite no implementa este modelo de seguridad, por lo que el ejemplo no es ejecutable en plataforma.`,
    },
    {
      type: "code_example",
      code: `CREATE ROLE 'report_reader';
GRANT SELECT ON soporte.* TO 'report_reader';
GRANT 'report_reader' TO 'analista'@'localhost';
REVOKE INSERT ON soporte.* FROM 'analista'@'localhost';`,
      explanation: "Concede/revoca privilegios.",
      runnable: false,
      localOnlyNote: "Requiere MySQL 8.x local y privilegios administrativos.",
    },
    {
      type: "quiz",
      question: "¿Por qué local-only?",
      options: [
        "SELECT no existe",
        "SQLite no implementa usuarios/GRANT como MySQL",
        "Es NoSQL",
        "Sólo UI",
      ],
      correctIndex: 1,
      explanation: "Capacidad específica.",
    },
    {
      type: "matching",
      pairs: [
        { left: "GRANT", right: "Conceder" },
        { left: "REVOKE", right: "Retirar" },
        { left: "ROLE", right: "Agrupar" },
        { left: "ALL PRIVILEGES", right: "Evitar por defecto" },
      ],
      explanation: "Administra explícitamente.",
    },
  ],
});
