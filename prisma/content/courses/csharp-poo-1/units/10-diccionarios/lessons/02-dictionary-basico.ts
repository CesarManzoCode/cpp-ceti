import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "dictionary-basico",
  title: "Dictionary básico con objetos",
  description:
    "Da de alta objetos con claves únicas y diferencia `Add` del indexador de asignación.",
  estimatedMinutes: 15,
  xpReward: 50,
  steps: [
    {
      type: "theory",
      markdown: `# Una clave sólo puede tener un valor a la vez

\`Dictionary<TKey,TValue>\` exige claves únicas. Si haces \`Add("A1", producto)\` dos veces, el segundo \`Add\` falla: el diccionario no puede adivinar si querías reemplazar, duplicar o corregir.

Existen dos operaciones parecidas pero con intención distinta:

- \`Add(clave, valor)\`: alta nueva; exige que la clave no exista.
- \`diccionario[clave] = valor\`: asigna; crea si no existe o reemplaza si ya existe.

Para una operación de “alta” conviene detectar duplicados explícitamente. Para una actualización conocida, el indexador puede ser apropiado.`,
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

class Program
{
    static void Main()
    {
        Dictionary<string, Producto> inventario = new Dictionary<string, Producto>();
        Producto p = new Producto("P1", 5);
        inventario.Add(p.Codigo, p);

        Producto recuperado = inventario["P1"];
        Console.WriteLine(recuperado.Codigo + ": " + recuperado.Stock);
    }
}`,
      explanation:
        "la clave se toma del mismo objeto para no crear dos fuentes de identidad diferentes.",
      runnable: true,
      expectedOutput: `P1: 5`,
    },
    {
      type: "quiz",
      question:
        "¿qué expresa mejor una operación que debe rechazar productos duplicados?",
      options: [
        "Sobrescribir siempre con `inventario[codigo] = producto`.",
        "Comprobar si la clave existe y rechazar antes de `Add`.",
        "Cambiar el código del producto hasta encontrar uno libre.",
        "Guardar el producto dos veces con la misma clave.",
      ],
      correctIndex: 1,
      explanation:
        "la regla de negocio debe ser explícita; sobrescribir silenciosamente oculta un alta duplicada.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea `Producto` (`Codigo`, `Stock`). Lee `n` altas. Si un código aparece por primera vez, guarda el producto e imprime `ALTA`. Si el código ya existe, no reemplaces el objeto e imprime `DUPLICADO`. Al final imprime `Total: X`.",
        starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Producto
{
    public string Codigo { get; private set; }
    public int Stock { get; private set; }
    public Producto(string codigo, int stock) { Codigo = codigo; Stock = stock; }
}
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        Dictionary<string, Producto> inventario = new Dictionary<string, Producto>();
        for (int i = 0; i < n; i++)
        {
            string codigo = Console.ReadLine();
            int stock = int.Parse(Console.ReadLine());
            if (inventario.ContainsKey(codigo))
            {
                Console.WriteLine("DUPLICADO");
            }
            else
            {
                inventario.Add(codigo, new Producto(codigo, stock));
                Console.WriteLine("ALTA");
            }
        }
        Console.WriteLine("Total: " + inventario.Count);
    }
}`,
        hints: [
          "`ContainsKey` pregunta por identidad",
          "no uses el indexador antes de saber si existe",
          "`Count` cuenta claves vigentes",
        ],
        difficulty: "medium",
        xpReward: 30,
        testCases: [
          {
            visible: true,
            stdin: "3\nA\n1\nB\n2\nA\n9\n",
            expectedStdout: "ALTA\nALTA\nDUPLICADO\nTotal: 2\n",
          },
          {
            visible: false,
            stdin: "1\nX\n0\n",
            expectedStdout: "ALTA\nTotal: 1\n",
          },
          {
            visible: false,
            stdin: "4\nP\n1\nP\n2\nP\n3\nQ\n4\n",
            expectedStdout: "ALTA\nDUPLICADO\nDUPLICADO\nALTA\nTotal: 2\n",
          },
        ],
      },
    },
  ],
});
