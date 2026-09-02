import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "actualizar-y-eliminar",
  title: "Actualizar y eliminar por clave",
  description:
    "Realiza cambios dirigidos a una identidad estable y diferencia actualizar el objeto de reemplazar la asociación.",
  estimatedMinutes: 15,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# CRUD también existe en memoria

Un diccionario permite expresar operaciones de mantenimiento con una clave:

- **Create:** \`Add\`;
- **Read:** indexador o \`TryGetValue\`;
- **Update:** modificar el objeto recuperado o reemplazar el valor asociado;
- **Delete:** \`Remove(clave)\`.

Si el objeto encapsula su estado, es preferible pedirle una operación (\`AjustarStock\`) en lugar de exponer un setter público. El diccionario localiza; el objeto protege sus reglas.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Producto
{
    public int Stock { get; private set; }
    public Producto(int stock) { Stock = stock; }
    public void AjustarStock(int cambio) { Stock += cambio; }
}
class Program
{
    static void Main()
    {
        Dictionary<string, Producto> inventario = new Dictionary<string, Producto>();
        inventario.Add("P1", new Producto(5));
        inventario["P1"].AjustarStock(3);
        Console.WriteLine(inventario["P1"].Stock);
        inventario.Remove("P1");
        Console.WriteLine(inventario.Count);
    }
}`,
      explanation:
        "la clave encuentra el producto; la propia clase ejecuta la modificación de stock; `Remove` retira la asociación completa.",
      runnable: true,
      expectedOutput: `8\n0`,
    },
    {
      type: "quiz",
      question:
        "tienes `Dictionary<string, Producto>` y `Producto.Stock` tiene `private set`. ¿Qué diseño conserva mejor el encapsulamiento?",
      options: [
        "Hacer público el setter para que el diccionario lo cambie.",
        "Añadir un método de dominio en `Producto`, recuperar el objeto y llamar ese método.",
        "Reemplazar el diccionario por variables globales.",
        "Convertir `Stock` en `static`.",
      ],
      correctIndex: 1,
      explanation:
        "Añadir un método de dominio en `Producto`, recuperar el objeto y llamar ese método: el diccionario sólo localiza, la clase sigue protegiendo su propio estado.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee un inventario inicial y luego `q` comandos:\n\n- `U CODIGO CAMBIO`: suma `CAMBIO` al stock si existe; si no, no hace nada.\n- `E CODIGO`: elimina la clave si existe.\n- `B CODIGO`: imprime stock o `NO`.\n\nUsa un `Dictionary<string,int>`; los códigos no tienen espacios.",
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
        Dictionary<string, int> inventario = new Dictionary<string, int>();
        for (int i = 0; i < n; i++)
        {
            string codigo = Console.ReadLine();
            inventario[codigo] = int.Parse(Console.ReadLine());
        }

        int q = int.Parse(Console.ReadLine());
        for (int i = 0; i < q; i++)
        {
            string[] p = Console.ReadLine().Split(' ');
            if (p[0] == "U")
            {
                if (inventario.ContainsKey(p[1])) inventario[p[1]] += int.Parse(p[2]);
            }
            else if (p[0] == "E")
            {
                inventario.Remove(p[1]);
            }
            else if (p[0] == "B")
            {
                int valor;
                Console.WriteLine(inventario.TryGetValue(p[1], out valor) ? valor.ToString() : "NO");
            }
        }
    }
}`,
        hints: [
          "`Remove` ya tolera una clave ausente",
          "actualiza sólo si `ContainsKey`",
          "una búsqueda ausente no es excepción",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            visible: true,
            stdin: "2\nA\n5\nB\n2\n5\nB A\nU A 3\nB A\nE A\nB A\n",
            expectedStdout: "5\n8\nNO\n",
          },
          {
            visible: false,
            stdin: "1\nX\n0\n3\nU Y 5\nB X\nB Y\n",
            expectedStdout: "0\nNO\n",
          },
          {
            visible: false,
            stdin: "2\nA\n1\nB\n9\n4\nE B\nB B\nU A -1\nB A\n",
            expectedStdout: "NO\n0\n",
          },
        ],
      },
    },
  ],
});
