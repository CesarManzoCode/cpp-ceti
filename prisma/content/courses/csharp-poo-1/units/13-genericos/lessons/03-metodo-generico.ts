import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "metodo-generico",
  title: "Métodos genéricos",
  description:
    "Parametriza una operación puntual sin volver genérica toda la clase que la contiene.",
  estimatedMinutes: 15,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# A veces la reutilización pertenece al método

No necesitas \`class Utilidades<T>\` si sólo una operación depende del tipo. Un **método genérico** declara su propio parámetro:

\`\`\`csharp
static void Intercambiar<T>(ref T a, ref T b)
\`\`\`

La clase que contiene el método puede seguir siendo normal. Al llamar, C# suele inferir \`T\` desde los argumentos.

\`ref\` permite que el método reemplace las variables del llamador. Aquí se usa porque intercambiar exige modificar ambas referencias/valores originales; no es una propiedad especial de los genéricos.`,
    },
    {
      type: "code_example",
      code: `using System;
class Program
{
    static void Intercambiar<T>(ref T a, ref T b)
    {
        T temp=a; a=b; b=temp;
    }
    static void Main()
    {
        string a="uno", b="dos";
        Intercambiar<string>(ref a,ref b);
        Console.WriteLine(a+" "+b);

        int x=3,y=8;
        Intercambiar<int>(ref x,ref y);
        Console.WriteLine(x+" "+y);
    }
}`,
      explanation:
        "una sola operación funciona con texto y enteros; `T temp` conserva exactamente el tipo de la llamada.",
      runnable: true,
      expectedOutput: `dos uno
8 3`,
    },
    {
      type: "code_completion",
      lines: ["T temp = a;", "a = b;", "b = temp;"],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Escribe `static T Primero<T>(List<T> datos)` que devuelva el primer elemento. Lee dos strings y dos enteros, crea una lista de cada tipo e imprime el primer elemento de ambas usando el mismo método genérico.",
        starterCode: `using System;
using System.Collections.Generic;
class Program
{
    static T Primero<T>(List<T> datos) { /* completa */ }
    static void Main() { }
}`,
        solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static T Primero<T>(List<T> datos) { return datos[0]; }
    static void Main()
    {
        List<string> textos=new List<string>();
        textos.Add(Console.ReadLine()); textos.Add(Console.ReadLine());
        List<int> numeros=new List<int>();
        numeros.Add(int.Parse(Console.ReadLine())); numeros.Add(int.Parse(Console.ReadLine()));
        Console.WriteLine(Primero<string>(textos));
        Console.WriteLine(Primero<int>(numeros));
    }
}`,
        hints: [
          "el retorno es `T`.",
          "la lista del parámetro también usa `T`.",
          "no conviertas a `object` ni a `string`.",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: "A\nB\n3\n4\n",
            expectedStdout: "A\n3\n",
          },
          {
            visible: false,
            stdin: "Cable HDMI\nX\n0\n9\n",
            expectedStdout: "Cable HDMI\n0\n",
          },
          {
            visible: false,
            stdin: "Z\nY\n-2\n-1\n",
            expectedStdout: "Z\n-2\n",
          },
        ],
      },
    },
  ],
});
