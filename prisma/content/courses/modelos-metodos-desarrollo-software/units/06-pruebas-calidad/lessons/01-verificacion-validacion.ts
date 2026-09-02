import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "verificacion-validacion",
  title: "Verificación y validación",
  description:
    "Distingue construir conforme a especificación de construir lo que se necesita.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `**Verificación:** ¿construimos conforme a requisitos/diseño?
**Validación:** ¿el producto resuelve la necesidad de uso?

Un sistema puede verificar perfectamente una especificación equivocada. Calidad necesita ambas preguntas.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Comparar salida con REQ-03", right: "Verificación" },
        { left: "Usuario prueba flujo real", right: "Validación" },
        { left: "Revisar UML contra requisitos", right: "Verificación" },
        { left: "Piloto con técnicos reales", right: "Validación" },
      ],
      explanation: "La fuente de verdad cambia según la pregunta.",
    },
    {
      type: "quiz",
      question:
        "Pruebas automatizadas pasan, pero el usuario no puede completar su trabajo. ¿Qué falló principalmente?",
      options: [
        "Compilación",
        "Validación contra necesidad real",
        "Git",
        "Sintaxis",
      ],
      correctIndex: 1,
      explanation:
        "Pasar casos escritos no garantiza haber especificado el problema correcto.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt: "`EsValida(descripcion)` acepta longitud 5..80 inclusive.",
        starterCode: `using System; class Program{static bool EsValida(string d){return false;}static void Main(){Console.WriteLine(EsValida(Console.ReadLine())?"VALIDA":"INVALIDA");}}`,
        solutionCode: `using System; class Program{static bool EsValida(string d){return d.Length>=5&&d.Length<=80;}static void Main(){Console.WriteLine(EsValida(Console.ReadLine())?"VALIDA":"INVALIDA");}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            stdin: "ABCDE\n",
            expectedStdout: "VALIDA\n",
            visible: true,
            description: "Mínimo",
          },
          {
            stdin: "ABCD\n",
            expectedStdout: "INVALIDA\n",
            visible: false,
            description: "Debajo",
          },
          {
            stdin: "1234567890\n",
            expectedStdout: "VALIDA\n",
            visible: false,
            description: "Dentro",
          },
        ],
      },
    },
  ],
});
