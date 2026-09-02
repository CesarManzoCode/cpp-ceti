import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "parametros",
  title: "Consultas parametrizadas",
  description: "Evitar concatenar entrada del usuario dentro de SQL.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `La entrada del usuario no debe convertirse en sintaxis SQL mediante concatenación. Los parámetros separan datos de código y son la defensa básica contra inyección SQL.`,
    },
    {
      type: "code_example",
      code: `// C# / MySQL — laboratorio local
using var cmd = connection.CreateCommand();
cmd.CommandText = "SELECT id,estado FROM ticket WHERE id=@id";
var p = cmd.CreateParameter();
p.ParameterName = "@id";
p.Value = id;
cmd.Parameters.Add(p);`,
      explanation: "El valor viaja como parámetro, no como fragmento SQL.",
      runnable: false,
      localOnlyNote: "Ejemplo C# local: requiere provider real configurado.",
    },
    {
      type: "quiz",
      question: "¿Qué patrón es inseguro?",
      options: [
        "CommandText = '...'+entradaUsuario",
        "Parámetro @id",
        "Validar tipos",
        "Mínimo privilegio",
      ],
      correctIndex: 0,
      explanation: "Concatenar permite que datos alteren sintaxis.",
    },
    {
      type: "matching",
      pairs: [
        { left: "SQL", right: "Código" },
        { left: "parámetro", right: "Dato" },
        { left: "concatenación", right: "Mezcla peligrosa" },
        { left: "mínimo privilegio", right: "Reduce impacto" },
      ],
      explanation: "Separa código y datos.",
    },
  ],
});
