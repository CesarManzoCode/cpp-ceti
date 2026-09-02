import { defineLesson } from "../../../../../authoring";

export const leccion01 = defineLesson({
  slug: "clave-y-valor",
  title: "Clave y valor: buscar por identidad",
  description:
    "Distingue una posición accidental de una clave del dominio y decide cuándo un diccionario representa mejor el acceso.",
  estimatedMinutes: 13,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `# Una clave responde “¿quién es?”, no “¿dónde está?”

En una lista, encontrar el producto \`P-104\` normalmente exige recorrer elementos hasta comparar su código. Esa búsqueda puede ser correcta, pero el código del producto ya es una **clave**: representa identidad dentro del inventario.

Un diccionario organiza pares **clave → valor**. En C# se expresa como \`Dictionary<TKey, TValue>\`:

- \`TKey\` es el tipo de la clave;
- \`TValue\` es el tipo del objeto o dato asociado.

Ejemplo: \`Dictionary<string, Producto>\` permite preguntar por el código del producto sin depender de su posición.

Una buena clave debe ser estable dentro del problema. El nombre visible de una persona puede repetirse; un número de registro suele ser mejor clave.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Producto
{
    public string Nombre { get; private set; }
    public Producto(string nombre) { Nombre = nombre; }
}

class Program
{
    static void Main()
    {
        Dictionary<string, Producto> porCodigo = new Dictionary<string, Producto>();
        porCodigo.Add("A1", new Producto("Mouse"));
        porCodigo.Add("B2", new Producto("Teclado"));

        Console.WriteLine(porCodigo["B2"].Nombre);
    }
}`,
      explanation:
        "la clave `B2` localiza el objeto. El índice del diccionario no es un número de posición: es una clave del dominio.",
      runnable: true,
      expectedOutput: `Teclado`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Código de producto único", right: "Buena clave de diccionario." },
        { left: "Posición 4 de una lista", right: "Ubicación accidental, no identidad." },
        {
          left: "Dictionary<string, Producto>",
          right: "Código de texto asociado a un objeto.",
        },
        {
          left: "Dos alumnos con el mismo nombre",
          right: "Señal de que el nombre no es una clave suficiente.",
        },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n` pares `codigo` y `precio` (cada dato en una línea) y guárdalos en un `Dictionary<string,int>`. Después lee un código que siempre existe e imprime `Precio: X` usando la clave.",
        starterCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        // diccionario y carga
        // consulta final
    }
}`,
        solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Dictionary<string, int> precios = new Dictionary<string, int>();
        for (int i = 0; i < n; i++)
        {
            string codigo = Console.ReadLine();
            int precio = int.Parse(Console.ReadLine());
            precios.Add(codigo, precio);
        }
        string buscado = Console.ReadLine();
        Console.WriteLine("Precio: " + precios[buscado]);
    }
}`,
        hints: [
          "el primer tipo genérico es la clave",
          "`Add(clave, valor)` registra el par",
          "consulta con `diccionario[clave]`",
        ],
        difficulty: "easy",
        xpReward: 24,
        testCases: [
          {
            visible: true,
            stdin: "2\nA1\n120\nB2\n80\nB2\n",
            expectedStdout: "Precio: 80\n",
          },
          {
            visible: false,
            stdin: "1\nX\n0\nX\n",
            expectedStdout: "Precio: 0\n",
          },
          {
            visible: false,
            stdin: "3\nP1\n10\nP2\n20\nP3\n30\nP1\n",
            expectedStdout: "Precio: 10\n",
          },
        ],
      },
    },
  ],
});
