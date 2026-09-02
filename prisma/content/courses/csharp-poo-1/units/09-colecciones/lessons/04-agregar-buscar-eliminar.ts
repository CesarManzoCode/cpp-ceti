import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "agregar-buscar-eliminar",
  title: "Agregar, buscar y eliminar objetos",
  description:
    "Implementa las operaciones básicas de una estructura sin confundir posición con identidad del objeto.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# El índice no es la identidad

Si un producto tiene código \`P-17\`, ese código identifica al producto en el dominio. Que hoy esté en la posición 3 de una lista es sólo un detalle de organización.

Por eso las operaciones típicas se expresan así:

1. **agregar** un objeto;
2. **buscar** por una clave del dominio;
3. **eliminar** el objeto encontrado.

Con una lista pequeña puedes recorrer secuencialmente y comparar la propiedad \`Codigo\`. Más adelante un diccionario permitirá acceder directamente por clave; primero conviene dominar la operación independientemente de la estructura concreta.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Producto
{
    public string Codigo { get; private set; }
    public Producto(string codigo) { Codigo = codigo; }
}

class Program
{
    static void Main()
    {
        List<Producto> productos = new List<Producto>();
        productos.Add(new Producto("A1"));
        productos.Add(new Producto("B2"));
        productos.Add(new Producto("C3"));

        string buscado = "B2";
        Producto encontrado = null;

        for (int i = 0; i < productos.Count; i++)
        {
            if (productos[i].Codigo == buscado)
            {
                encontrado = productos[i];
                break;
            }
        }

        if (encontrado != null)
        {
            productos.Remove(encontrado);
        }

        Console.WriteLine(productos.Count);
    }
}`,
      explanation:
        "el programa busca por `Codigo`, conserva la referencia encontrada y pide a la lista que elimine ese objeto. No depende de que `B2` esté siempre en la posición 1.",
      runnable: true,
      expectedOutput: "2",
    },
    {
      type: "quiz",
      question:
        "si eliminas elementos de una lista dentro de un `for` ascendente usando `RemoveAt(i)`, ¿qué riesgo aparece?",
      options: [
        "Ninguno: los índices nunca cambian.",
        "El siguiente elemento se desplaza al índice actual y puede quedar sin revisar.",
        "`Count` aumenta automáticamente.",
        "C# convierte la lista en arreglo.",
      ],
      correctIndex: 1,
      explanation:
        "al retirar un elemento, los posteriores se desplazan. Por eso al filtrar por índice suele recorrerse de atrás hacia adelante o separarse la búsqueda de la eliminación.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea `Producto` con `Codigo` y `Stock`. Lee `n`, luego `n` pares de líneas (`codigo`, `stock`). Después lee un código a eliminar.\n\nBusca ese producto por `Codigo` y elimínalo si existe. Imprime primero `Restantes: N` y luego los códigos restantes, uno por línea, conservando su orden original.",
        starterCode: `using System;
using System.Collections.Generic;

class Producto
{
    // Codigo, Stock y constructor
}

class Program
{
    static void Main()
    {
        // carga, busca y elimina
    }
}`,
        solutionCode: `using System;
using System.Collections.Generic;

class Producto
{
    public string Codigo { get; private set; }
    public int Stock { get; private set; }

    public Producto(string codigo, int stock)
    {
        Codigo = codigo;
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
            string codigo = Console.ReadLine();
            int stock = int.Parse(Console.ReadLine());
            productos.Add(new Producto(codigo, stock));
        }

        string objetivo = Console.ReadLine();
        Producto encontrado = null;

        for (int i = 0; i < productos.Count; i++)
        {
            if (productos[i].Codigo == objetivo)
            {
                encontrado = productos[i];
                break;
            }
        }

        if (encontrado != null)
        {
            productos.Remove(encontrado);
        }

        Console.WriteLine("Restantes: " + productos.Count);
        for (int i = 0; i < productos.Count; i++)
        {
            Console.WriteLine(productos[i].Codigo);
        }
    }
}`,
        hints: [
          "Busca por `Producto.Codigo`, no por un índice fijo.",
          "Guarda el objeto encontrado en una variable que puede ser `null`.",
          "Llama `Remove` sólo cuando realmente lo encontraste.",
        ],
        difficulty: "medium",
        xpReward: 32,
        testCases: [
          {
            visible: true,
            stdin: "3\nA1\n2\nB2\n4\nC3\n1\nB2\n",
            expectedStdout: "Restantes: 2\nA1\nC3\n",
          },
          {
            visible: false,
            stdin: "2\nX\n0\nY\n9\nZ\n",
            expectedStdout: "Restantes: 2\nX\nY\n",
          },
          {
            visible: false,
            stdin: "1\nP7\n5\nP7\n",
            expectedStdout: "Restantes: 0\n",
          },
        ],
      },
    },
  ],
});
