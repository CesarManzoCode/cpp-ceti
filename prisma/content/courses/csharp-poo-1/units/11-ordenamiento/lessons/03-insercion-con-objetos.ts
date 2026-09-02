import { defineLesson } from "../../../../../authoring";

export const leccion03 = defineLesson({
  slug: "insercion-con-objetos",
  title: "Inserción con objetos",
  description:
    "Construye una zona ordenada y coloca cada objeto en la posición que le corresponde.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Inserción: mantener una parte ya ordenada

Insertion sort considera que la parte izquierda de la colección ya está ordenada. Toma el siguiente objeto, desplaza hacia la derecha los que deberían ir después y lo inserta en el hueco.

La idea es parecida a ordenar cartas en la mano:

1. tomas una carta nueva;
2. mueves las mayores;
3. colocas la carta donde deja de romper el orden.

En objetos, la lógica de “mayor” vuelve a depender del criterio. Esta lección usa nombre alfabético para mostrar que el algoritmo no está casado con números.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Producto
{
    public string Nombre{get;private set;}
    public Producto(string nombre){Nombre=nombre;}
}
class Program
{
    static void Main()
    {
        List<Producto> p=new List<Producto>();
        p.Add(new Producto("Teclado")); p.Add(new Producto("Cable")); p.Add(new Producto("Mouse"));

        for(int i=1;i<p.Count;i++)
        {
            Producto actual=p[i];
            int j=i-1;
            while(j>=0 && string.Compare(p[j].Nombre,actual.Nombre,StringComparison.Ordinal)>0)
            {
                p[j+1]=p[j];
                j--;
            }
            p[j+1]=actual;
        }

        for(int i=0;i<p.Count;i++)Console.WriteLine(p[i].Nombre);
    }
}`,
      explanation:
        "actual se guarda fuera de la lista temporalmente mientras se desplazan hacia la derecha los nombres posteriores alfabéticamente.",
      runnable: true,
      expectedOutput: "Cable\nMouse\nTeclado",
    },
    {
      type: "quiz",
      question:
        "durante insertion sort, ¿qué representa la zona `0..i-1` antes de insertar el elemento `i`?",
      options: [
        "Una zona todavía sin revisar.",
        "Una zona que ya está ordenada según el criterio.",
        "Los elementos eliminados.",
        "Una pila temporal.",
      ],
      correctIndex: 1,
      explanation:
        "durante insertion sort, la zona `0..i-1` ya está ordenada según el criterio.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Lee `n` nombres de productos y ordénalos alfabéticamente con **insertion sort implementado por ti** usando `string.Compare(..., StringComparison.Ordinal)`. Imprime un nombre por línea. No uses `Sort`.",
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
        hints: [
          "empieza en i=1",
          "guarda el elemento actual",
          "desplaza mientras el anterior sea mayor según string.Compare",
        ],
        difficulty: "medium",
        xpReward: 34,
        testCases: [
          {
            stdin: "3\nTeclado\nCable\nMouse\n",
            expectedStdout: "Cable\nMouse\nTeclado\n",
            visible: true,
          },
          {
            stdin: "1\nZeta\n",
            expectedStdout: "Zeta\n",
            visible: false,
          },
          {
            stdin: "4\nD\nB\nC\nA\n",
            expectedStdout: "A\nB\nC\nD\n",
            visible: false,
          },
        ],
      },
    },
  ],
});
