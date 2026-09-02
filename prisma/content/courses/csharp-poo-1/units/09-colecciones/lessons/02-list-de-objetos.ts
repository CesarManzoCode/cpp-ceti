import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "list-de-objetos",
  title: "Listas de objetos",
  description:
    "Guarda objetos completos en una lista y recorre sus propiedades sin perder el modelo orientado a objetos.",
  estimatedMinutes: 15,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Una colección organiza objetos, no reemplaza sus responsabilidades

\`List<Producto>\` significa que cada posición guarda una referencia a un objeto \`Producto\`. La colección sabe **organizar** la secuencia; \`Producto\` sigue siendo responsable de representar un producto válido.

Esto evita un error común: mantener arreglos paralelos como \`nombres[]\`, \`precios[]\` y \`stocks[]\`. Con objetos, los datos que pertenecen a la misma entidad viajan juntos.

La lista ofrece operaciones de colección (\`Add\`, \`Remove\`, \`Count\`, índice). Las reglas del dominio siguen dentro de las clases.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Producto
{
    public string Nombre { get; private set; }
    public int Stock { get; private set; }

    public Producto(string nombre, int stock)
    {
        Nombre = nombre;
        Stock = stock;
    }
}

class Program
{
    static void Main()
    {
        List<Producto> productos = new List<Producto>();
        productos.Add(new Producto("Mouse", 4));
        productos.Add(new Producto("Teclado", 7));

        for (int i = 0; i < productos.Count; i++)
        {
            Console.WriteLine(productos[i].Nombre + ": " + productos[i].Stock);
        }
    }
}`,
      explanation:
        "cada elemento de la lista es un `Producto`. El recorrido obtiene una entidad completa y luego consulta sus propiedades.",
      runnable: true,
      expectedOutput: `Mouse: 4
Teclado: 7`,
    },
    {
      type: "fill_blank",
      prompt:
        "completa el tipo genérico, la creación de la lista y la operación de alta.",
      template: `List<{{0}}> productos = new {{1}}<Producto>();
Producto p = new Producto("Cable", 5);
productos.{{2}}(p);`,
      blanks: [
        { answer: "Producto" },
        { answer: "List" },
        { answer: "Add" },
      ],
      explanation:
        "el tipo escrito entre `< >` restringe la colección a objetos compatibles con `Producto`.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea una clase `Producto` con propiedades públicas `Nombre` (`string`) y `Stock` (`int`) con `private set`, inicializadas por constructor.\n\nLee `n`. Para cada producto lee una línea con el nombre y otra con el stock, crea el objeto y agrégalo a un `List<Producto>`. Imprime:\n\n- `Productos: N`\n- `Stock total: S`",
        starterCode: `using System;
using System.Collections.Generic;

class Producto
{
    // propiedades y constructor
}

class Program
{
    static void Main()
    {
        // lee, crea, agrega y resume
    }
}`,
        solutionCode: `using System;
using System.Collections.Generic;

class Producto
{
    public string Nombre { get; private set; }
    public int Stock { get; private set; }

    public Producto(string nombre, int stock)
    {
        Nombre = nombre;
        Stock = stock;
    }
}

class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        List<Producto> productos = new List<Producto>();

        for (int i = 0; i < n; i++)
        {
            string nombre = Console.ReadLine();
            int stock = int.Parse(Console.ReadLine());
            productos.Add(new Producto(nombre, stock));
        }

        int total = 0;
        for (int i = 0; i < productos.Count; i++)
        {
            total += productos[i].Stock;
        }

        Console.WriteLine("Productos: " + productos.Count);
        Console.WriteLine("Stock total: " + total);
    }
}`,
        hints: [
          "La lista debe ser `List<Producto>`.",
          "Agrega un objeto nuevo en cada iteración.",
          "Suma la propiedad `Stock`, no el índice.",
        ],
        difficulty: "medium",
        xpReward: 30,
        structure: {
          classes: [
            {
              name: "Producto",
              properties: [
                { name: "Nombre", visibility: "public", type: "string" },
                { name: "Stock", visibility: "public", type: "int" },
              ],
              constructors: [{ paramCount: 2 }],
            },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "2\nMouse\n4\nTeclado\n7\n",
            expectedStdout: "Productos: 2\nStock total: 11\n",
          },
          {
            visible: false,
            stdin: "1\nCable HDMI\n0\n",
            expectedStdout: "Productos: 1\nStock total: 0\n",
          },
          {
            visible: false,
            stdin: "3\nA\n2\nB\n5\nC\n9\n",
            expectedStdout: "Productos: 3\nStock total: 16\n",
          },
        ],
      },
    },
  ],
});
