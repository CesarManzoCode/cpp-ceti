import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "por-que-solid",
  title: "Por qué existen los principios SOLID",
  description: "Relaciona diseño con coste de cambio, pruebas y mantenimiento.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `SOLID no promete código “perfecto”. Son heurísticas para evitar dependencias y responsabilidades que hacen costoso cambiar el sistema.

Una mala señal: un cambio pequeño obliga a editar muchos lugares no relacionados o una clase cambia por razones completamente diferentes.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cambio toca demasiadas clases", right: "Acoplamiento alto" },
        { left: "Una clase cambia por UI y persistencia", right: "Responsabilidades mezcladas" },
        { left: "Nueva variante exige editar if central", right: "Posible cierre a extensión" },
        { left: "Test necesita infraestructura real", right: "Dependencias rígidas" },
      ],
      explanation: "Los síntomas dan contexto a los principios.",
    },
    {
      type: "quiz",
      question: "¿Qué objetivo describe mejor SOLID?",
      options: [
        "Maximizar clases",
        "Eliminar todos los if",
        "Hacer cambios más localizables y contratos más claros",
        "Usar interfaces siempre",
      ],
      correctIndex: 2,
      explanation: "Las siglas son medios, no fines.",
    },
    {
      type: "fill_blank",
      prompt: "Completa los espacios.",
      template: "Diseño mantenible = cambio {{0}} + contratos {{1}}",
      blanks: [
        { answer: "localizable", hint: "El cambio debe afectar el menor conjunto razonable." },
        { answer: "claros", hint: "Los consumidores deben saber qué pueden esperar." },
      ],
      explanation: "Resume el propósito operativo del bloque.",
    },
  ],
});
