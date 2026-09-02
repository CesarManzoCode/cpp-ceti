import type { PracticeExerciseDefinition } from "../../../../exercises/types";

export const practice = [
  {
    slug: "csharp-poo2-caja-generica",
    title: "Caja genérica",
    description: "Implementa un contenedor type-safe reutilizado con dos tipos.",
    prompt:
      "crea `Caja<T>` con `Guardar(T)` y `Obtener()`. Lee string e int, usa dos cajas e imprime ambos.",
    starterCode: `using System;
class Caja<T> { }
class Program { static void Main() { } }`,
    solutionCode: `using System;
class Caja<T>{private T valor;public void Guardar(T v){valor=v;}public T Obtener(){return valor;}}
class Program{static void Main(){Caja<string> a=new Caja<string>();a.Guardar(Console.ReadLine());Caja<int>b=new Caja<int>();b.Guardar(int.Parse(Console.ReadLine()));Console.WriteLine(a.Obtener());Console.WriteLine(b.Obtener());}}`,
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      { stdin: "Hola\n3\n", expectedStdout: "Hola\n3\n", visible: true },
      { stdin: "X Y\n0\n", expectedStdout: "X Y\n0\n", visible: false },
      { stdin: "Z\n-1\n", expectedStdout: "Z\n-1\n", visible: false },
    ],
  },
  {
    slug: "csharp-poo2-repositorio-productos",
    title: "Repositorio de productos",
    description:
      "Reutiliza `Repositorio<T>` para almacenar una colección de objetos tipados.",
    prompt:
      "implementa `Repositorio<T>` con `Agregar`, `Cantidad`, `Obtener`. Lee `n` productos (`codigo`,`stock`), agrega objetos y consulta un índice. Imprime `cantidad` y `codigo stock`.",
    starterCode: `using System;
using System.Collections.Generic;
class Producto { }
class Repositorio<T> { }
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Collections.Generic;
class Producto{public string Codigo{get;private set;}public int Stock{get;private set;}public Producto(string c,int s){Codigo=c;Stock=s;}}
class Repositorio<T>{private List<T>d=new List<T>();public void Agregar(T x){d.Add(x);}public int Cantidad(){return d.Count;}public T Obtener(int i){return d[i];}}
class Program{static void Main(){int n=int.Parse(Console.ReadLine());Repositorio<Producto>r=new Repositorio<Producto>();for(int i=0;i<n;i++)r.Agregar(new Producto(Console.ReadLine(),int.Parse(Console.ReadLine())));int idx=int.Parse(Console.ReadLine());Producto p=r.Obtener(idx);Console.WriteLine(r.Cantidad());Console.WriteLine(p.Codigo+" "+p.Stock);}}`,
    difficulty: "medium",
    xpReward: 32,
    testCases: [
      {
        stdin: "2\nA\n1\nB\n2\n1\n",
        expectedStdout: "2\nB 2\n",
        visible: true,
      },
      {
        stdin: "1\nX\n0\n0\n",
        expectedStdout: "1\nX 0\n",
        visible: false,
      },
      {
        stdin: "3\nA\n4\nB\n5\nC\n6\n2\n",
        expectedStdout: "3\nC 6\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-metodo-mostrar",
    title: "Método genérico Primero",
    description: "Parametriza una operación puntual sobre listas de tipos distintos.",
    prompt:
      "implementa `Primero<T>(List<T>)`. Lee tres strings y tres ints; imprime el primer elemento de cada lista.",
    starterCode: `using System;
using System.Collections.Generic;
class Program { static T Primero<T>(List<T> x) { } static void Main() { } }`,
    solutionCode: `using System;using System.Collections.Generic;
class Program{static T Primero<T>(List<T>x){return x[0];}static void Main(){List<string>a=new List<string>();for(int i=0;i<3;i++)a.Add(Console.ReadLine());List<int>b=new List<int>();for(int i=0;i<3;i++)b.Add(int.Parse(Console.ReadLine()));Console.WriteLine(Primero<string>(a));Console.WriteLine(Primero<int>(b));}}`,
    difficulty: "easy",
    xpReward: 24,
    testCases: [
      { stdin: "A\nB\nC\n1\n2\n3\n", expectedStdout: "A\n1\n", visible: true },
      {
        stdin: "X Y\nZ\nQ\n0\n9\n8\n",
        expectedStdout: "X Y\n0\n",
        visible: false,
      },
      {
        stdin: "uno\ndos\ntres\n-2\n0\n2\n",
        expectedStdout: "uno\n-2\n",
        visible: false,
      },
    ],
  },
  {
    slug: "csharp-poo2-repositorio-con-restriccion",
    title: "Repositorio restringido",
    description: "Usa una clase base como contrato para buscar cualquier entidad por ID.",
    prompt:
      "crea `Entidad(Id)`, `Bien : Entidad (Nombre)` y `Repositorio<T> where T : Entidad` con `Agregar`/`Buscar`. Lee `n` bienes y una consulta; imprime nombre o `NO`.",
    starterCode: `using System;
using System.Collections.Generic;
class Entidad { }
class Bien : Entidad { }
class Repositorio<T> where T : Entidad { }
class Program { static void Main() { } }`,
    solutionCode: `using System;using System.Collections.Generic;
class Entidad{public string Id{get;private set;}public Entidad(string id){Id=id;}}
class Bien:Entidad{public string Nombre{get;private set;}public Bien(string id,string n):base(id){Nombre=n;}}
class Repositorio<T> where T:Entidad{private List<T>d=new List<T>();public void Agregar(T x){d.Add(x);}public T Buscar(string id){for(int i=0;i<d.Count;i++)if(d[i].Id==id)return d[i];return null;}}
class Program{static void Main(){int n=int.Parse(Console.ReadLine());Repositorio<Bien>r=new Repositorio<Bien>();for(int i=0;i<n;i++)r.Agregar(new Bien(Console.ReadLine(),Console.ReadLine()));Bien b=r.Buscar(Console.ReadLine());Console.WriteLine(b==null?"NO":b.Nombre);}}`,
    difficulty: "hard",
    xpReward: 40,
    testCases: [
      {
        stdin: "2\nA\nMesa\nB\nSilla\nB\n",
        expectedStdout: "Silla\n",
        visible: true,
      },
      {
        stdin: "1\nX\nLaptop\nY\n",
        expectedStdout: "NO\n",
        visible: false,
      },
      {
        stdin: "3\nA\nUno\nB\nDos\nC\nTres\nA\n",
        expectedStdout: "Uno\n",
        visible: false,
      },
    ],
  },
] satisfies PracticeExerciseDefinition[];
