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
      structure: {
        classes: [
          {
            name: "Mascota",
            fields: [
              { name: "Nombre", visibility: "public", type: "string" },
              { name: "Especie", visibility: "public", type: "string" },
            ],
            methods: [{ name: "Describir", visibility: "public" }],
          },
        ],
      },
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
      structure: {
        classes: [
          {
            name: "Lampara",
            fields: [{ name: "Color", visibility: "public", type: "string" }],
            methods: [{ name: "Encender", visibility: "public" }],
          },
        ],
      },
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
      structure: {
        classes: [
          {
            name: "Bateria",
            fields: [{ name: "Carga", visibility: "public", type: "int" }],
            methods: [{ name: "Usar", visibility: "public", paramCount: 1 }],
          },
        ],
      },
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
      // Alineado con la nueva secuencia de U1 (`CS-01`): esta unidad enseña
      // campos públicos y métodos. `private` y los constructores llegan en
      // U2, así que el ejercicio pide DECIDIR qué miembros entran al modelo
      // —que es la etapa 6 de la unidad— sin sintaxis que todavía no se ha
      // visto.
      slug: "csharp-poo-abstraer-casillero",
      title: "Abstracción de un casillero",
      description: "Selecciona sólo el estado necesario para prestar y liberar.",
      prompt: "El taller sólo necesita saber, de cada casillero, su número, quién lo tiene y si está ocupado. Modela `Casillero` con campos públicos `Numero` (int), `Propietario` (string) y `Ocupado` (bool), y con los métodos `Ocupar(string quien)` —guarda al propietario y marca ocupado— y `Liberar()` —vacía el propietario con \"\" y marca libre—. `Mostrar()` imprime \"NUM | PROPIETARIO | ocupado\" o \"NUM | libre\" según el estado. Lee número, primer propietario y una orden (\"liberar\" o cualquier otra cosa); ocupa el casillero y, si la orden es liberar, libéralo. Después muestra el casillero.",
      starterCode: `using System;
class Casillero
{
    /* Sólo lo que este sistema necesita: numero, propietario, ocupado */
}

class Program
{
    static void Main()
    {
        int numero = int.Parse(Console.ReadLine());
        string quien = Console.ReadLine();
        string orden = Console.ReadLine();
        /* completa */
    }
}`,
      solutionCode: `using System;
class Casillero
{
    public int Numero;
    public string Propietario;
    public bool Ocupado;

    public void Ocupar(string quien)
    {
        Propietario = quien;
        Ocupado = true;
    }

    public void Liberar()
    {
        Propietario = "";
        Ocupado = false;
    }

    public void Mostrar()
    {
        if (Ocupado)
        {
            Console.WriteLine(Numero + " | " + Propietario + " | ocupado");
        }
        else
        {
            Console.WriteLine(Numero + " | libre");
        }
    }
}

class Program
{
    static void Main()
    {
        int numero = int.Parse(Console.ReadLine());
        string quien = Console.ReadLine();
        string orden = Console.ReadLine();

        Casillero c = new Casillero();
        c.Numero = numero;
        c.Ocupar(quien);
        if (orden == "liberar")
        {
            c.Liberar();
        }
        c.Mostrar();
    }
}`,
      hints: [
        "Tres campos públicos y tres métodos: nada más entra al modelo.",
        "Ocupar recibe el nombre; Liberar no recibe nada.",
        "Mostrar decide con un if entre las dos formas de la línea.",
      ],
      difficulty: "medium",
      xpReward: 30,
      structure: {
        classes: [
          {
            name: "Casillero",
            fields: [
              { name: "Numero", visibility: "public", type: "int" },
              { name: "Propietario", visibility: "public", type: "string" },
              { name: "Ocupado", visibility: "public", type: "bool" },
            ],
            methods: [
              { name: "Ocupar", visibility: "public", paramCount: 1 },
              { name: "Liberar", visibility: "public", paramCount: 0 },
              { name: "Mostrar", visibility: "public", paramCount: 0 },
            ],
          },
        ],
      },
      testCases: [
        {
          stdin: "12\nIris\nusar\n",
          expectedStdout: "12 | Iris | ocupado\n",
          visible: true,
        },
        {
          stdin: "7\nOmar R.\nliberar\n",
          expectedStdout: "7 | libre\n",
          visible: false,
        },
        {
          stdin: "103\nAna Sofia\nliberar\n",
          expectedStdout: "103 | libre\n",
          visible: false,
        },
      ],
    },
  ],
};
