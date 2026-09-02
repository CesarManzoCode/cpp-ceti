import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "buscar-seguro",
  title: "Búsqueda segura con TryGetValue",
  description:
    "Consulta claves que pueden no existir sin convertir la ausencia en una excepción accidental.",
  estimatedMinutes: 14,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# “No existe” también es un resultado normal

El indexador \`diccionario[clave]\` asume que la clave existe. Si no existe, lanza una excepción. Eso es útil cuando la ausencia indica un error de programación, pero una búsqueda de usuario normalmente puede fallar sin que el programa esté roto.

Dos herramientas comunes:

- \`ContainsKey(clave)\`: pregunta primero y luego accedes.
- \`TryGetValue(clave, out valor)\`: pregunta y recupera en una sola operación.

\`TryGetValue\` devuelve \`true\` si encontró la clave y deja el objeto en la variable \`out\`. Si devuelve \`false\`, puedes responder “no encontrado” de manera explícita.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        Dictionary<string, int> stock = new Dictionary<string, int>();
        stock.Add("A1", 4);

        int cantidad;
        if (stock.TryGetValue("B2", out cantidad))
            Console.WriteLine(cantidad);
        else
            Console.WriteLine("No encontrado");
    }
}`,
      explanation:
        "la ausencia de `B2` sigue el flujo normal del `if`; no depende de capturar una excepción.",
      runnable: true,
      expectedOutput: `No encontrado`,
    },
    {
      type: "fill_blank",
      prompt:
        "completa una consulta segura que recupera el stock sólo si existe la clave.",
      template: `int stock;
if (inventario.{{0}}(codigo, {{1}} stock))
{
    Console.WriteLine(stock);
}
else
{
    Console.WriteLine("NO");
}`,
      blanks: [{ answer: "TryGetValue" }, { answer: "out" }],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n` pares `codigo`/`stock`, crea un diccionario y después lee `q` consultas. Para cada código consultado imprime su stock o `NO` si la clave no existe. Usa `TryGetValue`.",
        starterCode: `using System;
using System.Collections.Generic;
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Dictionary<string, int> stock = new Dictionary<string, int>();
        for (int i = 0; i < n; i++)
        {
            string codigo = Console.ReadLine();
            stock[codigo] = int.Parse(Console.ReadLine());
        }

        int q = int.Parse(Console.ReadLine());
        for (int i = 0; i < q; i++)
        {
            string codigo = Console.ReadLine();
            int cantidad;
            if (stock.TryGetValue(codigo, out cantidad)) Console.WriteLine(cantidad);
            else Console.WriteLine("NO");
        }
    }
}`,
        hints: [
          "declara la variable antes de `TryGetValue`",
          "el segundo argumento lleva `out`",
          "cada consulta produce exactamente una línea",
        ],
        difficulty: "easy",
        xpReward: 26,
        testCases: [
          {
            visible: true,
            stdin: "2\nA\n5\nB\n2\n3\nA\nX\nB\n",
            expectedStdout: "5\nNO\n2\n",
          },
          {
            visible: false,
            stdin: "1\nZ\n0\n2\nZ\nY\n",
            expectedStdout: "0\nNO\n",
          },
          {
            visible: false,
            stdin: "3\nA\n1\nB\n2\nC\n3\n1\nC\n",
            expectedStdout: "3\n",
          },
        ],
      },
    },
  ],
});
