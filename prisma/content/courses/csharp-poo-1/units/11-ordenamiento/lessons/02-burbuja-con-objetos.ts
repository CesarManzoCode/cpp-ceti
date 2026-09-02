import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "burbuja-con-objetos",
  title: "Burbuja con objetos",
  description:
    "Implementa un ordenamiento básico sobre una lista de objetos y razona cada intercambio.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Burbuja: comparar vecinos y corregir inversiones

El ordenamiento burbuja recorre pares vecinos. Si están al revés según el criterio, los intercambia. Después de una pasada completa, uno de los elementos extremos queda en su lugar definitivo.

Para \`n\` elementos, una implementación pedagógica usa dos ciclos:

- el externo controla cuántas pasadas faltan;
- el interno compara \`j\` con \`j + 1\`.

No es el algoritmo más eficiente para colecciones grandes. Aquí importa porque obliga a hacer explícitos el criterio, la comparación y el intercambio. Más adelante puedes usar implementaciones de biblioteca entendiendo qué problema resuelven.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Producto
{
    public string Nombre { get; private set; }
    public int Precio { get; private set; }
    public Producto(string nombre,int precio){Nombre=nombre;Precio=precio;}
}
class Program
{
    static void Main()
    {
        List<Producto> p=new List<Producto>();
        p.Add(new Producto("A",30));
        p.Add(new Producto("B",10));
        p.Add(new Producto("C",20));

        for(int pasada=0;pasada<p.Count-1;pasada++)
        {
            for(int j=0;j<p.Count-1-pasada;j++)
            {
                if(p[j].Precio>p[j+1].Precio)
                {
                    Producto temp=p[j]; p[j]=p[j+1]; p[j+1]=temp;
                }
            }
        }

        for(int i=0;i<p.Count;i++) Console.WriteLine(p[i].Nombre);
    }
}`,
      explanation:
        "la condición sólo conoce el criterio “precio ascendente”; el intercambio mueve objetos completos, no sólo sus precios.",
      runnable: true,
      expectedOutput: "B\nC\nA",
    },
    {
      type: "code_completion",
      prompt: "ordena las líneas del intercambio correcto de dos objetos vecinos.",
      lines: [
        "Producto temp = productos[j];",
        "productos[j] = productos[j + 1];",
        "productos[j + 1] = temp;",
      ],
      explanation:
        "guardar el primero evita perder su referencia antes de sobrescribir la posición.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n` productos (`nombre`, `precio`) y ordénalos por precio ascendente usando **burbuja implementada por ti**; no uses `Sort`. Imprime `NOMBRE PRECIO`, uno por línea.",
        starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Producto
{
    public string Nombre{get;private set;} public int Precio{get;private set;}
    public Producto(string nombre,int precio){Nombre=nombre;Precio=precio;}
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); List<Producto> p=new List<Producto>();
        for(int i=0;i<n;i++)p.Add(new Producto(Console.ReadLine(),int.Parse(Console.ReadLine())));
        for(int pasada=0;pasada<p.Count-1;pasada++)
            for(int j=0;j<p.Count-1-pasada;j++)
                if(p[j].Precio>p[j+1].Precio){Producto t=p[j];p[j]=p[j+1];p[j+1]=t;}
        for(int i=0;i<p.Count;i++)Console.WriteLine(p[i].Nombre+" "+p[i].Precio);
    }
}`,
        hints: [
          "compara Precio",
          "el límite interno puede disminuir con cada pasada",
          "intercambia el objeto completo",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            stdin: "3\nA\n30\nB\n10\nC\n20\n",
            expectedStdout: "B 10\nC 20\nA 30\n",
            visible: true,
          },
          {
            stdin: "1\nSolo\n7\n",
            expectedStdout: "Solo 7\n",
            visible: false,
          },
          {
            stdin: "4\nA\n4\nB\n1\nC\n3\nD\n2\n",
            expectedStdout: "B 1\nD 2\nC 3\nA 4\n",
            visible: false,
          },
        ],
      },
    },
  ],
});
