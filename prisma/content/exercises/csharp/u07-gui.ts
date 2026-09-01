import type { PracticeUnitSetDefinition } from "../types";

// =====================================================================
// Práctica independiente — Aplicaciones de escritorio con Windows Forms
//
// Ejercicios de TRANSFERENCIA: no repiten los retos de las lecciones.
// Todos son programas de consola de un solo archivo para el perfil
// csharp-mono-6.12.
// =====================================================================

export const u07GuiExercises: PracticeUnitSetDefinition = {
  courseSlug: "csharp-poo-1",
  unitSlug: "csharp-poo-07-gui",
  unitTitle: "Aplicaciones de escritorio con Windows Forms",
  unitIcon: "🪟",
  exercises: [
    {
      slug: "csharp-poo-gui-convertir-entrada",
      title: "Conversión segura para una interfaz",
      description: "Modela el resultado que un manejador presentaría.",
      prompt: "Lee texto. Usa int.TryParse; imprime \"Valor: N\" o \"Error de formato\".",
      starterCode: `using System;
class Program
{
    static void Main()
    {
        /* TryParse */
    }
}`,
      solutionCode: `using System;
class Program
{
    static void Main()
    {
        int n;
        if(int.TryParse(Console.ReadLine(), out n))Console.WriteLine("Valor: "+n);
        else Console.WriteLine("Error de formato");
    }
}`,
      hints: [
        "TryParse no lanza por formato.",
        "Usa out n.",
        "Sólo una salida.",
      ],
      difficulty: "easy",
      xpReward: 22,
      testCases: [
        {
          stdin: "42\n",
          expectedStdout: "Valor: 42\n",
          visible: true,
        },
        {
          stdin: "4x\n",
          expectedStdout: "Error de formato\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-gui-servicio-saludo",
      title: "Servicio reutilizable desde botón",
      description: "Extrae lógica que no depende de controles.",
      prompt: "Saludador.Crear(string) devuelve \"Hola, nombre\"; si Trim queda vacío devuelve \"Escribe tu nombre\". Lee e imprime. Luego úsalo sin cambios desde un botón local.",
      starterCode: `using System;
class Saludador
{
}

class Program
{
    static void Main()
    {
    }
}`,
      solutionCode: `using System;
class Saludador
{
    public string Crear(string nombre)
    {
        nombre=nombre.Trim();
        return nombre.Length==0?"Escribe tu nombre":"Hola, "+nombre;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Saludador().Crear(Console.ReadLine()));
    }
}`,
      hints: [
        "La clase no conoce TextBox.",
        "Aplica Trim.",
        "Devuelve el mensaje.",
      ],
      difficulty: "easy",
      xpReward: 24,
      structure: {
        classes: [
          {
            name: "Saludador",
            methods: [{ name: "Crear", visibility: "public", paramCount: 1, returnType: "string" }],
          },
        ],
      },
      testCases: [
        {
          stdin: "  Ana  \n",
          expectedStdout: "Hola, Ana\n",
          visible: true,
        },
        {
          stdin: "   \n",
          expectedStdout: "Escribe tu nombre\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-gui-flujo-cotizador",
      title: "Flujo de un cotizador",
      description: "Separa formato, dominio y mensaje.",
      prompt: "Lee precio y cantidad como texto. Si el formato falla imprime \"Revisa los formatos\". Cotizador rechaza cantidad <=0 con \"Cantidad invalida\". Si todo es válido imprime total 0.00.",
      starterCode: `using System;
class Cotizador
{
}

class Program
{
    static void Main()
    {
        /* flujo como manejador */
    }
}`,
      solutionCode: `using System;
class Cotizador
{
    public decimal Total(decimal p, int c)
    {
        if(c<=0)throw new ArgumentException("Cantidad invalida");
        return p*c;
    }
}

class Program
{
    static void Main()
    {
        decimal p;
        int c;
        if(!decimal.TryParse(Console.ReadLine(), out p)||!int.TryParse(Console.ReadLine(), out c))
        {
            Console.WriteLine("Revisa los formatos");
            return;
        }
        try
        {
            Console.WriteLine(new Cotizador().Total(p, c).ToString("0.00"));
        }
        catch(ArgumentException ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}`,
      hints: [
        "Primero TryParse.",
        "Después invoca el dominio.",
        "Captura la regla esperable.",
      ],
      difficulty: "medium",
      xpReward: 34,
      structure: {
        classes: [
          {
            name: "Cotizador",
            methods: [{ name: "Total", visibility: "public", paramCount: 2, returnType: "decimal" }],
          },
        ],
      },
      testCases: [
        {
          stdin: "10.5\n2\n",
          expectedStdout: "21.00\n",
          visible: true,
        },
        {
          stdin: "x\n2\n",
          expectedStdout: "Revisa los formatos\n",
          visible: false,
        },
        {
          stdin: "10\n0\n",
          expectedStdout: "Cantidad invalida\n",
          visible: false,
        },
      ],
    },
    {
      slug: "csharp-poo-gui-estado-entre-eventos",
      title: "Estado que sobrevive entre eventos",
      description: "Representa una referencia de servicio conservada por el formulario.",
      prompt: "ContadorServicio inicia en 0 y Registrar() incrementa. Lee tres comandos; por cada \"click\" registra, otros se ignoran. Imprime \"Registros: N\". En WinForms, una instancia sería campo del Form.",
      starterCode: `using System;
class ContadorServicio
{
}

class Program
{
    static void Main()
    {
        /* misma instancia para tres eventos */
    }
}`,
      solutionCode: `using System;
class ContadorServicio
{
    public int Total
    {
        get;
        private set;
    }
    public void Registrar()
    {
        Total++;
    }
}

class Program
{
    static void Main()
    {
        ContadorServicio s=new ContadorServicio();
        for(int i=0;i<3;i++)if(Console.ReadLine()=="click")s.Registrar();
        Console.WriteLine("Registros: "+s.Total);
    }
}`,
      hints: [
        "Crea el servicio antes del ciclo.",
        "No lo recrees por comando.",
        "Sólo click incrementa.",
      ],
      difficulty: "hard",
      xpReward: 40,
      structure: {
        classes: [
          {
            name: "ContadorServicio",
            properties: [{ name: "Total", visibility: "public", type: "int" }],
            methods: [{ name: "Registrar", visibility: "public", paramCount: 0 }],
          },
        ],
      },
      testCases: [
        {
          stdin: "click\nclick\notro\n",
          expectedStdout: "Registros: 2\n",
          visible: true,
        },
        {
          stdin: "otro\nclick\nclick\n",
          expectedStdout: "Registros: 2\n",
          visible: false,
        },
        {
          stdin: "otro\notro\notro\n",
          expectedStdout: "Registros: 0\n",
          visible: false,
        },
      ],
    },
  ],
};
