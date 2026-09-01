import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — Encapsulamiento y constructores
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u02EncapsularExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-02-encapsular",
  unitTitle: "Encapsulamiento y constructores",
  unitIcon: "🔒",
  exercises: [
    {
      slug: "csharp-poo-propiedad-solo-lectura",
      title: "Código inmutable desde fuera",
      description: "Expone lectura y conserva escritura privada.",
      prompt: "Crea Credencial con Codigo de private set inicializado por constructor. Lee código e imprime \"Código: X\".",
      starterCode: `using System;
class Credencial
{
    /* propiedad y constructor */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Credencial
{
    public string Codigo
    {
        get;
        private set;
    }
    public Credencial(string codigo)
    {
        Codigo=codigo;
    }
}

class Program
{
    static void Main()
    {
        Credencial c=new Credencial(Console.ReadLine());
        Console.WriteLine("Código: "+c.Codigo);
    }
}`,
      hints: [
        "La propiedad es pública para lectura.",
        "Usa private set.",
        "Asigna en el constructor.",
      ],
      difficulty: "easy",
      xpReward: 20,
      structure: {
        classes: [
          {
            name: "Credencial",
            properties: [{ name: "Codigo", visibility: "public", type: "string" }],
            constructors: [{ paramCount: 1 }],
          },
        ],
      },
    testCases: [
        {
          stdin: "CETI-01\n",
          expectedStdout: "Código: CETI-01\n",
          visible: true,
        },
        {
          stdin: "A B 9\n",
          expectedStdout: "Código: A B 9\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-setter-controlado",
      title: "Nivel de volumen controlado",
      description: "Protege un rango mediante un método.",
      prompt: "Audio inicia en 0. EstablecerVolumen acepta 0..100; fuera del rango deja el valor anterior. Lee dos intentos e imprime el nivel final.",
      starterCode: `using System;
class Audio
{
    /* Nivel y método */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Audio
{
    public int Nivel
    {
        get;
        private set;
    }
    public void EstablecerVolumen(int n)
    {
        if(n>=0&&n<=100)Nivel=n;
    }
}

class Program
{
    static void Main()
    {
        Audio a=new Audio();
        a.EstablecerVolumen(int.Parse(Console.ReadLine()));
        a.EstablecerVolumen(int.Parse(Console.ReadLine()));
        Console.WriteLine(a.Nivel);
    }
}`,
      hints: [
        "Nivel tiene private set.",
        "Sólo asigna dentro del rango.",
        "Aplica ambos intentos.",
      ],
      difficulty: "easy",
      xpReward: 22,
      structure: {
        classes: [
          {
            name: "Audio",
            properties: [{ name: "Nivel", visibility: "public", type: "int" }],
            methods: [{ name: "EstablecerVolumen", visibility: "public", paramCount: 1 }],
          },
        ],
      },
    testCases: [
        {
          stdin: "40\n80\n",
          expectedStdout: "80\n",
          visible: true,
        },
        {
          stdin: "55\n101\n",
          expectedStdout: "55\n",
          visible: false,
        },
        {
          stdin: "-1\n30\n",
          expectedStdout: "30\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-constructores-ticket",
      title: "Tickets con dos constructores",
      description: "Practica sobrecarga de construcción.",
      prompt: "Ticket(string concepto) usa importe 0; Ticket(string concepto, decimal importe) usa ambos. Lee concepto e importe; crea uno con cada constructor e imprime \"concepto: 0.00\" y \"concepto: importe\".",
      starterCode: `using System;
class Ticket
{
    /* dos constructores y Mostrar */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Ticket
{
    public string Concepto
    {
        get;
        private set;
    }
    public decimal Importe
    {
        get;
        private set;
    }
    public Ticket(string c)
    {
        Concepto=c;
        Importe=0m;
    }
    public Ticket(string c, decimal i)
    {
        Concepto=c;
        Importe=i;
    }
    public void Mostrar()
    {
        Console.WriteLine(Concepto+": "+Importe.ToString("0.00"));
    }
}

class Program
{
    static void Main()
    {
        string c=Console.ReadLine();
        decimal i=decimal.Parse(Console.ReadLine());
        new Ticket(c).Mostrar();
        new Ticket(c, i).Mostrar();
    }
}`,
      hints: [
        "Las firmas difieren en cantidad de parámetros.",
        "Inicializa todos los datos en ambos caminos.",
        "Usa formato 0.00.",
      ],
      difficulty: "medium",
      xpReward: 28,
      structure: {
        classes: [
          {
            name: "Ticket",
            properties: [
              { name: "Concepto", visibility: "public", type: "string" },
              { name: "Importe", visibility: "public", type: "decimal" },
            ],
            constructors: [{ paramCount: 1 }, { paramCount: 2 }],
            methods: [{ name: "Mostrar", visibility: "public" }],
          },
        ],
      },
    testCases: [
        {
          stdin: "Copias\n12.5\n",
          expectedStdout: "Copias: 0.00\nCopias: 12.50\n",
          visible: true,
        },
        {
          stdin: "Servicio especial\n1\n",
          expectedStdout: "Servicio especial: 0.00\nServicio especial: 1.00\n",
          visible: false,
        },
      ],
    },
    {
      // Antes esto era `Conversor`: una utilidad sin estado, instanciada
      // arbitrariamente sólo para tener un objeto sobre el cual llamar la
      // sobrecarga. Ahora la sobrecarga sirve a un objeto con estado real:
      // el cronómetro ACUMULA lo que se le registra, con dos formas de
      // decírselo.
      slug: "csharp-poo-sobrecarga-conversion",
      title: "Sobrecarga con intención",
      description: "Dos formas de registrar tiempo en el mismo cronómetro.",
      prompt: "Cronometro guarda AcumuladoMinutos (privado). Registrar(int minutos) le suma minutos directos. Registrar(int horas, int minutos) primero convierte a minutos y también los suma. Lee minutos sueltos, luego horas y minutos, registra ambos en el mismo cronómetro e imprime el acumulado final.",
      starterCode: `using System;
class Cronometro
{
    /* estado privado + dos Registrar */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Cronometro
{
    private int acumuladoMinutos;

    public void Registrar(int minutos)
    {
        acumuladoMinutos += minutos;
    }

    public void Registrar(int horas, int minutos)
    {
        acumuladoMinutos += horas * 60 + minutos;
    }

    public int AcumuladoMinutos()
    {
        return acumuladoMinutos;
    }
}

class Program
{
    static void Main()
    {
        int m = int.Parse(Console.ReadLine());
        int h = int.Parse(Console.ReadLine());
        int m2 = int.Parse(Console.ReadLine());

        Cronometro c = new Cronometro();
        c.Registrar(m);
        c.Registrar(h, m2);
        Console.WriteLine(c.AcumuladoMinutos());
    }
}`,
      hints: [
        "Mismo nombre `Registrar`, distinta lista de parámetros: eso es sobrecarga.",
        "Las dos versiones sólo difieren en cómo llegan los minutos; las dos suman al mismo campo.",
        "El acumulado es estado del cronómetro: no lo calcules en Main.",
      ],
      difficulty: "hard",
      xpReward: 36,
      structure: {
        classes: [
          {
            name: "Cronometro",
            fields: [{ name: "acumuladoMinutos", visibility: "private", type: "int" }],
            methods: [
              { name: "Registrar", visibility: "public", paramCount: 1 },
              { name: "Registrar", visibility: "public", paramCount: 2 },
              { name: "AcumuladoMinutos", visibility: "public", returnType: "int" },
            ],
          },
        ],
      },
    testCases: [
        {
          stdin: "3\n2\n15\n",
          expectedStdout: "138\n",
          visible: true,
        },
        {
          stdin: "0\n10\n0\n",
          expectedStdout: "600\n",
          visible: false,
        },
      ],
    },
  ],
};
