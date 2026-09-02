import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "icomparer-e-icomparer",
  title: "Comparadores reutilizables con IComparer<T>",
  description:
    "Separa el criterio de orden de la entidad y permite ordenar el mismo tipo de varias maneras.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# Un producto puede tener más de un orden válido

Si \`Producto\` se ordena a veces por precio y a veces por stock, meter una única regla dentro de la clase vuelve rígido el diseño.

\`IComparer<T>\` representa un **objeto comparador**. Su método \`Compare(a,b)\` encapsula una regla concreta. Puedes crear \`ComparadorPorPrecio\`, \`ComparadorPorStock\` y reutilizarlos sin modificar \`Producto\`.

\`List<T>.Sort(comparador)\` aprovecha un algoritmo de biblioteca; aquí ya entendiste algoritmos básicos manuales y ahora separas dos responsabilidades:

- la biblioteca ejecuta el ordenamiento;
- tu comparador define el criterio.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Producto
{
    public string Nombre{get;private set;} public int Stock{get;private set;}
    public Producto(string nombre,int stock){Nombre=nombre;Stock=stock;}
}
class ComparadorPorStock : IComparer<Producto>
{
    public int Compare(Producto a, Producto b)
    {
        if(a.Stock<b.Stock)return -1;
        if(a.Stock>b.Stock)return 1;
        return string.Compare(a.Nombre,b.Nombre,StringComparison.Ordinal);
    }
}
class Program
{
    static void Main()
    {
        List<Producto> p=new List<Producto>();
        p.Add(new Producto("B",5)); p.Add(new Producto("A",2)); p.Add(new Producto("C",5));
        p.Sort(new ComparadorPorStock());
        for(int i=0;i<p.Count;i++)Console.WriteLine(p[i].Nombre);
    }
}`,
      explanation:
        "el comparador ordena por stock y usa nombre para desempatar. Producto no necesita conocer ese criterio.",
      runnable: true,
      expectedOutput: "A\nB\nC",
    },
    {
      type: "fill_blank",
      template: `class Comparador : {{0}}<Producto>
{
    public int {{1}}(Producto a, Producto b)
    {
        return a.Stock.CompareTo(b.Stock);
    }
}

productos.{{2}}(new Comparador());`,
      blanks: [
        { answer: "IComparer" },
        { answer: "Compare" },
        { answer: "Sort" },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea `Alumno(Nombre,Promedio)` y `ComparadorPromedio : IComparer<Alumno>` que ordene **promedio descendente**. Si dos promedios son iguales, desempata por nombre ascendente con `string.Compare(..., StringComparison.Ordinal)`. Lee `n`, ordena con `List<Alumno>.Sort(comparador)` e imprime `Nombre Promedio`.",
        starterCode: `using System;
using System.Collections.Generic;
class Alumno { }
class ComparadorPromedio : IComparer<Alumno> { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Alumno
{
    public string Nombre{get;private set;} public int Promedio{get;private set;}
    public Alumno(string nombre,int promedio){Nombre=nombre;Promedio=promedio;}
}
class ComparadorPromedio : IComparer<Alumno>
{
    public int Compare(Alumno a,Alumno b)
    {
        if(a.Promedio>b.Promedio)return -1;
        if(a.Promedio<b.Promedio)return 1;
        return string.Compare(a.Nombre,b.Nombre,StringComparison.Ordinal);
    }
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); List<Alumno> alumnos=new List<Alumno>();
        for(int i=0;i<n;i++)alumnos.Add(new Alumno(Console.ReadLine(),int.Parse(Console.ReadLine())));
        alumnos.Sort(new ComparadorPromedio());
        for(int i=0;i<alumnos.Count;i++)Console.WriteLine(alumnos[i].Nombre+" "+alumnos[i].Promedio);
    }
}`,
        hints: [
          "para descendente invierte la comparación numérica",
          "usa nombre sólo en empate",
          "pasa una instancia del comparador a Sort",
        ],
        difficulty: "medium",
        xpReward: 36,
        testCases: [
          {
            stdin: "3\nAna\n90\nLuis\n80\nBeto\n90\n",
            expectedStdout: "Ana 90\nBeto 90\nLuis 80\n",
            visible: true,
          },
          {
            stdin: "1\nX\n0\n",
            expectedStdout: "X 0\n",
            visible: false,
          },
          {
            stdin: "4\nZ\n5\nA\n5\nM\n9\nB\n1\n",
            expectedStdout: "M 9\nA 5\nZ 5\nB 1\n",
            visible: false,
          },
        ],
      },
    },
  ],
});
