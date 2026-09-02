import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-ordenar-productos-precio",
    title: "Ordena productos por precio",
    description: "Aplica burbuja a objetos y conserva juntos sus campos.",
    prompt:
      "lee `n` productos (`nombre`,`precio`), ordénalos por precio ascendente con burbuja manual e imprime sólo los nombres.",
    starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Program { static void Main() { } }`,
    solutionCode: `using System;
using System.Collections.Generic;
class Producto{public string Nombre{get;private set;}public int Precio{get;private set;}public Producto(string n,int p){Nombre=n;Precio=p;}}
class Program{static void Main(){int n=int.Parse(Console.ReadLine());List<Producto> a=new List<Producto>();for(int i=0;i<n;i++)a.Add(new Producto(Console.ReadLine(),int.Parse(Console.ReadLine())));for(int p=0;p<a.Count-1;p++)for(int j=0;j<a.Count-1-p;j++)if(a[j].Precio>a[j+1].Precio){Producto t=a[j];a[j]=a[j+1];a[j+1]=t;}for(int i=0;i<a.Count;i++)Console.WriteLine(a[i].Nombre);}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      {
        stdin: "3\nA\n30\nB\n10\nC\n20\n",
        expectedStdout: "B\nC\nA\n",
        visible: true,
      },
      {
        stdin: "2\nX\n1\nY\n2\n",
        expectedStdout: "X\nY\n",
        visible: false,
      },
      {
        stdin: "4\nA\n9\nB\n1\nC\n8\nD\n2\n",
        expectedStdout: "B\nD\nC\nA\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-ordenar-alumnos-nombre",
    title: "Orden alfabético por inserción",
    description: "Ordena nombres sin delegar el algoritmo a la biblioteca.",
    prompt: "lee `n` nombres y ordénalos ascendentemente con insertion sort manual.",
    starterCode: `using System;
using System.Collections.Generic;
class Program { static void Main() { } }`,
    solutionCode: `using System;
using System.Collections.Generic;
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); List<string> nombres=new List<string>();
        for(int i=0;i<n;i++)nombres.Add(Console.ReadLine());
        for(int i=1;i<nombres.Count;i++)
        {
            string actual=nombres[i]; int j=i-1;
            while(j>=0 && string.Compare(nombres[j],actual,StringComparison.Ordinal)>0)
            { nombres[j+1]=nombres[j]; j--; }
            nombres[j+1]=actual;
        }
        for(int i=0;i<nombres.Count;i++)Console.WriteLine(nombres[i]);
    }
}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      {
        stdin: "4\nMara\nAna\nLuis\nBeto\n",
        expectedStdout: "Ana\nBeto\nLuis\nMara\n",
        visible: true,
      },
      {
        stdin: "1\nA\n",
        expectedStdout: "A\n",
        visible: false,
      },
      {
        stdin: "3\nZ\nY\nX\n",
        expectedStdout: "X\nY\nZ\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-comparador-existencias",
    title: "Comparador de existencias",
    description: "Encapsula un criterio descendente en `IComparer<Producto>`.",
    prompt:
      "crea `Producto(Codigo,Stock)` y un `IComparer<Producto>` que ordene stock descendente y código ascendente en empate. Usa `List.Sort(comparador)` e imprime `codigo stock`.",
    starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Comparador : IComparer<Producto> { }
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Collections.Generic;
class Producto{public string Codigo{get;private set;}public int Stock{get;private set;}public Producto(string c,int s){Codigo=c;Stock=s;}}
class Comparador:IComparer<Producto>{public int Compare(Producto a,Producto b){if(a.Stock>b.Stock)return -1;if(a.Stock<b.Stock)return 1;return string.Compare(a.Codigo,b.Codigo,StringComparison.Ordinal);}}
class Program{static void Main(){int n=int.Parse(Console.ReadLine());List<Producto> a=new List<Producto>();for(int i=0;i<n;i++)a.Add(new Producto(Console.ReadLine(),int.Parse(Console.ReadLine())));a.Sort(new Comparador());for(int i=0;i<a.Count;i++)Console.WriteLine(a[i].Codigo+" "+a[i].Stock);}}`,
    difficulty: "medium",
    xpReward: 34,
    testCases: [
      {
        stdin: "3\nB\n5\nA\n5\nC\n8\n",
        expectedStdout: "C 8\nA 5\nB 5\n",
        visible: true,
      },
      {
        stdin: "1\nX\n0\n",
        expectedStdout: "X 0\n",
        visible: false,
      },
      {
        stdin: "3\nZ\n1\nY\n3\nX\n2\n",
        expectedStdout: "Y 3\nX 2\nZ 1\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-buscar-producto",
    title: "Busca un folio ordenado",
    description: "Implementa búsqueda binaria y devuelve una respuesta de dominio.",
    prompt:
      "lee `n` folios enteros ordenados y un folio objetivo. Imprime `ENCONTRADO i` o `NO`.",
    starterCode: `using System;
class Program { static void Main() { } }`,
    solutionCode: `using System;
class Program{static void Main(){int n=int.Parse(Console.ReadLine());int[] a=new int[n];for(int i=0;i<n;i++)a[i]=int.Parse(Console.ReadLine());int x=int.Parse(Console.ReadLine());int l=0,r=n-1,pos=-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==x){pos=m;break;}if(a[m]<x)l=m+1;else r=m-1;}Console.WriteLine(pos>=0?"ENCONTRADO "+pos:"NO");}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      {
        stdin: "5\n10\n20\n30\n40\n50\n40\n",
        expectedStdout: "ENCONTRADO 3\n",
        visible: true,
      },
      {
        stdin: "4\n1\n2\n3\n4\n9\n",
        expectedStdout: "NO\n",
        visible: false,
      },
      {
        stdin: "1\n7\n7\n",
        expectedStdout: "ENCONTRADO 0\n",
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
