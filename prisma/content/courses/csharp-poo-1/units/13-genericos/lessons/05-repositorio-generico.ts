import { defineLesson } from "../../../../../authoring";

export const leccion05 = defineLesson({
  slug: "repositorio-generico",
  title: "Repositorio genérico aplicado al dominio",
  description:
    "Integra colección, herencia y genéricos para reutilizar una operación real sin perder responsabilidades de dominio.",
  estimatedMinutes: 18,
  xpReward: 65,
  steps: [
    {
      type: "theory",
      markdown: `# Reutilizar la infraestructura, no mezclar los dominios

\`Repositorio<T>\` puede encargarse de almacenamiento en memoria y búsqueda por identidad. \`Producto\` y \`Cliente\` siguen teniendo reglas distintas.

Ese es el uso sano del genérico: reutilizar una **mecánica común** sin fingir que todas las entidades son iguales.

La clase base \`Entidad\` sólo contiene el contrato compartido (\`Id\`). El repositorio no debería empezar a saber de \`Stock\`, \`Correo\` o reglas particulares.

Más adelante la persistencia XML podrá recibir el mismo tipo genérico y guardar distintos bienes del inventario, que es precisamente uno de los productos parciales del programa oficial.`,
    },
    {
      type: "code_example",
      code: `using System;
using System.Collections.Generic;
class Entidad{public string Id{get;private set;}public Entidad(string id){Id=id;}}
class Producto:Entidad{public int Stock{get;private set;}public Producto(string id,int stock):base(id){Stock=stock;}}
class Cliente:Entidad{public string Nombre{get;private set;}public Cliente(string id,string nombre):base(id){Nombre=nombre;}}
class Repositorio<T> where T:Entidad
{
    private List<T> datos=new List<T>();
    public void Agregar(T x){datos.Add(x);}
    public T Buscar(string id){for(int i=0;i<datos.Count;i++)if(datos[i].Id==id)return datos[i];return null;}
}
class Program
{
    static void Main()
    {
        Repositorio<Producto> rp=new Repositorio<Producto>(); rp.Agregar(new Producto("P1",5));
        Repositorio<Cliente> rc=new Repositorio<Cliente>(); rc.Agregar(new Cliente("C1","Ana"));
        Console.WriteLine(rp.Buscar("P1").Stock);
        Console.WriteLine(rc.Buscar("C1").Nombre);
    }
}`,
      explanation:
        "la infraestructura de búsqueda es común; el estado específico sigue en cada clase concreta.",
      runnable: true,
      expectedOutput: `5
Ana`,
    },
    {
      type: "matching",
      pairs: [
        { left: "Entidad.Id", right: "Contrato mínimo compartido." },
        {
          left: "Repositorio<T>",
          right: "Mecánica reusable de almacenamiento/búsqueda.",
        },
        { left: "Producto.Stock", right: "Regla/dato específico de Producto." },
        { left: "Cliente.Nombre", right: "Dato específico de Cliente." },
      ],
    },
    {
      type: "code_challenge",
      exercise: {
        prompt:
          "Implementa `Entidad`, `Producto`, `Cliente` y `Repositorio<T> where T : Entidad`. Carga un producto y un cliente desde entrada. Después lee dos ids de consulta y muestra `PRODUCTO stock|NO` y `CLIENTE nombre|NO`.",
        starterCode: `using System;
using System.Collections.Generic;
class Entidad { }
class Producto : Entidad { }
class Cliente : Entidad { }
class Repositorio<T> where T : Entidad { }
class Program { static void Main() { } }`,
        solutionCode: `using System;
using System.Collections.Generic;
class Entidad{public string Id{get;private set;}public Entidad(string id){Id=id;}}
class Producto:Entidad{public int Stock{get;private set;}public Producto(string id,int stock):base(id){Stock=stock;}}
class Cliente:Entidad{public string Nombre{get;private set;}public Cliente(string id,string nombre):base(id){Nombre=nombre;}}
class Repositorio<T> where T:Entidad
{
    private List<T> datos=new List<T>();
    public void Agregar(T x){datos.Add(x);}
    public T Buscar(string id){for(int i=0;i<datos.Count;i++)if(datos[i].Id==id)return datos[i];return null;}
}
class Program
{
    static void Main()
    {
        Repositorio<Producto> rp=new Repositorio<Producto>();
        rp.Agregar(new Producto(Console.ReadLine(),int.Parse(Console.ReadLine())));
        Repositorio<Cliente> rc=new Repositorio<Cliente>();
        rc.Agregar(new Cliente(Console.ReadLine(),Console.ReadLine()));
        Producto p=rp.Buscar(Console.ReadLine()); Cliente c=rc.Buscar(Console.ReadLine());
        Console.WriteLine(p==null?"PRODUCTO NO":"PRODUCTO "+p.Stock);
        Console.WriteLine(c==null?"CLIENTE NO":"CLIENTE "+c.Nombre);
    }
}`,
        hints: [
          "crea dos repositorios con distintos `T`.",
          "la clase genérica no necesita `if` por tipo.",
          "cada resultado conserva su tipo concreto.",
        ],
        difficulty: "hard",
        xpReward: 42,
        testCases: [
          {
            visible: true,
            stdin: "P1\n5\nC1\nAna\nP1\nC1\n",
            expectedStdout: "PRODUCTO 5\nCLIENTE Ana\n",
          },
          {
            visible: false,
            stdin: "P\n0\nC\nLuis\nX\nC\n",
            expectedStdout: "PRODUCTO NO\nCLIENTE Luis\n",
          },
          {
            visible: false,
            stdin: "A\n9\nB\nSol\nA\nX\n",
            expectedStdout: "PRODUCTO 9\nCLIENTE NO\n",
          },
        ],
      },
    },
  ],
});
