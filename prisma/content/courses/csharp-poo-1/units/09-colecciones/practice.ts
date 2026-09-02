import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-lista-productos",
    title: "Inventario dinámico",
    description:
      "Carga objetos en una lista sin tamaño máximo fijado por el programa.",
    prompt:
      "crea `Producto(Nombre,Stock)`. Lee `n` productos (nombre y stock en líneas separadas), guárdalos en `List<Producto>` e imprime `N productos` y `S unidades`.",
    starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Program { static void Main() { } }`,
    solutionCode: `using System;
using System.Collections.Generic;
class Producto
{
    public string Nombre { get; private set; }
    public int Stock { get; private set; }
    public Producto(string nombre, int stock) { Nombre = nombre; Stock = stock; }
}
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        List<Producto> productos = new List<Producto>();
        for (int i = 0; i < n; i++)
            productos.Add(new Producto(Console.ReadLine(), int.Parse(Console.ReadLine())));
        int stock = 0;
        for (int i = 0; i < productos.Count; i++) stock += productos[i].Stock;
        Console.WriteLine(productos.Count + " productos");
        Console.WriteLine(stock + " unidades");
    }
}`,
    hints: ["`List<Producto>`, `Add`, `Count`."],
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      {
        stdin: "2\nMouse\n3\nCable\n7\n",
        expectedStdout: "2 productos\n10 unidades\n",
        visible: true,
      },
      {
        stdin: "1\nX\n0\n",
        expectedStdout: "1 productos\n0 unidades\n",
        visible: false,
      },
      {
        stdin: "4\nA\n1\nB\n2\nC\n3\nD\n4\n",
        expectedStdout: "4 productos\n10 unidades\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-eliminar-agotados",
    title: "Retira agotados",
    description:
      "Elimina varios objetos de una lista sin saltarte elementos al recorrerla.",
    prompt:
      "lee `n` productos (`nombre`, `stock`). Elimina todos los que tengan stock `0`, recorriendo de forma segura. Imprime los nombres restantes, uno por línea; si no queda ninguno, imprime `VACIO`.",
    starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Program { static void Main() { } }`,
    solutionCode: `using System;
using System.Collections.Generic;
class Producto
{
    public string Nombre { get; private set; }
    public int Stock { get; private set; }
    public Producto(string nombre, int stock) { Nombre = nombre; Stock = stock; }
}
class Program
{
    static void Main()
    {
        int n = int.Parse(Console.ReadLine());
        List<Producto> productos = new List<Producto>();
        for (int i = 0; i < n; i++)
            productos.Add(new Producto(Console.ReadLine(), int.Parse(Console.ReadLine())));
        for (int i = productos.Count - 1; i >= 0; i--)
            if (productos[i].Stock == 0) productos.RemoveAt(i);
        if (productos.Count == 0) Console.WriteLine("VACIO");
        else for (int i = 0; i < productos.Count; i++) Console.WriteLine(productos[i].Nombre);
    }
}`,
    hints: ["al borrar por índice, recorre de `Count - 1` hacia `0`."],
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        stdin: "3\nA\n0\nB\n2\nC\n0\n",
        expectedStdout: "B\n",
        visible: true,
      },
      {
        stdin: "2\nA\n0\nB\n0\n",
        expectedStdout: "VACIO\n",
        visible: false,
      },
      {
        stdin: "3\nA\n1\nB\n2\nC\n3\n",
        expectedStdout: "A\nB\nC\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-pila-historial",
    title: "Historial de acciones",
    description: "Usa una pila para reproducir un historial desde la acción más reciente.",
    prompt:
      "lee `n` acciones y apílalas. Después imprime todas usando `Pop`, de la más reciente a la más antigua.",
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
        Stack<string> historial = new Stack<string>();
        for (int i = 0; i < n; i++) historial.Push(Console.ReadLine());
        while (historial.Count > 0) Console.WriteLine(historial.Pop());
    }
}`,
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      {
        stdin: "3\nabrir\neditar\nguardar\n",
        expectedStdout: "guardar\neditar\nabrir\n",
        visible: true,
      },
      {
        stdin: "1\nlogin\n",
        expectedStdout: "login\n",
        visible: false,
      },
      {
        stdin: "4\nA\nB\nC\nD\n",
        expectedStdout: "D\nC\nB\nA\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-cola-turnos",
    title: "Ventanilla de turnos",
    description:
      "Modela atención FIFO y deja pendientes los turnos que todavía no alcanzan a procesarse.",
    prompt:
      "lee `n` nombres, encola todos y luego lee `k`. Atiende como máximo `k` personas. Por cada atención imprime `Atendido: NOMBRE`. Al final imprime `Pendientes: X`.",
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
        Queue<string> turnos = new Queue<string>();
        for (int i = 0; i < n; i++) turnos.Enqueue(Console.ReadLine());
        int k = int.Parse(Console.ReadLine());
        int atendidos = 0;
        while (turnos.Count > 0 && atendidos < k)
        {
            Console.WriteLine("Atendido: " + turnos.Dequeue());
            atendidos++;
        }
        Console.WriteLine("Pendientes: " + turnos.Count);
    }
}`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        stdin: "3\nAna\nBeto\nCaro\n2\n",
        expectedStdout: "Atendido: Ana\nAtendido: Beto\nPendientes: 1\n",
        visible: true,
      },
      {
        stdin: "2\nA\nB\n5\n",
        expectedStdout: "Atendido: A\nAtendido: B\nPendientes: 0\n",
        visible: false,
      },
      {
        stdin: "2\nA\nB\n0\n",
        expectedStdout: "Pendientes: 2\n",
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
