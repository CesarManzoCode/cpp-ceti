import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "reproducir-antes-corregir",
  title: "Reproducir antes de corregir",
  description: "Separar síntoma, causa, reproducción y fix.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Un buen mantenimiento correctivo empieza por una reproducción mínima. Sin ella no sabes si arreglaste la causa o sólo moviste el síntoma.

Registra entrada, estado inicial, resultado esperado y resultado real. Después reduce el caso hasta conservar el fallo.`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Síntoma", right: "Lo observable que está mal" },
        { left: "Reproducción", right: "Pasos/datos que lo hacen aparecer" },
        { left: "Causa", right: "Condición interna que lo provoca" },
        { left: "Fix", right: "Cambio que elimina causa sin romper contrato" },
      ],
      explanation: "No confundir lo que se ve con por qué sucede.",
    },
    {
      type: "quiz",
      question: "¿Cuál es mejor primer paso ante un bug intermitente?",
      options: [
        "Reescribir módulo",
        "Capturar condiciones y reproducción mínima",
        "Agregar try/catch global",
        "Cambiar arquitectura",
      ],
      correctIndex: 1,
      explanation: "La evidencia reduce hipótesis.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Bug: `Promedio` divide entre cantidad cero. Corrige para devolver 0 si cantidad<=0, si no total/cantidad entero.",
        starterCode: `using System; class Program{static int Promedio(int total,int cantidad){return total/cantidad;}static void Main(){int t=int.Parse(Console.ReadLine());int c=int.Parse(Console.ReadLine());Console.WriteLine(Promedio(t,c));}}`,
        solutionCode: `using System; class Program{static int Promedio(int total,int cantidad){if(cantidad<=0)return 0;return total/cantidad;}static void Main(){int t=int.Parse(Console.ReadLine());int c=int.Parse(Console.ReadLine());Console.WriteLine(Promedio(t,c));}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            stdin: "100\n4\n",
            expectedStdout: "25\n",
            visible: true,
            description: "Normal",
          },
          {
            stdin: "100\n0\n",
            expectedStdout: "0\n",
            visible: false,
            description: "Reproducción bug",
          },
          {
            stdin: "5\n-1\n",
            expectedStdout: "0\n",
            visible: false,
            description: "Inválido",
          },
        ],
      },
    },
  ],
});
