import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-indice-productos",
    title: "Índice de productos",
    description:
      "Construye un índice por código y consulta varios productos sin recorrer una lista.",
    prompt:
      "lee `n` pares `codigo`/`nombre`, después `q` códigos. Imprime el nombre o `NO` por cada consulta usando `Dictionary<string,string>`.",
    starterCode:
      "using System;\nusing System.Collections.Generic;\nclass Program { static void Main() { } }",
    solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());
        Dictionary<string,string> d=new Dictionary<string,string>();
        for(int i=0;i<n;i++) d.Add(Console.ReadLine(),Console.ReadLine());
        int q=int.Parse(Console.ReadLine());
        for(int i=0;i<q;i++)
        {
            string k=Console.ReadLine(), v;
            Console.WriteLine(d.TryGetValue(k,out v)?v:"NO");
        }
    }
}`,
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      {
        stdin: "2\nA\nMouse\nB\nTeclado\n3\nB\nX\nA\n",
        expectedStdout: "Teclado\nNO\nMouse\n",
        visible: true,
      },
      {
        stdin: "1\nP\nCable HDMI\n1\nP\n",
        expectedStdout: "Cable HDMI\n",
        visible: false,
      },
      {
        stdin: "1\nA\nUno\n2\nB\nA\n",
        expectedStdout: "NO\nUno\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-buscar-con-trygetvalue",
    title: "Búsqueda segura",
    description:
      "Traduce ausencia de una clave a una respuesta de dominio sin excepción.",
    prompt:
      "lee `n` alumnos (`registro`,`calificacion`) y un registro buscado. Imprime `Calificacion: N` o `No inscrito` usando `TryGetValue`.",
    starterCode:
      "using System;\nusing System.Collections.Generic;\nclass Program { static void Main() { } }",
    solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());
        Dictionary<string,int> cal=new Dictionary<string,int>();
        for(int i=0;i<n;i++) cal[Console.ReadLine()]=int.Parse(Console.ReadLine());
        string r=Console.ReadLine(); int v;
        Console.WriteLine(cal.TryGetValue(r,out v)?"Calificacion: "+v:"No inscrito");
    }
}`,
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      {
        stdin: "2\nA1\n80\nA2\n95\nA2\n",
        expectedStdout: "Calificacion: 95\n",
        visible: true,
      },
      {
        stdin: "1\nX\n0\nY\n",
        expectedStdout: "No inscrito\n",
        visible: false,
      },
      {
        stdin: "3\nA\n10\nB\n20\nC\n30\nA\n",
        expectedStdout: "Calificacion: 10\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-actualizar-stock",
    title: "Actualiza existencias",
    description: "Aplica movimientos sobre productos localizados por clave.",
    prompt:
      "lee `n` productos (`codigo`,`stock`), después `m` movimientos `CODIGO CAMBIO`. Sólo aplica movimientos a claves existentes. Al final lee una clave y muestra su stock o `NO`.",
    starterCode:
      "using System;\nusing System.Collections.Generic;\nclass Program { static void Main() { } }",
    solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());
        Dictionary<string,int> d=new Dictionary<string,int>();
        for(int i=0;i<n;i++) d[Console.ReadLine()]=int.Parse(Console.ReadLine());
        int m=int.Parse(Console.ReadLine());
        for(int i=0;i<m;i++)
        {
            string[] p=Console.ReadLine().Split(' ');
            if(d.ContainsKey(p[0])) d[p[0]]+=int.Parse(p[1]);
        }
        string q=Console.ReadLine(); int v;
        Console.WriteLine(d.TryGetValue(q,out v)?v.ToString():"NO");
    }
}`,
    difficulty: "medium",
    xpReward: 30,
    testCases: [
      {
        stdin: "1\nP1\n5\n2\nP1 3\nP1 -2\nP1\n",
        expectedStdout: "6\n",
        visible: true,
      },
      {
        stdin: "1\nA\n1\n1\nX 9\nA\n",
        expectedStdout: "1\n",
        visible: false,
      },
      {
        stdin: "2\nA\n10\nB\n0\n3\nB 5\nA -10\nB 2\nB\n",
        expectedStdout: "7\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-directorio-clientes",
    title: "Directorio de clientes",
    description: "Encapsula un diccionario de objetos detrás de operaciones del dominio.",
    prompt:
      "crea `Cliente(Id,Nombre)` y `Directorio` con un `Dictionary<string,Cliente>` privado, `Agregar`, `Buscar` y `Eliminar`. Procesa comandos `A id nombre`, `B id`, `E id`. Los nombres del ejercicio son una sola palabra. `A` imprime `OK` o `DUP`; `B` imprime nombre o `NO`; `E` no imprime.",
    starterCode:
      "using System;\nusing System.Collections.Generic;\nclass Cliente { }\nclass Directorio { }\nclass Program { static void Main() { } }",
    solutionCode: `using System;
using System.Collections.Generic;
class Cliente
{
    public string Id{get;private set;} public string Nombre{get;private set;}
    public Cliente(string id,string nombre){Id=id;Nombre=nombre;}
}
class Directorio
{
    private Dictionary<string,Cliente> clientes=new Dictionary<string,Cliente>();
    public bool Agregar(Cliente c){if(clientes.ContainsKey(c.Id))return false;clientes.Add(c.Id,c);return true;}
    public Cliente Buscar(string id){Cliente c;return clientes.TryGetValue(id,out c)?c:null;}
    public void Eliminar(string id){clientes.Remove(id);}
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); Directorio d=new Directorio();
        for(int i=0;i<n;i++)
        {
            string[] p=Console.ReadLine().Split(' ');
            if(p[0]=="A") Console.WriteLine(d.Agregar(new Cliente(p[1],p[2]))?"OK":"DUP");
            else if(p[0]=="B"){Cliente c=d.Buscar(p[1]);Console.WriteLine(c==null?"NO":c.Nombre);}
            else if(p[0]=="E") d.Eliminar(p[1]);
        }
    }
}`,
    difficulty: "hard",
    xpReward: 38,
    testCases: [
      {
        stdin: "5\nA C1 Ana\nA C2 Luis\nB C1\nE C1\nB C1\n",
        expectedStdout: "OK\nOK\nAna\nNO\n",
        visible: true,
      },
      {
        stdin: "3\nA X Sol\nA X Otro\nB X\n",
        expectedStdout: "OK\nDUP\nSol\n",
        visible: false,
      },
      {
        stdin: "2\nB Z\nE Z\n",
        expectedStdout: "NO\n",
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
