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
      prompt: "Del UML Estudiante(-registro:string, +Nombre:string, +Estudiante(registro:string, nombre:string), +Presentar():string), implementa el constructor y Presentar que devuelva \"registro - Nombre\". Lee ambos e imprime.",
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
      structure: {
        classes: [
          {
            name: "Estudiante",
            fields: [{ name: "registro", visibility: "private", type: "string" }],
            properties: [{ name: "Nombre", visibility: "public", type: "string" }],
            constructors: [{ paramCount: 2 }],
            methods: [{ name: "Presentar", visibility: "public", returnType: "string" }],
          },
        ],
      },
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
      structure: {
        classes: [
          {
            name: "Cuenta",
            fields: [{ name: "saldo", visibility: "private", type: "decimal" }],
            constructors: [{ paramCount: 1 }],
            methods: [
              { name: "Depositar", visibility: "public", paramCount: 1, returnType: "void" },
              { name: "Consultar", visibility: "public", returnType: "decimal" },
            ],
          },
        ],
      },
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
      // Antes pedía implementar Pelicula y nunca tocaba UML: sólo evaluaba
      // C#. Ahora la clase ya está completa y lo que se evalúa es la
      // extracción — el alumno produce el diagrama de ESA clase como texto,
      // con el mismo formato de compartimentos usado en la unidad.
      slug: "csharp-poo-codigo-a-uml-pelicula",
      title: "De la clase al diagrama",
      description: "Extrae el diagrama UML de una clase ya escrita.",
      prompt: "La clase Pelicula ya está completa; no la modifiques. Completa Main para que imprima su diagrama UML con el mismo formato de compartimentos visto en la unidad: nombre, atributos con visibilidad, separador, y operaciones con parámetros y retorno.",
      starterCode: `using System;
class Pelicula
{
    private int duracion;
    public string Titulo { get; private set; }
    public Pelicula(string titulo, int duracion)
    {
        Titulo = titulo;
        this.duracion = duracion;
    }
    public bool EsLarga()
    {
        return duracion > 120;
    }
}

class Program
{
    static void Main()
    {
        // Imprime el diagrama de Pelicula: nombre, línea de atributos
        // ("-duracion: int" y "+Titulo: string"), separador, y las dos
        // operaciones públicas con su firma y retorno.
    }
}`,
      solutionCode: `using System;
class Pelicula
{
    private int duracion;
    public string Titulo { get; private set; }
    public Pelicula(string titulo, int duracion)
    {
        Titulo = titulo;
        this.duracion = duracion;
    }
    public bool EsLarga()
    {
        return duracion > 120;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("Pelicula");
        Console.WriteLine("-duracion: int");
        Console.WriteLine("+Titulo: string");
        Console.WriteLine("-----------------");
        Console.WriteLine("+Pelicula(titulo: string, duracion: int)");
        Console.WriteLine("+EsLarga(): bool");
    }
}`,
      hints: [
        "No copies el cuerpo de EsLarga; el diagrama registra la firma, no el algoritmo.",
        "`Titulo` es una propiedad pública de lectura: se anota igual que un atributo público.",
        "El constructor también es una operación pública: aparece con sus dos parámetros.",
      ],
      difficulty: "medium",
      xpReward: 28,
      testCases: [
        {
          stdin: "",
          expectedStdout: "Pelicula\n-duracion: int\n+Titulo: string\n-----------------\n+Pelicula(titulo: string, duracion: int)\n+EsLarga(): bool\n",
          visible: true,
        },
      ],
    },
  ],
};
