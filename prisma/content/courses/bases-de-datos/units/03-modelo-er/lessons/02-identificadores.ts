import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "identificadores",
  title: "Identificadores y claves candidatas",
  description: "Elige identificadores estables sin usar atributos cambiantes.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una clave candidata identifica de forma única una ocurrencia. La clave primaria selecciona una de ellas como identificador principal del modelo relacional.

Un nombre humano suele ser mal identificador porque puede repetirse o cambiar. Un folio de ticket puede ser natural si su unicidad y estabilidad son reglas del negocio.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "id_cliente", right: "Identificador artificial estable" },
        { left: "folio_ticket", right: "Posible clave natural" },
        { left: "nombre_cliente", right: "Mala clave si puede repetirse" },
        { left: "correo", right: "Sólo clave si unicidad/estabilidad son reglas" },
      ],
      explanation: "La clave necesita propiedades explícitas.",
    },
    {
      type: "quiz",
      question: "Dos clientes pueden llamarse Ana. ¿Debe `nombre` ser PK?",
      options: ["Sí", "No", "Sólo si es TEXT", "Sólo con SQLite"],
      correctIndex: 1,
      explanation: "Un identificador debe ser único.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Una buena clave debe ser {{0}} y estable.",
      blanks: [{ answer: "única" }],
      explanation: "La estabilidad evita que relaciones dependan de datos cambiantes.",
    },
  ],
});
