import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "de-arreglos-a-colecciones",
  title: "De arreglos fijos a colecciones",
  description:
    "Reconoce cuándo el tamaño fijo de un arreglo deja de representar bien un conjunto de objetos.",
  estimatedMinutes: 13,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `# El problema no es el arreglo: es conocer el tamaño de antemano

Un arreglo funciona muy bien cuando la cantidad de elementos está definida desde el inicio. Si declaras \`Producto[] productos = new Producto[20]\`, reservaste exactamente veinte lugares.

En un inventario real normalmente no sabes cuántos productos existirán mañana. Puedes llenar el arreglo, dejar huecos o copiar todo a uno más grande, pero entonces empiezas a programar manualmente el crecimiento de una estructura que debería ayudarte a resolver el problema.

Una **colección dinámica** separa dos ideas:

- cuántos elementos existen ahora;
- cuánta memoria necesita internamente para guardarlos.

En C#, \`List<T>\` representa una secuencia cuyo tamaño puede crecer o disminuir. \`T\` indica qué tipo de elementos admite: \`List<int>\`, \`List<string>\`, \`List<Producto>\`.

No reemplaza a todos los arreglos. Si el tamaño es fijo por naturaleza, un arreglo sigue siendo una opción válida. La elección depende del problema.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<string> productos = new List<string>();

        productos.Add("Mouse");
        productos.Add("Teclado");
        productos.Add("Monitor");

        Console.WriteLine("Cantidad: " + productos.Count);
        Console.WriteLine(productos[1]);
    }
}`,
      explanation:
        "`Add` incorpora un elemento sin que el programa tenga que calcular un nuevo tamaño. `Count` es la cantidad real de elementos y el acceso por índice conserva la idea conocida de los arreglos.",
      runnable: true,
      expectedOutput: `Cantidad: 3
Teclado`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Producto[30]", right: "Cantidad máxima conocida de antemano." },
        {
          left: "List<Producto>",
          right: "Cantidad de objetos que puede crecer o disminuir.",
        },
        { left: "Count", right: "Cantidad actual de elementos." },
        { left: "Add", right: "Agrega un elemento al final." },
      ],
      explanation:
        "Una colección dinámica no elimina los índices; elimina la obligación de fijar el tamaño útil antes de conocer los datos.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n`, después `n` enteros. Guarda todos los valores en un `List<int>`. Al final imprime primero `Cantidad: X` y después `Suma: Y`.\n\nNo calcules la cantidad con una variable paralela: usa `Count` de la lista.",
        starterCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        List<int> valores = new List<int>();

        // agrega los n valores

        // imprime Count y la suma
    }
}`,
        solutionCode: `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        List<int> valores = new List<int>();

        for (int i = 0; i < n; i++)
        {
            valores.Add(int.Parse(Console.ReadLine()));
        }

        int suma = 0;
        for (int i = 0; i < valores.Count; i++)
        {
            suma += valores[i];
        }

        Console.WriteLine("Cantidad: " + valores.Count);
        Console.WriteLine("Suma: " + suma);
    }
}`,
        hints: [
          "Crea `new List<int>()` una sola vez.",
          "Usa `Add` dentro del primer `for`.",
          "El segundo recorrido debe terminar en `valores.Count`.",
        ],
        difficulty: "easy",
        xpReward: 24,
        testCases: [
          {
            visible: true,
            stdin: "3\n4\n5\n6\n",
            expectedStdout: "Cantidad: 3\nSuma: 15\n",
          },
          {
            visible: false,
            stdin: "1\n-7\n",
            expectedStdout: "Cantidad: 1\nSuma: -7\n",
          },
          {
            visible: false,
            stdin: "5\n0\n2\n0\n8\n-3\n",
            expectedStdout: "Cantidad: 5\nSuma: 7\n",
          },
        ],
      },
    },
  ],
});
