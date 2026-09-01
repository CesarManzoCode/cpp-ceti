import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — Proyecto integrador
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u08IntegradorExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-08-integrador",
  unitTitle: "Proyecto integrador",
  unitIcon: "🚀",
  exercises: [
    {
      slug: "csharp-poo-integrador-requisito",
      title: "Criterio de aceptación ejecutable",
      description: "Convierte una regla textual en resultado observable.",
      prompt: "Membresia aplica 5% de descuento si el subtotal es al menos 500. Lee subtotal; imprime total con dos decimales.",
      starterCode: `using System;
class Membresia
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Membresia
{
    public decimal Total(decimal s)
    {
        return s>=500m?s*0.95m:s;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Membresia().Total(decimal.Parse(Console.ReadLine())).ToString("0.00"));
    }
}`,
      hints: [
        "500 está incluido.",
        "Usa decimal.",
        "La regla vive en Membresia.",
      ],
      difficulty: "easy",
      xpReward: 24,
      structure: {
        classes: [
          {
            name: "Membresia",
            methods: [{ name: "Total", visibility: "public", paramCount: 1, returnType: "decimal" }],
          },
        ],
      },
      testCases: [
        {
          stdin: "600\n",
          expectedStdout: "570.00\n",
          visible: true,
        },
        {
          stdin: "499.99\n",
          expectedStdout: "499.99\n",
          visible: false,
        },
        {
          stdin: "500\n",
          expectedStdout: "475.00\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-integrador-inventario-fijo",
      title: "Inventario de alcance fijo",
      description: "Usa objetos y un arreglo sin entrar a colecciones de POO II.",
      prompt: "Producto tiene nombre y existencia. Lee dos productos; imprime el nombre del que tiene mayor existencia; empate imprime el primero.",
      starterCode: `using System;
class Producto
{
}

class Program
{
    static void Main()
    {
        /* Producto[2] */
    }
}`,
      solutionCode: `using System;
class Producto
{
    public string Nombre
    {
        get;
        private set;
    }
    public int Existencia
    {
        get;
        private set;
    }
    public Producto(string n, int e)
    {
        Nombre=n;
        Existencia=e;
    }
}

class Program
{
    static void Main()
    {
        Producto[] p=new Producto[2];
        p[0]=new Producto(Console.ReadLine(), int.Parse(Console.ReadLine()));
        p[1]=new Producto(Console.ReadLine(), int.Parse(Console.ReadLine()));
        Console.WriteLine(p[1].Existencia>p[0].Existencia?p[1].Nombre:p[0].Nombre);
    }
}`,
      hints: [
        "Arreglo de tamaño 2.",
        "Compara las propiedades.",
        "Usa > para conservar el primero en empate.",
      ],
      difficulty: "easy",
      xpReward: 26,
      structure: {
        classes: [
          {
            name: "Producto",
            properties: [
              { name: "Nombre", visibility: "public", type: "string" },
              { name: "Existencia", visibility: "public", type: "int" },
            ],
            constructors: [{ paramCount: 2 }],
          },
        ],
      },
      testCases: [
        {
          stdin: "Papel\n5\nTinta\n9\n",
          expectedStdout: "Tinta\n",
          visible: true,
        },
        {
          stdin: "A\n7\nB\n7\n",
          expectedStdout: "A\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-integrador-folio-polimorfico",
      title: "Comprobante polimórfico",
      description: "Integra abstracción, formato y casos variables.",
      prompt: "Comprobante abstracto conserva folio y Total(). Venta devuelve importe; Servicio agrega 16%. Lee folios/importes, crea Comprobante[2] e imprime \"folio: total\".",
      starterCode: `using System;
abstract class Comprobante
{
}

class Venta:Comprobante
{
}

class Servicio:Comprobante
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
abstract class Comprobante
{
    public string Folio
    {
        get;
        private set;
    }
    protected decimal importe;
    public Comprobante(string f, decimal i)
    {
        Folio=f;
        importe=i;
    }
    public abstract decimal Total();
}

class Venta:Comprobante
{
    public Venta(string f, decimal i):base(f, i)
    {
    }
    public override decimal Total()
    {
        return importe;
    }
}

class Servicio:Comprobante
{
    public Servicio(string f, decimal i):base(f, i)
    {
    }
    public override decimal Total()
    {
        return importe*1.16m;
    }
}

class Program
{
    static void Main()
    {
        Comprobante[] c=new Comprobante[]
        {
            new Venta(Console.ReadLine(), decimal.Parse(Console.ReadLine())), new Servicio(Console.ReadLine(), decimal.Parse(Console.ReadLine()))
        }
        ;
        for(int i=0;i<c.Length;i++)Console.WriteLine(c[i].Folio+": "+c[i].Total().ToString("0.00"));
    }
}`,
      hints: [
        "Comprobante es abstracta.",
        "importe es accesible a derivadas.",
        "Recorre el tipo base.",
      ],
      difficulty: "medium",
      xpReward: 36,
      structure: {
        classes: [
          {
            name: "Comprobante",
            abstract: true,
            properties: [{ name: "Folio", visibility: "public", type: "string" }],
            constructors: [{ paramCount: 2 }],
            methods: [{ name: "Total", visibility: "public", abstract: true, returnType: "decimal" }],
          },
          {
            name: "Venta",
            extends: "Comprobante",
            constructors: [{ paramCount: 2, callsBase: true }],
            methods: [{ name: "Total", visibility: "public", override: true, returnType: "decimal" }],
          },
          {
            name: "Servicio",
            extends: "Comprobante",
            constructors: [{ paramCount: 2, callsBase: true }],
            methods: [{ name: "Total", visibility: "public", override: true, returnType: "decimal" }],
          },
        ],
      },
      testCases: [
        {
          stdin: "V1\n100\nS1\n200\n",
          expectedStdout: "V1: 100.00\nS1: 232.00\n",
          visible: true,
        },
        {
          stdin: "A\n1.5\nB\n10.25\n",
          expectedStdout: "A: 1.50\nB: 11.89\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-integrador-orden-completa",
      title: "Orden final trazable",
      description: "Integra asociación, validación y resumen para transferir a WinForms.",
      prompt: "Cliente tiene nombre. Producto tiene nombre/precio positivo. Orden conserva una referencia a un Cliente y a un Producto ya existentes (asociación, no composición) y una cantidad positiva. Lee todos los datos; imprime \"cliente | producto x cantidad | total\" o Error con \"Precio invalido\"/\"Cantidad invalida\".",
      starterCode: `using System;
class Cliente
{
}

class Producto
{
}

class Orden
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Cliente
{
    public string Nombre
    {
        get;
        private set;
    }
    public Cliente(string n)
    {
        Nombre=n;
    }
}

class Producto
{
    public string Nombre
    {
        get;
        private set;
    }
    public decimal Precio
    {
        get;
        private set;
    }
    public Producto(string n, decimal p)
    {
        if(p<=0)throw new ArgumentException("Precio invalido");
        Nombre=n;
        Precio=p;
    }
}

class Orden
{
    private Cliente cliente;
    private Producto producto;
    private int cantidad;
    public Orden(Cliente c, Producto p, int q)
    {
        if(q<=0)throw new ArgumentException("Cantidad invalida");
        cliente=c;
        producto=p;
        cantidad=q;
    }
    public string Resumen()
    {
        return cliente.Nombre+" | "+producto.Nombre+" x "+cantidad+" | "+(producto.Precio*cantidad).ToString("0.00");
    }
}

class Program
{
    static void Main()
    {
        string c=Console.ReadLine(), p=Console.ReadLine();
        decimal precio=decimal.Parse(Console.ReadLine());
        int q=int.Parse(Console.ReadLine());
        try
        {
            Console.WriteLine(new Orden(new Cliente(c), new Producto(p, precio), q).Resumen());
        }
        catch(ArgumentException ex)
        {
            Console.WriteLine("Error: "+ex.Message);
        }
    }
}`,
      hints: [
        "Valida dentro de Producto y Orden.",
        "Orden conserva referencias.",
        "Program sólo adapta entrada y salida.",
      ],
      difficulty: "hard",
      xpReward: 46,
      structure: {
        classes: [
          {
            name: "Cliente",
            properties: [{ name: "Nombre", visibility: "public", type: "string" }],
            constructors: [{ paramCount: 1 }],
          },
          {
            name: "Producto",
            properties: [
              { name: "Nombre", visibility: "public", type: "string" },
              { name: "Precio", visibility: "public", type: "decimal" },
            ],
            constructors: [{ paramCount: 2 }],
          },
          {
            name: "Orden",
            constructors: [{ paramCount: 3 }],
            methods: [{ name: "Resumen", visibility: "public", returnType: "string" }],
            stores: [{ type: "Cliente" }, { type: "Producto" }],
          },
        ],
      },
      testCases: [
        {
          stdin: "Nora\nCuaderno\n25.5\n2\n",
          expectedStdout: "Nora | Cuaderno x 2 | 51.00\n",
          visible: true,
        },
        {
          stdin: "X\nY\n0.01\n3\n",
          expectedStdout: "X | Y x 3 | 0.03\n",
          visible: false,
        },
        {
          stdin: "X\nY\n0\n1\n",
          expectedStdout: "Error: Precio invalido\n",
          visible: false,
        },
        {
          stdin: "X\nY\n10\n0\n",
          expectedStdout: "Error: Cantidad invalida\n",
          visible: false,
        },
      ],
    },
  ],
};
