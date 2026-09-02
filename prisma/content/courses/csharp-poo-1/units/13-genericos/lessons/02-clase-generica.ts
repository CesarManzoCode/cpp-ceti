import { defineLesson } from "../../../../../authoring";

export const leccion02 = defineLesson({
  slug: "clase-generica",
  title: "Una clase genérica que organiza muchos objetos",
  description:
    "Combina genéricos con `List<T>` para construir un contenedor reutilizable sin duplicar repositorios por entidad.",
  estimatedMinutes: 16,
  xpReward: 55,
  steps: [
    {
      type: "theory",
      markdown: `# El tipo genérico puede atravesar toda la clase

Un \`Repositorio<T>\` puede guardar una \`List<T>\`, recibir \`T\` en \`Agregar\` y devolver \`T\` al consultar. La clase no necesita conocer \`Producto\`, \`Cliente\` o \`Alumno\`.

Eso no significa que todos los repositorios deban ser iguales. El genérico sirve cuando las operaciones son realmente comunes.

En esta primera versión las operaciones son neutrales:

- agregar un elemento;
- consultar por posición;
- conocer la cantidad.

Más adelante una restricción permitirá pedir capacidades específicas a \`T\`.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;

class Repositorio<T>
{
    private List<T> elementos = new List<T>();

    public void Agregar(T elemento) { elementos.Add(elemento); }
    public T Obtener(int indice) { return elementos[indice]; }
    public int Cantidad() { return elementos.Count; }
}

class Program
{
    static void Main()
    {
        Repositorio<string> nombres = new Repositorio<string>();
        nombres.Agregar("Ana");
        nombres.Agregar("Luis");
        Console.WriteLine(nombres.Cantidad());
        Console.WriteLine(nombres.Obtener(1));
    }
}`,
      explanation:
        "`Repositorio<string>` convierte todas las apariciones de `T` en `string`; otro repositorio puede usar otro tipo sin copiar la clase.",
      runnable: true,
      expectedOutput: `2
Luis`,
    },
    {
      type: "fill_blank",
      template: `class Repositorio<{{0}}>
{
    private List<{{1}}> datos = new List<T>();
    public void Agregar({{2}} item) { datos.Add(item); }
    public T Obtener(int i) { return datos[i]; }
}`,
      blanks: [{ answer: "T" }, { answer: "T" }, { answer: "T" }],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `Repositorio<T>` con `Agregar(T)`, `Obtener(int)` y `Cantidad()`. Lee `n` enteros, agrégalos a `Repositorio<int>`, después lee un índice válido e imprime primero la cantidad y luego el valor de esa posición.",
        starterCode: `using System;
using System.Collections.Generic;
class Repositorio<T> { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Repositorio<T>
{
    private List<T> datos = new List<T>();
    public void Agregar(T item) { datos.Add(item); }
    public T Obtener(int i) { return datos[i]; }
    public int Cantidad() { return datos.Count; }
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine());
        Repositorio<int> repo=new Repositorio<int>();
        for(int i=0;i<n;i++)repo.Agregar(int.Parse(Console.ReadLine()));
        int indice=int.Parse(Console.ReadLine());
        Console.WriteLine(repo.Cantidad());
        Console.WriteLine(repo.Obtener(indice));
    }
}`,
        hints: [
          "`List<T>` es válida dentro de otra clase genérica.",
          "`Obtener` retorna `T`.",
          "la instancia concreta es `Repositorio<int>`.",
        ],
        difficulty: "medium",
        xpReward: 32,
        testCases: [
          {
            visible: true,
            stdin: "3\n10\n20\n30\n1\n",
            expectedStdout: "3\n20\n",
          },
          {
            visible: false,
            stdin: "1\n-4\n0\n",
            expectedStdout: "1\n-4\n",
          },
          {
            visible: false,
            stdin: "4\n7\n8\n9\n10\n3\n",
            expectedStdout: "4\n10\n",
          },
        ],
      },
    },
  ],
});
