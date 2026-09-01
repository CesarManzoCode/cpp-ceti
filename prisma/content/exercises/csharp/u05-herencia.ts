import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — Herencia y polimorfismo
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u05HerenciaExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-05-herencia",
  unitTitle: "Herencia y polimorfismo",
  unitIcon: "🌳",
  exercises: [
    {
      slug: "csharp-poo-herencia-dispositivo",
      title: "Tablet es un dispositivo",
      description: "Construye una generalización simple.",
      prompt: "Dispositivo guarda marca y MostrarMarca. Tablet hereda y agrega pulgadas. Lee ambos; imprime marca y \"N pulgadas\".",
      starterCode: `using System;
class Dispositivo
{
}

class Tablet : Dispositivo
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Dispositivo
{
    public string Marca
    {
        get;
        private set;
    }
    public Dispositivo(string m)
    {
        Marca=m;
    }
    public void MostrarMarca()
    {
        Console.WriteLine(Marca);
    }
}

class Tablet:Dispositivo
{
    public int Pulgadas
    {
        get;
        private set;
    }
    public Tablet(string m, int p):base(m)
    {
        Pulgadas=p;
    }
}

class Program
{
    static void Main()
    {
        Tablet t=new Tablet(Console.ReadLine(), int.Parse(Console.ReadLine()));
        t.MostrarMarca();
        Console.WriteLine(t.Pulgadas+" pulgadas");
    }
}`,
      hints: [
        "Tablet : Dispositivo.",
        "Encadena base(m).",
        "Reutiliza MostrarMarca.",
      ],
      difficulty: "easy",
      xpReward: 22,
      structure: {
        classes: [
          {
            name: "Dispositivo",
            properties: [{ name: "Marca", visibility: "public", type: "string" }],
            constructors: [{ paramCount: 1 }],
            methods: [{ name: "MostrarMarca", visibility: "public" }],
          },
          {
            name: "Tablet",
            extends: "Dispositivo",
            properties: [{ name: "Pulgadas", visibility: "public", type: "int" }],
            constructors: [{ paramCount: 2, callsBase: true }],
          },
        ],
      },
    testCases: [
        {
          stdin: "CETI Tech\n10\n",
          expectedStdout: "CETI Tech\n10 pulgadas\n",
          visible: true,
        },
        {
          stdin: "X\n7\n",
          expectedStdout: "X\n7 pulgadas\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-base-instrumento",
      title: "Constructor base de instrumento",
      description: "Inicializa estado heredado y especializado.",
      prompt: "Instrumento recibe nombre; Guitarra : Instrumento recibe nombre y cuerdas. Describir devuelve \"nombre: N cuerdas\".",
      starterCode: `using System;
class Instrumento
{
}

class Guitarra : Instrumento
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Instrumento
{
    protected string nombre;
    public Instrumento(string n)
    {
        nombre=n;
    }
}

class Guitarra:Instrumento
{
    private int cuerdas;
    public Guitarra(string n, int c):base(n)
    {
        cuerdas=c;
    }
    public string Describir()
    {
        return nombre+": "+cuerdas+" cuerdas";
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Guitarra(Console.ReadLine(), int.Parse(Console.ReadLine())).Describir());
    }
}`,
      hints: [
        "nombre es protected.",
        "La base recibe nombre.",
        "La derivada recibe ambos.",
      ],
      difficulty: "easy",
      xpReward: 24,
      structure: {
        classes: [
          {
            name: "Instrumento",
            fields: [{ name: "nombre", visibility: "protected", type: "string" }],
            constructors: [{ paramCount: 1 }],
          },
          {
            name: "Guitarra",
            extends: "Instrumento",
            constructors: [{ paramCount: 2, callsBase: true }],
            methods: [{ name: "Describir", visibility: "public", returnType: "string" }],
          },
        ],
      },
    testCases: [
        {
          stdin: "Acústica\n6\n",
          expectedStdout: "Acústica: 6 cuerdas\n",
          visible: true,
        },
        {
          stdin: "Bajo\n4\n",
          expectedStdout: "Bajo: 4 cuerdas\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-polimorfismo-envios",
      title: "Costo polimórfico de envíos",
      description: "Recorre subtipos con un contrato común.",
      prompt: "Lee costo base y recargo express. Envio conserva el costo y tiene virtual Costo(); EnvioExpress agrega el recargo mediante override. Crea Envio[2] con ambos e imprime los costos con dos decimales.",
      starterCode: `using System;
class Envio
{
}

class EnvioExpress : Envio
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Envio
{
    protected decimal costo;
    public Envio(decimal c)
    {
        costo=c;
    }
    public virtual decimal Costo()
    {
        return costo;
    }
}

class EnvioExpress:Envio
{
    private decimal recargo;
    public EnvioExpress(decimal c, decimal r):base(c)
    {
        recargo=r;
    }
    public override decimal Costo()
    {
        return costo+recargo;
    }
}

class Program
{
    static void Main()
    {
        decimal c=decimal.Parse(Console.ReadLine()), r=decimal.Parse(Console.ReadLine());
        Envio[] x=new Envio[]
        {
            new Envio(c), new EnvioExpress(c, r)
        }
        ;
        for(int i=0;i<x.Length;i++)Console.WriteLine(x[i].Costo().ToString("0.00"));
    }
}`,
      hints: [
        "La base conserva el costo y usa virtual.",
        "La derivada encadena base(c) y usa override.",
        "El arreglo se declara como Envio[].",
      ],
      difficulty: "medium",
      xpReward: 32,
      structure: {
        classes: [
          {
            name: "Envio",
            methods: [{ name: "Costo", visibility: "public", virtual: true, returnType: "decimal" }],
          },
          {
            name: "EnvioExpress",
            extends: "Envio",
            constructors: [{ paramCount: 2, callsBase: true }],
            methods: [{ name: "Costo", visibility: "public", override: true, returnType: "decimal" }],
          },
        ],
      },
    testCases: [
        {
          stdin: "50\n40\n",
          expectedStdout: "50.00\n90.00\n",
          visible: true,
        },
        {
          stdin: "10.5\n2.25\n",
          expectedStdout: "10.50\n12.75\n",
          visible: false,
        },
        {
          stdin: "0\n1\n",
          expectedStdout: "0.00\n1.00\n",
          visible: false,
        },
      ],
    },
    {
      // Antes esto era `Medicion` con Temperatura/Distancia: una
      // abstracción sin significado compartido real (convertir grados no es
      // la misma operación que convertir kilómetros; sólo compartían la
      // forma de la firma). Area() sí es una operación con el mismo
      // significado en cualquier figura.
      slug: "csharp-poo-abstract-medicion",
      title: "Figuras abstractas",
      description: "Implementa dos fórmulas de área detrás de un contrato.",
      prompt: "Figura abstracta declara Area(). Rectangulo recibe base y altura y devuelve base*altura; Circulo recibe radio y devuelve Math.PI*radio*radio. Lee base, altura y radio; usa Figura[2] e imprime las dos áreas con dos decimales.",
      starterCode: `using System;
abstract class Figura
{
}

class Rectangulo:Figura
{
}

class Circulo:Figura
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
abstract class Figura
{
    public abstract double Area();
}

class Rectangulo:Figura
{
    private double baseR;
    private double altura;
    public Rectangulo(double baseR, double altura)
    {
        this.baseR=baseR;
        this.altura=altura;
    }
    public override double Area()
    {
        return baseR*altura;
    }
}

class Circulo:Figura
{
    private double radio;
    public Circulo(double radio)
    {
        this.radio=radio;
    }
    public override double Area()
    {
        return Math.PI*radio*radio;
    }
}

class Program
{
    static void Main()
    {
        Figura[] f=new Figura[]
        {
            new Rectangulo(double.Parse(Console.ReadLine()), double.Parse(Console.ReadLine())),
            new Circulo(double.Parse(Console.ReadLine()))
        }
        ;
        for(int i=0;i<f.Length;i++)Console.WriteLine(f[i].Area().ToString("0.00"));
    }
}`,
      hints: [
        "Figura no se instancia.",
        "Cada clase redefine Area con su propia fórmula.",
        "Recorre el arreglo base; no distingas el tipo con if.",
      ],
      difficulty: "hard",
      xpReward: 40,
      structure: {
        classes: [
          {
            name: "Figura",
            abstract: true,
            methods: [{ name: "Area", visibility: "public", abstract: true, returnType: "double" }],
          },
          {
            name: "Rectangulo",
            extends: "Figura",
            methods: [{ name: "Area", visibility: "public", override: true, returnType: "double" }],
          },
          {
            name: "Circulo",
            extends: "Figura",
            methods: [{ name: "Area", visibility: "public", override: true, returnType: "double" }],
          },
        ],
      },
    testCases: [
        {
          stdin: "4\n2\n1\n",
          expectedStdout: "8.00\n3.14\n",
          visible: true,
        },
        {
          stdin: "10\n0.5\n2\n",
          expectedStdout: "5.00\n12.57\n",
          visible: false,
        },
      ],
    },
  ],
};
