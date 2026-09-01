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
      structure: {
        classes: [
          {
            name: "Ficha",
            fields: [{ name: "siguiente", visibility: "private", type: "int", static: true }],
            properties: [{ name: "Id", visibility: "public", type: "int" }],
            methods: [
              { name: "ConfigurarInicio", visibility: "public", static: true, paramCount: 1 },
            ],
          },
        ],
      },
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
      structure: {
        classes: [
          {
            name: "Descuento",
            properties: [{ name: "Porcentaje", visibility: "public", type: "int" }],
            constructors: [{ paramCount: 1 }],
          },
        ],
      },
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
      prompt: "Cuenta nace con saldo no negativo (rechaza el saldo inicial negativo con \"Saldo invalido\") y tiene TransferirA(Cuenta,decimal). Rechaza monto <=0 con \"Monto invalido\" y monto mayor al saldo con \"Saldo insuficiente\". Lee dos saldos y monto; imprime ambos con dos decimales o el primer error.",
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
        if(s<0)throw new ArgumentException("Saldo invalido");
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
        try
        {
            Cuenta a=new Cuenta(decimal.Parse(Console.ReadLine())), b=new Cuenta(decimal.Parse(Console.ReadLine()));
            decimal m=decimal.Parse(Console.ReadLine());
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
        "Cuenta se protege desde su nacimiento: valida también en el constructor.",
        "private set permite modificar dentro de la misma clase.",
      ],
      difficulty: "medium",
      xpReward: 34,
      structure: {
        classes: [
          {
            name: "Cuenta",
            properties: [{ name: "Saldo", visibility: "public", type: "decimal" }],
            constructors: [{ paramCount: 1 }],
            methods: [{ name: "TransferirA", visibility: "public", paramCount: 2 }],
          },
        ],
      },
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
        {
          stdin: "-5\n10\n1\n",
          expectedStdout: "Error: Saldo invalido\n",
          visible: false,
          description: "Invariante desde el constructor",
        },
      ],
    },
    {
      slug: "csharp-poo-pedido-multiclase",
      title: "Pedido multiclase",
      description: "Separa catálogo, renglón y cálculo.",
      prompt: "Articulo tiene nombre/precio y existe por su cuenta en el catálogo. RenglonPedido conserva una referencia a un Articulo existente y una cantidad positiva (es asociación, no composición: el Articulo no nace ni muere con el renglón). Total devuelve precio*cantidad. Lee datos; imprime \"nombre x cantidad = total\" o \"Error: Cantidad invalida\".",
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
      structure: {
        classes: [
          {
            name: "Articulo",
            properties: [
              { name: "Nombre", visibility: "public", type: "string" },
              { name: "Precio", visibility: "public", type: "decimal" },
            ],
            constructors: [{ paramCount: 2 }],
          },
          {
            name: "RenglonPedido",
            constructors: [{ paramCount: 2 }],
            methods: [{ name: "Resumen", visibility: "public", returnType: "string" }],
            stores: [{ type: "Articulo" }],
          },
        ],
      },
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
    {
      // Vivía en U3 (UML), pero exige una referencia almacenada entre
      // objetos —U4— y `ArgumentException`/`try-catch` —U6—: un alumno que
      // acaba de terminar U3 se topaba con conocimiento futuro dentro del
      // grupo que supuestamente consolida U3. El ejercicio no cambia; lo
      // que cambia es dónde aparece. El slug se conserva: los intentos y el
      // XP ya ganado siguen colgando del mismo ejercicio.
      slug: "csharp-poo-requisito-bicicleta",
      title: "Requisito a modelo: renta de bicicleta",
      description: "Distribuye una regla entre estado y operación.",
      prompt: "Bicicleta conserva código y tarifa por hora; CotizadorRenta recibe una bicicleta y calcula horas*tarifa, rechazando horas <=0 con \"Horas invalidas\". Lee código, tarifa y horas; imprime \"COD: X.XX\" o error.",
      starterCode: `using System;
class Bicicleta
{
}

class CotizadorRenta
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Bicicleta
{
    public string Codigo
    {
        get;
        private set;
    }
    public decimal Tarifa
    {
        get;
        private set;
    }
    public Bicicleta(string c, decimal t)
    {
        Codigo=c;
        Tarifa=t;
    }
}

class CotizadorRenta
{
    private Bicicleta bici;
    public CotizadorRenta(Bicicleta b)
    {
        bici=b;
    }
    public decimal Calcular(int h)
    {
        if(h<=0)throw new ArgumentException("Horas invalidas");
        return bici.Tarifa*h;
    }
    public string Codigo()
    {
        return bici.Codigo;
    }
}

class Program
{
    static void Main()
    {
        string c=Console.ReadLine();
        decimal t=decimal.Parse(Console.ReadLine());
        int h=int.Parse(Console.ReadLine());
        try
        {
            CotizadorRenta x=new CotizadorRenta(new Bicicleta(c, t));
            Console.WriteLine(x.Codigo()+": "+x.Calcular(h).ToString("0.00"));
        }
        catch(ArgumentException ex)
        {
            Console.WriteLine("Error: "+ex.Message);
        }
    }
}`,
      hints: [
        "Bicicleta posee la tarifa.",
        "CotizadorRenta conoce la bicicleta.",
        "La validación vive en Calcular.",
      ],
      difficulty: "hard",
      xpReward: 36,
      structure: {
          classes: [
            {
              name: "Bicicleta",
              properties: [
                { name: "Codigo", visibility: "public", type: "string" },
                { name: "Tarifa", visibility: "public", type: "decimal" },
              ],
              constructors: [{ paramCount: 2 }],
            },
            {
              name: "CotizadorRenta",
              constructors: [{ paramCount: 1 }],
              methods: [
                { name: "Calcular", visibility: "public", paramCount: 1, returnType: "decimal" },
              ],
              // Asociación: el cotizador guarda la bicicleta que cotiza.
              stores: [{ type: "Bicicleta" }],
            },
          ],
        },
        testCases: [
          {
            stdin: "B-8\n25\n3\n",
            expectedStdout: "B-8: 75.00\n",
            visible: true,
          },
          {
            stdin: "X\n10.5\n1\n",
            expectedStdout: "X: 10.50\n",
            visible: false,
          },
          {
            stdin: "X\n10\n0\n",
            expectedStdout: "Error: Horas invalidas\n",
            visible: false,
          },
        ],
      },
  ],
};
