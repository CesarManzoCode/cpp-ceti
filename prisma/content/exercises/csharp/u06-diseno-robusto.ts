import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — Responsabilidades y diseño robusto
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u06DisenoRobustoExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-06-diseno-robusto",
  unitTitle: "Responsabilidades y diseño robusto",
  unitIcon: "🛡️",
  exercises: [
    {
      slug: "csharp-poo-static-consecutivo",
      title: "Consecutivo compartido",
      description: "Asigna un identificador desde estado de clase.",
      prompt: "Ficha usa un siguiente static configurable. Lee el primer número, configúralo una vez, crea tres fichas y muestra sus IDs consecutivos.",
      starterCode: `using System;
class Ficha
{
    /* static e Id */
}

class Program
{
    static void Main()
    {
        /* tres objetos */
    }
}`,
      solutionCode: `using System;
class Ficha
{
    private static int siguiente;
    public int Id
    {
        get;
        private set;
    }
    public static void ConfigurarInicio(int inicio)
    {
        siguiente=inicio;
    }
    public Ficha()
    {
        Id=siguiente;
        siguiente++;
    }
}

class Program
{
    static void Main()
    {
        Ficha.ConfigurarInicio(int.Parse(Console.ReadLine()));
        Ficha a=new Ficha(), b=new Ficha(), c=new Ficha();
        Console.WriteLine(a.Id);
        Console.WriteLine(b.Id);
        Console.WriteLine(c.Id);
    }
}`,
      hints: [
        "siguiente y ConfigurarInicio pertenecen a la clase.",
        "Id pertenece a cada instancia.",
        "Incrementa después de asignar.",
      ],
      difficulty: "easy",
      xpReward: 22,
      testCases: [
        {
          stdin: "1\n",
          expectedStdout: "1\n2\n3\n",
          visible: true,
        },
        {
          stdin: "40\n",
          expectedStdout: "40\n41\n42\n",
          visible: false,
        },
        {
          stdin: "-2\n",
          expectedStdout: "-2\n-1\n0\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-validar-porcentaje",
      title: "Porcentaje válido",
      description: "Protege un rango desde el constructor.",
      prompt: "Descuento acepta 0..100. Lee porcentaje; imprime \"Aceptado: N\" o \"Error: Porcentaje invalido\".",
      starterCode: `using System;
class Descuento
{
}

class Program
{
    static void Main()
    {
        /* try/catch */
    }
}`,
      solutionCode: `using System;
class Descuento
{
    public int Porcentaje
    {
        get;
        private set;
    }
    public Descuento(int p)
    {
        if(p<0||p>100)throw new ArgumentException("Porcentaje invalido");
        Porcentaje=p;
    }
}

class Program
{
    static void Main()
    {
        try
        {
            Descuento d=new Descuento(int.Parse(Console.ReadLine()));
            Console.WriteLine("Aceptado: "+d.Porcentaje);
        }
        catch(ArgumentException ex)
        {
            Console.WriteLine("Error: "+ex.Message);
        }
    }
}`,
      hints: [
        "Ambos límites son válidos.",
        "La clase lanza.",
        "Main traduce el error.",
      ],
      difficulty: "easy",
      xpReward: 24,
      testCases: [
        {
          stdin: "25\n",
          expectedStdout: "Aceptado: 25\n",
          visible: true,
        },
        {
          stdin: "100\n",
          expectedStdout: "Aceptado: 100\n",
          visible: false,
        },
        {
          stdin: "-1\n",
          expectedStdout: "Error: Porcentaje invalido\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-transferencia-segura",
      title: "Transferencia segura",
      description: "Coordina dos objetos manteniendo invariantes.",
      prompt: "Cuenta tiene saldo no negativo y TransferirA(Cuenta,decimal). Rechaza monto <=0 con \"Monto invalido\" y monto mayor al saldo con \"Saldo insuficiente\". Lee dos saldos y monto; imprime ambos con dos decimales o error.",
      starterCode: `using System;
class Cuenta
{
    /* encapsula y transfiere */
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Cuenta
{
    public decimal Saldo
    {
        get;
        private set;
    }
    public Cuenta(decimal s)
    {
        Saldo=s;
    }
    public void TransferirA(Cuenta destino, decimal m)
    {
        if(m<=0)throw new ArgumentException("Monto invalido");
        if(m>Saldo)throw new ArgumentException("Saldo insuficiente");
        Saldo-=m;
        destino.Saldo+=m;
    }
}

class Program
{
    static void Main()
    {
        Cuenta a=new Cuenta(decimal.Parse(Console.ReadLine())), b=new Cuenta(decimal.Parse(Console.ReadLine()));
        decimal m=decimal.Parse(Console.ReadLine());
        try
        {
            a.TransferirA(b, m);
            Console.WriteLine(a.Saldo.ToString("0.00"));
            Console.WriteLine(b.Saldo.ToString("0.00"));
        }
        catch(ArgumentException ex)
        {
            Console.WriteLine("Error: "+ex.Message);
        }
    }
}`,
      hints: [
        "La operación pertenece a Cuenta.",
        "Valida antes de modificar.",
        "private set permite modificar dentro de la misma clase.",
      ],
      difficulty: "medium",
      xpReward: 34,
      testCases: [
        {
          stdin: "100\n20\n30\n",
          expectedStdout: "70.00\n50.00\n",
          visible: true,
        },
        {
          stdin: "10\n1\n11\n",
          expectedStdout: "Error: Saldo insuficiente\n",
          visible: false,
        },
        {
          stdin: "10\n1\n0\n",
          expectedStdout: "Error: Monto invalido\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-pedido-multiclase",
      title: "Pedido multiclase",
      description: "Separa catálogo, renglón y cálculo.",
      prompt: "Articulo tiene nombre/precio. RenglonPedido compone un Articulo y cantidad positiva, Total devuelve precio*cantidad. Lee datos; imprime \"nombre x cantidad = total\" o \"Error: Cantidad invalida\".",
      starterCode: `using System;
class Articulo
{
}

class RenglonPedido
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Articulo
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
    public Articulo(string n, decimal p)
    {
        Nombre=n;
        Precio=p;
    }
}

class RenglonPedido
{
    private Articulo articulo;
    private int cantidad;
    public RenglonPedido(Articulo a, int c)
    {
        if(c<=0)throw new ArgumentException("Cantidad invalida");
        articulo=a;
        cantidad=c;
    }
    public string Resumen()
    {
        return articulo.Nombre+" x "+cantidad+" = "+(articulo.Precio*cantidad).ToString("0.00");
    }
}

class Program
{
    static void Main()
    {
        string n=Console.ReadLine();
        decimal p=decimal.Parse(Console.ReadLine());
        int c=int.Parse(Console.ReadLine());
        try
        {
            Console.WriteLine(new RenglonPedido(new Articulo(n, p), c).Resumen());
        }
        catch(ArgumentException ex)
        {
            Console.WriteLine("Error: "+ex.Message);
        }
    }
}`,
      hints: [
        "Articulo conserva datos.",
        "RenglonPedido aplica cantidad.",
        "Valida antes de guardar.",
      ],
      difficulty: "hard",
      xpReward: 42,
      testCases: [
        {
          stdin: "Marcador\n12.5\n4\n",
          expectedStdout: "Marcador x 4 = 50.00\n",
          visible: true,
        },
        {
          stdin: "A\n0.10\n3\n",
          expectedStdout: "A x 3 = 0.30\n",
          visible: false,
        },
        {
          stdin: "A\n10\n-2\n",
          expectedStdout: "Error: Cantidad invalida\n",
          visible: false,
        },
      ],
    },
  ],
};
