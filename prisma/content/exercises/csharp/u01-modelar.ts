import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — De problemas a objetos
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u01ModelarExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-01-modelar",
  unitTitle: "De problemas a objetos",
  unitIcon: "🧱",
  exercises: [
    {
      slug: "csharp-poo-objeto-mascota",
      title: "Una mascota como objeto",
      description: "Modela dos datos y un comportamiento.",
      prompt: "Lee nombre y especie. Crea Mascota y llama Describir para imprimir \"N es E\".",
      starterCode: `using System;
class Mascota
{
    /* estado y método */
}

class Program
{
    static void Main()
    {
        /* lee y usa el objeto */
    }
}`,
      solutionCode: `using System;
class Mascota
{
    public string Nombre;
    public string Especie;
    public void Describir()
    {
        Console.WriteLine(Nombre+" es "+Especie);
    }
}

class Program
{
    static void Main()
    {
        Mascota m=new Mascota();
        m.Nombre=Console.ReadLine();
        m.Especie=Console.ReadLine();
        m.Describir();
    }
}`,
      hints: [
        "Los datos pertenecen a Mascota.",
        "Crea exactamente una instancia.",
        "Describir imprime el estado.",
      ],
      difficulty: "easy",
      xpReward: 18,
      testCases: [
        {
          stdin: "Luna\ngato\n",
          expectedStdout: "Luna es gato\n",
          visible: true,
        },
        {
          stdin: "Rex 2\nperro guía\n",
          expectedStdout: "Rex 2 es perro guía\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-dos-lamparas",
      title: "Dos lámparas independientes",
      description: "Demuestra que dos instancias conservan estados distintos.",
      prompt: "Lee dos colores. Crea dos Lampara con campo Color y método Encender; imprime \"Luz COLOR\" para cada una.",
      starterCode: `using System;
class Lampara
{
    /* completa */
}

class Program
{
    static void Main()
    {
        /* dos new */
    }
}`,
      solutionCode: `using System;
class Lampara
{
    public string Color;
    public void Encender()
    {
        Console.WriteLine("Luz "+Color);
    }
}

class Program
{
    static void Main()
    {
        Lampara a=new Lampara();
        a.Color=Console.ReadLine();
        Lampara b=new Lampara();
        b.Color=Console.ReadLine();
        a.Encender();
        b.Encender();
    }
}`,
      hints: [
        "Usa dos expresiones new.",
        "No uses un campo static.",
        "Llama el método en orden.",
      ],
      difficulty: "easy",
      xpReward: 20,
      testCases: [
        {
          stdin: "azul\nroja\n",
          expectedStdout: "Luz azul\nLuz roja\n",
          visible: true,
        },
        {
          stdin: "blanco cálido\nverde\n",
          expectedStdout: "Luz blanco cálido\nLuz verde\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-bateria-comportamiento",
      title: "Batería que se descarga",
      description: "Coloca el cambio de estado en el objeto.",
      prompt: "Bateria inicia con carga leída. Usar(int puntos) resta sin bajar de cero. Lee carga y dos consumos; imprime el valor final.",
      starterCode: `using System;
class Bateria
{
    /* Carga y Usar */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Bateria
{
    public int Carga;
    public void Usar(int puntos)
    {
        Carga-=puntos;
        if(Carga<0) Carga=0;
    }
}

class Program
{
    static void Main()
    {
        Bateria b=new Bateria();
        b.Carga=int.Parse(Console.ReadLine());
        b.Usar(int.Parse(Console.ReadLine()));
        b.Usar(int.Parse(Console.ReadLine()));
        Console.WriteLine(b.Carga);
    }
}`,
      hints: [
        "Usar cambia Carga.",
        "Corrige el límite después de restar.",
        "Main no debe calcular el saldo.",
      ],
      difficulty: "medium",
      xpReward: 28,
      testCases: [
        {
          stdin: "100\n20\n30\n",
          expectedStdout: "50\n",
          visible: true,
        },
        {
          stdin: "10\n8\n9\n",
          expectedStdout: "0\n",
          visible: false,
        },
        {
          stdin: "0\n1\n1\n",
          expectedStdout: "0\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-abstraer-casillero",
      title: "Abstracción de un casillero",
      description: "Selecciona sólo el estado necesario para abrir y cerrar.",
      prompt: "Modela Casillero con número, propietario y estado abierto. Abrir(clave) abre sólo si coincide con la clave guardada. Lee número, propietario, clave registrada e intento; imprime \"NUM | PROPIETARIO | abierto/cerrado\". No imprimas la clave.",
      starterCode: `using System;
class Casillero
{
    /* abstrae datos y operaciones */
}

class Program
{
    static void Main()
    {
        /* completa */
    }
}`,
      solutionCode: `using System;
class Casillero
{
    public int Numero;
    public string Propietario;
    private string clave;
    private bool abierto;
    public Casillero(int n, string p, string c)
    {
        Numero=n;
        Propietario=p;
        clave=c;
    }
    public void Abrir(string intento)
    {
        abierto=intento==clave;
    }
    public void Mostrar()
    {
        Console.WriteLine(Numero+" | "+Propietario+" | "+(abierto?"abierto":"cerrado"));
    }
}

class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());
        string p=Console.ReadLine(), c=Console.ReadLine(), i=Console.ReadLine();
        Casillero x=new Casillero(n, p, c);
        x.Abrir(i);
        x.Mostrar();
    }
}`,
      hints: [
        "La clave no forma parte de la salida.",
        "El estado abierto es bool.",
        "El comportamiento decide según el intento.",
      ],
      difficulty: "hard",
      xpReward: 36,
      testCases: [
        {
          stdin: "12\nIris\n4321\n4321\n",
          expectedStdout: "12 | Iris | abierto\n",
          visible: true,
        },
        {
          stdin: "7\nOmar R.\nabc\nABC\n",
          expectedStdout: "7 | Omar R. | cerrado\n",
          visible: false,
        },
      ],
    },
  ],
};
