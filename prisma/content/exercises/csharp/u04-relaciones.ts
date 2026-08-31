import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — Relaciones entre clases
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u04RelacionesExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-04-relaciones",
  unitTitle: "Relaciones entre clases",
  unitIcon: "🔗",
  exercises: [
    {
      slug: "csharp-poo-dependencia-formateador",
      title: "Dependencia temporal",
      description: "Pasa un colaborador como parámetro sin conservarlo.",
      prompt: "Formateador tiene Mayusculas(string). Reporte tiene Imprimir(string, Formateador) y no guarda el formateador. Lee texto e imprime en mayúsculas.",
      starterCode: `using System;
class Formateador
{
}

class Reporte
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Formateador
{
    public string Mayusculas(string s)
    {
        return s.ToUpper();
    }
}

class Reporte
{
    public void Imprimir(string s, Formateador f)
    {
        Console.WriteLine(f.Mayusculas(s));
    }
}

class Program
{
    static void Main()
    {
        new Reporte().Imprimir(Console.ReadLine(), new Formateador());
    }
}`,
      hints: [
        "El parámetro crea dependencia.",
        "Reporte no necesita un campo Formateador.",
        "Usa ToUpper.",
      ],
      difficulty: "easy",
      xpReward: 20,
      testCases: [
        {
          stdin: "hola ceti\n",
          expectedStdout: "HOLA CETI\n",
          visible: true,
        },
        {
          stdin: "Poo 1\n",
          expectedStdout: "POO 1\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-asociacion-entrenador",
      title: "Equipo y entrenador",
      description: "Modela una asociación estable.",
      prompt: "Equipo conserva una referencia a Entrenador recibido. Lee equipo y entrenador; imprime \"E entrenado por N\".",
      starterCode: `using System;
class Entrenador
{
}

class Equipo
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Entrenador
{
    public string Nombre
    {
        get;
        private set;
    }
    public Entrenador(string n)
    {
        Nombre=n;
    }
}

class Equipo
{
    public string Nombre
    {
        get;
        private set;
    }
    private Entrenador entrenador;
    public Equipo(string n, Entrenador e)
    {
        Nombre=n;
        entrenador=e;
    }
    public void Mostrar()
    {
        Console.WriteLine(Nombre+" entrenado por "+entrenador.Nombre);
    }
}

class Program
{
    static void Main()
    {
        string e=Console.ReadLine(), n=Console.ReadLine();
        new Equipo(e, new Entrenador(n)).Mostrar();
    }
}`,
      hints: [
        "Entrenador existe antes de Equipo.",
        "Equipo guarda la referencia.",
        "No heredes.",
      ],
      difficulty: "easy",
      xpReward: 22,
      testCases: [
        {
          stdin: "Halcones\nRita\n",
          expectedStdout: "Halcones entrenado por Rita\n",
          visible: true,
        },
        {
          stdin: "A 1\nProfe X\n",
          expectedStdout: "A 1 entrenado por Profe X\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-agregacion-sala-silla",
      title: "Sala agrega sillas",
      description: "Representa partes que pueden existir fuera del todo.",
      prompt: "Crea dos Silla fuera de Sala; Sala recibe Silla[2] y suma sus capacidades (cada silla vale 1). Lee nombre de sala y códigos de sillas; imprime \"Sala N: C1,C2 (2)\".",
      starterCode: `using System;
class Silla
{
}

class Sala
{
}

class Program
{
    static void Main()
    {
        /* objetos parte antes del todo */
    }
}`,
      solutionCode: `using System;
class Silla
{
    public string Codigo
    {
        get;
        private set;
    }
    public Silla(string c)
    {
        Codigo=c;
    }
}

class Sala
{
    private string nombre;
    private Silla[] sillas;
    public Sala(string n, Silla[] s)
    {
        nombre=n;
        sillas=s;
    }
    public void Mostrar()
    {
        Console.WriteLine("Sala "+nombre+": "+sillas[0].Codigo+","+sillas[1].Codigo+" ("+sillas.Length+")");
    }
}

class Program
{
    static void Main()
    {
        string n=Console.ReadLine();
        Silla a=new Silla(Console.ReadLine()), b=new Silla(Console.ReadLine());
        new Sala(n, new Silla[]{a, b}).Mostrar();
    }
}`,
      hints: [
        "Las sillas se crean fuera.",
        "Usa un arreglo fijo.",
        "Sala conserva el arreglo.",
      ],
      difficulty: "medium",
      xpReward: 29,
      testCases: [
        {
          stdin: "A\nS1\nS2\n",
          expectedStdout: "Sala A: S1,S2 (2)\n",
          visible: true,
        },
        {
          stdin: "Norte 3\nX\nY-9\n",
          expectedStdout: "Sala Norte 3: X,Y-9 (2)\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-composicion-expediente",
      title: "Expediente compuesto",
      description: "Crea una parte exclusivamente dentro del todo.",
      prompt: "Expediente recibe folio y nota; crea internamente Portada con el folio. Resumen imprime \"FOLIO | nota\". Portada no se construye en Main.",
      starterCode: `using System;
class Portada
{
}

class Expediente
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Portada
{
    public string Folio
    {
        get;
        private set;
    }
    public Portada(string f)
    {
        Folio=f;
    }
}

class Expediente
{
    private Portada portada;
    private string nota;
    public Expediente(string f, string n)
    {
        portada=new Portada(f);
        nota=n;
    }
    public void Resumen()
    {
        Console.WriteLine(portada.Folio+" | "+nota);
    }
}

class Program
{
    static void Main()
    {
        new Expediente(Console.ReadLine(), Console.ReadLine()).Resumen();
    }
}`,
      hints: [
        "Expediente controla el new de Portada.",
        "Main sólo crea Expediente.",
        "No uses herencia.",
      ],
      difficulty: "hard",
      xpReward: 38,
      testCases: [
        {
          stdin: "E-1\nIngreso\n",
          expectedStdout: "E-1 | Ingreso\n",
          visible: true,
        },
        {
          stdin: "ZX 9\nNota larga de prueba\n",
          expectedStdout: "ZX 9 | Nota larga de prueba\n",
          visible: false,
        },
      ],
    },
  ],
};
