import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "inventario-en-memoria",
  title: "Un inventario en memoria",
  description:
    "Encapsula una colección dentro de una clase de servicio y expone operaciones del dominio en lugar de entregar la lista al resto del programa.",
  estimatedMinutes: 18,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# La colección es un detalle interno

Si todo \`Program\` recibe acceso directo a \`List<Producto>\`, cualquier parte puede agregar, borrar o reemplazar objetos sin respetar reglas.

Una clase \`Inventario\` puede **poseer** la colección y publicar operaciones con intención:

- \`Agregar(Producto)\`;
- \`Buscar(string codigo)\`;
- \`Eliminar(string codigo)\`.

Eso aplica composición: el inventario *tiene* una colección. También deja preparado el diseño para cambiar la estructura interna después sin obligar a todos los consumidores a reescribirse.`,
    },
    {
      type: "code_example",
      code: `using System;
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

class Inventario
{
    private List<Producto> productos = new List<Producto>();

    public void Agregar(Producto producto)
    {
        productos.Add(producto);
    }

    public Producto Buscar(string codigo)
    {
        for (int i = 0; i < productos.Count; i++)
        {
            if (productos[i].Codigo == codigo) return productos[i];
        }
        return null;
    }
}

class Program
{
    static void Main()
    {
        Inventario inventario = new Inventario();
        inventario.Agregar(new Producto("P1", 8));
        Producto p = inventario.Buscar("P1");
        Console.WriteLine(p == null ? "NO" : p.Stock.ToString());
    }
}`,
      explanation:
        "`Program` no necesita saber si el inventario usa una lista, arreglo o diccionario. Sólo conoce las operaciones públicas del objeto.",
      runnable: true,
      expectedOutput: "8",
    },
    {
      type: "matching",
      pairs: [
        { left: "Inventario", right: "Responsable de organizar/buscar productos." },
        { left: "Producto", right: "Responsable de representar un producto." },
        { left: "List<Producto> privada", right: "Detalle interno de almacenamiento." },
        { left: "Buscar(codigo)", right: "Operación del dominio expuesta al consumidor." },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `Producto` (`Codigo`, `Stock`) e `Inventario` con una `List<Producto>` privada y métodos `Agregar`, `Buscar` y `Eliminar`.\n\nEl programa recibe `n` comandos:\n\n- `A CODIGO STOCK` agrega un producto;\n- `B CODIGO` busca e imprime su stock, o `NO` si no existe;\n- `E CODIGO` elimina si existe y no imprime nada.\n\nLos códigos no contienen espacios.",
        starterCode: `using System;
using System.Collections.Generic;

class Producto { }
class Inventario { }

class Program
{
    static void Main()
    {
        // procesa comandos
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

class Inventario
{
    private List<Producto> productos = new List<Producto>();

    public void Agregar(Producto producto)
    {
        productos.Add(producto);
    }

    public Producto Buscar(string codigo)
    {
        for (int i = 0; i < productos.Count; i++)
        {
            if (productos[i].Codigo == codigo) return productos[i];
        }
        return null;
    }

    public void Eliminar(string codigo)
    {
        Producto producto = Buscar(codigo);
        if (producto != null) productos.Remove(producto);
    }
}

class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Inventario inventario = new Inventario();

        for (int i = 0; i < n; i++)
        {
            string[] partes = Console.ReadLine().Split(' ');
            if (partes[0] == "A")
            {
                inventario.Agregar(new Producto(partes[1], int.Parse(partes[2])));
            }
            else if (partes[0] == "B")
            {
                Producto producto = inventario.Buscar(partes[1]);
                Console.WriteLine(producto == null ? "NO" : producto.Stock.ToString());
            }
            else if (partes[0] == "E")
            {
                inventario.Eliminar(partes[1]);
            }
        }
    }
}`,
        hints: [
          "La lista pertenece a `Inventario`, no a `Program`.",
          "`Eliminar` puede reutilizar `Buscar`.",
          "`Split(' ')` separa el comando de sus argumentos.",
        ],
        difficulty: "hard",
        xpReward: 40,
        structure: {
          classes: [
            {
              name: "Producto",
              properties: [
                { name: "Codigo", visibility: "public", type: "string" },
                { name: "Stock", visibility: "public", type: "int" },
              ],
              constructors: [{ paramCount: 2 }],
            },
            {
              name: "Inventario",
              stores: [{ type: "Producto" }],
              methods: [
                { name: "Agregar", visibility: "public", paramCount: 1 },
                { name: "Buscar", visibility: "public", paramCount: 1 },
                { name: "Eliminar", visibility: "public", paramCount: 1 },
              ],
            },
          ],
        },
        testCases: [
          {
            visible: true,
            stdin: "5\nA P1 8\nA P2 3\nB P2\nE P2\nB P2\n",
            expectedStdout: "3\nNO\n",
          },
          {
            visible: false,
            stdin: "4\nB X\nA X 0\nB X\nE X\n",
            expectedStdout: "NO\n0\n",
          },
          {
            visible: false,
            stdin: "7\nA A 1\nA B 2\nA C 3\nE B\nB A\nB B\nB C\n",
            expectedStdout: "1\nNO\n3\n",
          },
        ],
      },
    },
  ],
});
