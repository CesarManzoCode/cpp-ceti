import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — UML como contrato de código
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u03UmlExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-03-uml",
  unitTitle: "UML como contrato de código",
  unitIcon: "📐",
  exercises: [
    {
      slug: "csharp-poo-uml-estudiante",
      title: "UML a código: Estudiante",
      description: "Traduce visibilidad, atributo y operación.",
      prompt: "Del UML Estudiante(-registro:string, +Nombre:string, +Presentar():string), implementa constructor y Presentar que devuelva \"registro - Nombre\". Lee ambos e imprime.",
      starterCode: `using System;
class Estudiante
{
    /* traduce el UML */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Estudiante
{
    private string registro;
    public string Nombre
    {
        get;
        private set;
    }
    public Estudiante(string r, string n)
    {
        registro=r;
        Nombre=n;
    }
    public string Presentar()
    {
        return registro+" - "+Nombre;
    }
}

class Program
{
    static void Main()
    {
        Estudiante e=new Estudiante(Console.ReadLine(), Console.ReadLine());
        Console.WriteLine(e.Presentar());
    }
}`,
      hints: [
        "- significa private.",
        "+ significa public.",
        "El método devuelve string.",
      ],
      difficulty: "easy",
      xpReward: 20,
      testCases: [
        {
          stdin: "2210\nSara\n",
          expectedStdout: "2210 - Sara\n",
          visible: true,
        },
        {
          stdin: "A-1\nJosé P.\n",
          expectedStdout: "A-1 - José P.\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-uml-visibilidad-cuenta",
      title: "Visibilidad coherente",
      description: "Implementa un contrato UML sin exponer el saldo.",
      prompt: "Cuenta tiene -saldo:decimal, +Cuenta(decimal), +Depositar(decimal):void y +Consultar():decimal. Lee inicial y depósito; imprime saldo con dos decimales.",
      starterCode: `using System;
class Cuenta
{
    /* respeta signos UML */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Cuenta
{
    private decimal saldo;
    public Cuenta(decimal inicial)
    {
        saldo=inicial;
    }
    public void Depositar(decimal monto)
    {
        saldo+=monto;
    }
    public decimal Consultar()
    {
        return saldo;
    }
}

class Program
{
    static void Main()
    {
        Cuenta c=new Cuenta(decimal.Parse(Console.ReadLine()));
        c.Depositar(decimal.Parse(Console.ReadLine()));
        Console.WriteLine(c.Consultar().ToString("0.00"));
    }
}`,
      hints: [
        "saldo no es público.",
        "Depositar cambia estado.",
        "Consultar devuelve, no imprime.",
      ],
      difficulty: "easy",
      xpReward: 22,
      testCases: [
        {
          stdin: "10\n2.5\n",
          expectedStdout: "12.50\n",
          visible: true,
        },
        {
          stdin: "0.01\n0.09\n",
          expectedStdout: "0.10\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-codigo-a-uml-pelicula",
      title: "Código coherente con diagrama",
      description: "Completa código a partir de una lectura UML inversa.",
      prompt: "Implementa Pelicula con Titulo público de lectura, duración privada, constructor y EsLarga():bool (más de 120). Lee datos e imprime \"Titulo | larga/corta\".",
      starterCode: `using System;
class Pelicula
{
    /* luego dibuja su UML */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Pelicula
{
    private int duracion;
    public string Titulo
    {
        get;
        private set;
    }
    public Pelicula(string t, int d)
    {
        Titulo=t;
        duracion=d;
    }
    public bool EsLarga()
    {
        return duracion>120;
    }
}

class Program
{
    static void Main()
    {
        Pelicula p=new Pelicula(Console.ReadLine(), int.Parse(Console.ReadLine()));
        Console.WriteLine(p.Titulo+" | "+(p.EsLarga()?"larga":"corta"));
    }
}`,
      hints: [
        "120 exactos no es larga.",
        "duracion permanece private.",
        "Dibuja después la firma de EsLarga.",
      ],
      difficulty: "medium",
      xpReward: 28,
      testCases: [
        {
          stdin: "Norte\n121\n",
          expectedStdout: "Norte | larga\n",
          visible: true,
        },
        {
          stdin: "Límite\n120\n",
          expectedStdout: "Límite | corta\n",
          visible: false,
        },
      ],
    },
    {
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
