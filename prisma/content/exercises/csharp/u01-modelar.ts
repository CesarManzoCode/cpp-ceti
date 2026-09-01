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
      // Objetivo único: crear y usar un objeto (etapa `crear-un-objeto`).
      // La clase y la lectura ya están escritas para que la única
      // habilidad evaluada sea new + asignación de campos + llamada a un
      // método que YA existe — no clase+método+objeto+I/O a la vez.
      slug: "csharp-poo-objeto-mascota",
      title: "Una mascota como objeto",
      description: "Crea el objeto, asígnale sus datos y úsalo.",
      prompt: "La clase Mascota ya está completa, con Nombre, Especie y el método Describir() (que imprime \"N es E\"). Main ya lee ambos datos. Te toca: crea el objeto, asígnale los dos campos y llama Describir().",
      starterCode: `using System;
class Mascota
{
    public string Nombre;
    public string Especie;

    public void Describir()
    {
        Console.WriteLine(Nombre + " es " + Especie);
    }
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        string especie = Console.ReadLine();

        // Crea el objeto, asígnale los datos y llama Describir()
    }
}`,
      solutionCode: `using System;
class Mascota
{
    public string Nombre;
    public string Especie;

    public void Describir()
    {
        Console.WriteLine(Nombre + " es " + Especie);
    }
}

class Program
{
    static void Main()
    {
        string nombre = Console.ReadLine();
        string especie = Console.ReadLine();

        Mascota m = new Mascota();
        m.Nombre = nombre;
        m.Especie = especie;
        m.Describir();
    }
}`,
      hints: [
        "Usa new Mascota() para crear el objeto.",
        "Asigna cada campo con el punto: m.Nombre = nombre;",
        "Describir ya está escrito: sólo llámalo.",
      ],
      difficulty: "easy",
      xpReward: 16,
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
      // Objetivo único: independencia de dos objetos (etapa
      // `clase-objeto-instancia`). Sin método `Encender()`: la prueba de
      // independencia es reasignar un campo y mostrar con
      // Console.WriteLine directo, igual que en la lección.
      slug: "csharp-poo-dos-lamparas",
      title: "Dos lámparas independientes",
      description: "Cambia una y comprueba que la otra no se entera.",
      prompt: "Lee dos colores. Crea dos objetos Lampara (campo público Color, sin métodos) y asígnales esos colores. Después cambia el Color de la PRIMERA lámpara a \"apagada\" y muestra las dos con Console.WriteLine, formato \"Luz COLOR\" — para comprobar que la segunda conserva su color original.",
      starterCode: `using System;
class Lampara
{
    /* completa: sólo un campo, sin métodos */
}

class Program
{
    static void Main()
    {
        string color1 = Console.ReadLine();
        string color2 = Console.ReadLine();

        /* dos new, apaga sólo la primera, muestra las dos */
    }
}`,
      solutionCode: `using System;
class Lampara
{
    public string Color;
}

class Program
{
    static void Main()
    {
        string color1 = Console.ReadLine();
        string color2 = Console.ReadLine();

        Lampara a = new Lampara();
        a.Color = color1;
        Lampara b = new Lampara();
        b.Color = color2;

        a.Color = "apagada";

        Console.WriteLine("Luz " + a.Color);
        Console.WriteLine("Luz " + b.Color);
    }
}`,
      hints: [
        "Usa dos expresiones new: una lámpara no puede compartirse con la otra.",
        "Sólo reasigna el Color de la primera, después de crear ambas.",
        "Imprime cada una con su propio Console.WriteLine, sin método.",
      ],
      difficulty: "easy",
      xpReward: 20,
      structure: {
        classes: [
          {
            name: "Lampara",
            fields: [{ name: "Color", visibility: "public", type: "string" }],
          },
        ],
      },
    testCases: [
        {
          stdin: "azul\nroja\n",
          expectedStdout: "Luz apagada\nLuz roja\n",
          visible: true,
        },
        {
          stdin: "blanco cálido\nverde\n",
          expectedStdout: "Luz apagada\nLuz verde\n",
          visible: false,
        },
      ],
    },
    {
      // Transferencia final de comportamiento/responsabilidad de la
      // unidad. El objetivo es dónde vive la regla (dentro de Usar), no
      // leer ni convertir datos — así que Main ya viene con la lectura y
      // el parseo resueltos.
      slug: "csharp-poo-bateria-comportamiento",
      title: "Batería que se descarga",
      description: "Coloca el cambio de estado en el objeto.",
      prompt: "Bateria inicia con carga leída. Usar(int puntos) resta sin bajar de cero — la regla la aplica la batería, no Main. Main ya lee la carga y los dos consumos, y ya crea el objeto e imprime el resultado; sólo falta la clase Bateria.",
      starterCode: `using System;
class Bateria
{
    /* Carga y Usar */
}

class Program
{
    static void Main()
    {
        int cargaInicial = int.Parse(Console.ReadLine());
        int consumo1 = int.Parse(Console.ReadLine());
        int consumo2 = int.Parse(Console.ReadLine());

        Bateria b = new Bateria();
        b.Carga = cargaInicial;
        b.Usar(consumo1);
        b.Usar(consumo2);

        Console.WriteLine(b.Carga);
    }
}`,
      solutionCode: `using System;
class Bateria
{
    public int Carga;
    public void Usar(int puntos)
    {
        Carga -= puntos;
        if (Carga < 0) Carga = 0;
    }
}

class Program
{
    static void Main()
    {
        int cargaInicial = int.Parse(Console.ReadLine());
        int consumo1 = int.Parse(Console.ReadLine());
        int consumo2 = int.Parse(Console.ReadLine());

        Bateria b = new Bateria();
        b.Carga = cargaInicial;
        b.Usar(consumo1);
        b.Usar(consumo2);

        Console.WriteLine(b.Carga);
    }
}`,
      hints: [
        "Usar cambia Carga; no lo hagas desde Main.",
        "Corrige el límite (Carga < 0) después de restar, dentro de Usar.",
        "Main ya está completo: no necesitas tocarlo.",
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
      // Alineado con la nueva secuencia de U1 (etapa `abstraccion-con-
      // criterio`): esta unidad enseña campos públicos y métodos. `private`
      // y los constructores llegan en U2. El enunciado plantea una
      // decisión real —cinco candidatos, sólo tres pertenecen al modelo—
      // ANTES de dar la forma exacta que se va a calificar; no dicta el
      // modelo desde la primera línea.
      slug: "csharp-poo-abstraer-casillero",
      title: "Abstracción de un casillero",
      description: "Decide qué pertenece al modelo antes de programarlo.",
      prompt: `El taller de casilleros va a registrar préstamos: quién tiene cada casillero y si está libre u ocupado. Antes de programar, decide cuáles de estos cinco datos pertenecen a ese problema:

- el número del casillero
- quién lo tiene ahora mismo
- si está ocupado
- el color de la puerta
- la marca del candado

Sólo tres son relevantes para registrar préstamos; los otros dos no ayudan a identificar el casillero, a saber quién lo ocupa ni a decidir si está libre. Modela \`Casillero\` con exactamente esos tres como campos públicos: \`Numero\` (int), \`Propietario\` (string) y \`Ocupado\` (bool). Agrega \`Ocupar(string quien)\` —guarda al propietario y marca ocupado— y \`Liberar()\` —vacía el propietario con "" y marca libre—. \`Mostrar()\` imprime "NUM | PROPIETARIO | ocupado" o "NUM | libre" según el estado. Lee número, primer propietario y una orden ("liberar" o cualquier otra cosa); ocupa el casillero y, si la orden es liberar, libéralo. Después muestra el casillero.`,
      starterCode: `using System;
class Casillero
{
    /* Sólo los tres datos que decidiste que pertenecen al modelo */
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
