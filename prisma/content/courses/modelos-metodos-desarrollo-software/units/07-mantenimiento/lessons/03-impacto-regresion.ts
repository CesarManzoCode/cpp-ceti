import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "impacto-regresion",
  title: "Impacto y regresión de un cambio",
  description: "Identificar qué comportamiento anterior necesita protección.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Cambiar una regla no autoriza a romper las demás. Antes del fix, identifica consumidores, casos existentes e invariantes.

Después del cambio ejecuta pruebas nuevas y regresiones relevantes. No hace falta probar "todo el universo", sino cubrir aquello que el cambio puede afectar razonablemente.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Cambio en cálculo de prioridad", right: "Pruebas de límites de prioridad" },
        { left: "Cambio sólo de texto", right: "Pruebas de reglas de dominio no son foco" },
        { left: "Cambio en autorización", right: "Matriz de roles/acciones" },
        { left: "Cambio en transición", right: "Estados válidos e inválidos" },
      ],
      explanation: "El área de regresión sigue dependencias del cambio.",
    },
    {
      type: "quiz",
      question: "Añades descuento a clientes con convenio. ¿Qué prueba anterior debes conservar?",
      options: [
        "Sólo convenio=true",
        "Caso sin convenio para demostrar que precio anterior no cambió",
        "Sólo UI",
        "Ninguna",
      ],
      correctIndex: 1,
      explanation: "La regresión protege el comportamiento previo.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Tarifa anterior: base 100 + 50 si ALTA. Cambio: convenio descuenta 20%. Conserva caso sin convenio.",
        starterCode: `using System; class Program{static int Total(string p,bool conv){return 0;}static void Main(){string p=Console.ReadLine();bool c=Console.ReadLine()=="SI";Console.WriteLine(Total(p,c));}}`,
        solutionCode: `using System; class Program{static int Total(string p,bool conv){int t=100;if(p=="ALTA")t+=50;if(conv)t=t*80/100;return t;}static void Main(){string p=Console.ReadLine();bool c=Console.ReadLine()=="SI";Console.WriteLine(Total(p,c));}}`,
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            stdin: "ALTA\nNO\n",
            expectedStdout: "150\n",
            visible: true,
            description: "Regresión",
          },
          {
            stdin: "ALTA\nSI\n",
            expectedStdout: "120\n",
            visible: false,
            description: "Cambio",
          },
          {
            stdin: "BAJA\nNO\n",
            expectedStdout: "100\n",
            visible: false,
            description: "Anterior",
          },
        ],
      },
    },
  ],
});
