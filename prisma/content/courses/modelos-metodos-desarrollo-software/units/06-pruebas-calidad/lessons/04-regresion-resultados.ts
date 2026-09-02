import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "regresion-resultados",
  title: "Regresión y documentación de resultados",
  description:
    "Convierte un defecto corregido en protección repetible y registra evidencia.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `Una regresión es comportamiento que antes funcionaba y dejó de hacerlo. Al corregir un bug, captura un caso que lo reproduzca; después queda como protección.

Documentar resultados significa guardar qué se probó, entradas relevantes, esperado, obtenido y estado. "Probado" sin evidencia no permite reproducir nada.`,
    },
    {
      type: "code_example",
      code: `using System;
class Tarifas{public static int Calcular(int h){return h<=1?100:100+(h-1)*50;}}
class Program{static void Main(){Console.WriteLine(Tarifas.Calcular(1)==100?"OK":"FALLO");Console.WriteLine(Tarifas.Calcular(3)==200?"OK":"FALLO");}}`,
      runnable: true,
      expectedOutput: `OK
OK`,
      explanation: "Las afirmaciones capturan comportamiento repetible.",
    },
    {
      type: "quiz",
      question:
        "Corriges un bug que ocurría con cantidad=50. ¿Qué evita mejor que vuelva?",
      options: [
        "Comentario",
        "Agregar caso de regresión con 50 y mantenerlo",
        "Renombrar método",
        "No tocar archivo",
      ],
      correctIndex: 1,
      explanation:
        "El caso automatizado convierte defecto histórico en condición verificable.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Costo: primera hora 100, cada adicional 50; 0 o negativo devuelve 0.",
        starterCode: `using System; class Program{static int Costo(int horas){return 0;}static void Main(){Console.WriteLine(Costo(int.Parse(Console.ReadLine())));}}`,
        solutionCode: `using System; class Program{static int Costo(int horas){if(horas<=0)return 0;return 100+(horas-1)*50;}static void Main(){Console.WriteLine(Costo(int.Parse(Console.ReadLine())));}}`,
        difficulty: "easy",
        xpReward: 25,
        testCases: [
          {
            stdin: "1\n",
            expectedStdout: "100\n",
            visible: true,
            description: "Primera",
          },
          {
            stdin: "3\n",
            expectedStdout: "200\n",
            visible: false,
            description: "Adicionales",
          },
          {
            stdin: "0\n",
            expectedStdout: "0\n",
            visible: false,
            description: "Cero",
          },
          {
            stdin: "-2\n",
            expectedStdout: "0\n",
            visible: false,
            description: "Negativo",
          },
        ],
      },
    },
  ],
});
