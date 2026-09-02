import { defineLesson } from "../../../../../authoring";

export const leccion04 = defineLesson({
  slug: "restricciones-genericas",
  title: "Restricciones: qué exige el genérico a T",
  description:
    "Usa `where` para expresar capacidades mínimas y obtener seguridad de tipos dentro de una clase genérica.",
  estimatedMinutes: 17,
  xpReward: 60,
  steps: [
    {
      type: "theory",
      markdown: `# Un genérico sin restricciones sabe muy poco

Dentro de \`Repositorio<T>\`, el compilador no puede asumir que \`T\` tiene una propiedad \`Id\`, un constructor concreto o una clase base específica.

Una **restricción** declara qué tipos son aceptables. Ejemplos:

- \`where T : class\` → debe ser tipo de referencia;
- \`where T : Entidad\` → debe heredar de \`Entidad\`;
- \`where T : new()\` → debe tener constructor público sin parámetros.

En este curso usaremos una clase base porque ya conoces herencia. \`where T : Entidad\` permite que el repositorio use los miembros públicos definidos por \`Entidad\` sin cast.

La restricción no es decoración: convierte una expectativa implícita en contrato de compilación.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Entidad
{
    public string Id{get;private set;}
    public Entidad(string id){Id=id;}
}
class Producto:Entidad
{
    public Producto(string id):base(id){}
}
class Repositorio<T> where T : Entidad
{
    private List<T> datos=new List<T>();
    public void Agregar(T item){datos.Add(item);}
    public T Buscar(string id)
    {
        for(int i=0;i<datos.Count;i++)if(datos[i].Id==id)return datos[i];
        return null;
    }
}
class Program
{
    static void Main()
    {
        Repositorio<Producto> r=new Repositorio<Producto>();
        r.Agregar(new Producto("P1"));
        Console.WriteLine(r.Buscar("P1").Id);
    }
}`,
      explanation:
        "la restricción garantiza que cualquier `T` tiene `Id`; por eso `Buscar` puede usarlo sin saber la clase concreta.",
      runnable: true,
      expectedOutput: `P1`,
    },
    {
      type: "quiz",
      question: "¿qué impide `where T : Entidad`?",
      options: [
        "Crear `Repositorio<Producto>` si `Producto : Entidad`.",
        "Crear `Repositorio<int>`, porque `int` no deriva de `Entidad`.",
        "Usar `Id` dentro del repositorio.",
        "Crear varias instancias del repositorio.",
      ],
      correctIndex: 1,
      explanation:
        "Crear `Repositorio<int>`, porque `int` no deriva de `Entidad`.",
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Crea base `Entidad` con propiedad pública `Id` y constructor. Crea `Alumno : Entidad` con `Nombre`. Implementa `Repositorio<T> where T : Entidad` con `Agregar` y `Buscar(id)`.\n\nLee `n` alumnos (`id`,`nombre`) y luego un id. Imprime el nombre o `NO`.",
        starterCode: `using System;
using System.Collections.Generic;
class Entidad { }
class Alumno : Entidad { }
class Repositorio<T> where T : Entidad { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Entidad
{
    public string Id{get;private set;}
    public Entidad(string id){Id=id;}
}
class Alumno:Entidad
{
    public string Nombre{get;private set;}
    public Alumno(string id,string nombre):base(id){Nombre=nombre;}
}
class Repositorio<T> where T : Entidad
{
    private List<T> datos=new List<T>();
    public void Agregar(T x){datos.Add(x);}
    public T Buscar(string id){for(int i=0;i<datos.Count;i++)if(datos[i].Id==id)return datos[i];return null;}
}
class Program
{
    static void Main()
    {
        int n=int.Parse(Console.ReadLine()); Repositorio<Alumno> r=new Repositorio<Alumno>();
        for(int i=0;i<n;i++)r.Agregar(new Alumno(Console.ReadLine(),Console.ReadLine()));
        Alumno a=r.Buscar(Console.ReadLine());
        Console.WriteLine(a==null?"NO":a.Nombre);
    }
}`,
        hints: [
          "`Alumno` llama `base(id)`.",
          "la restricción va después del nombre de clase.",
          "`Buscar` puede usar `Id` porque `T : Entidad`.",
        ],
        difficulty: "hard",
        xpReward: 40,
        testCases: [
          {
            visible: true,
            stdin: "2\nA1\nAna\nA2\nLuis\nA2\n",
            expectedStdout: "Luis\n",
          },
          {
            visible: false,
            stdin: "1\nX\nSol\nY\n",
            expectedStdout: "NO\n",
          },
          {
            visible: false,
            stdin: "3\nA\nUno\nB\nDos\nC\nTres\nA\n",
            expectedStdout: "Uno\n",
          },
        ],
      },
    },
  ],
});
